import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { decryptFileInChunks } from '../services/chunkEncryptionService';
import { getStoredKey } from '../services/encryptionService';

type Props = {
  files: any[];
  onComplete?: (files: any[]) => void;
};

const messages = [
  "Decrypting your files...",
  "Restoring your data...",
  "Almost done...",
];

const DecryptionScreen = ({ files, onComplete }: Props) => {
  const [progress, setProgress] = useState(0);
  const [index, setIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    processDecryption();
  }, []);

const processDecryption = async () => {
  try {
    const key = await getStoredKey();

    if (!key) {
      console.log('❌ No encryption key found');
      return;
    }

    let outputFiles: any[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const { path, originalName } = await decryptFileInChunks(
        file.uri,
        key,
        (chunkPercent) => {
          const overall = Math.round(
            ((i / files.length) + (chunkPercent / 100 / files.length)) * 100
          );
          setProgress(overall);
        }
      );

      outputFiles.push({
        uri: 'file://' + path,
        name: originalName,
        type: file.type,
        size: file.size,
      });
    }

    setTimeout(() => {
      if (onComplete) {
        onComplete(outputFiles);
      } else {
        console.log('❌ onComplete not passed');
      }
    }, 500);

  } catch (e) {
    console.log('❌ Decryption Error:', e);
  }
};

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setIndex((prev) => (prev + 1) % messages.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Decrypting 🔓</Text>
      <Animated.Text style={[styles.message, { opacity: fadeAnim }]}>
        {messages[index]}
      </Animated.Text>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <Text style={styles.percent}>{progress}%</Text>
    </View>
  );
};

export default DecryptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020c1b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 20,
  },
  message: {
    color: '#8892b0',
    marginVertical: 20,
  },
  progressBar: {
    width: '80%',
    height: 10,
    backgroundColor: '#112240',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#64ffda',
  },
  percent: {
    color: '#64ffda',
    marginTop: 10,
  },
});
