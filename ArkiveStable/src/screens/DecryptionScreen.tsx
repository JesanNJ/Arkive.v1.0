import { addFileToHistory } from '../services/storageService';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { decryptFileInChunks } from '../services/chunkEncryptionService';
import { getStoredKey } from '../services/encryptionService';

type Props = {
  files: any[];
  onComplete?: (files: any[]) => void;
  onBackToHome?: () => void;
};

const messages = [
  "Decrypting your files...",
  "Restoring your data...",
  "Almost done...",
];

const DecryptionScreen = ({ files, onComplete, onBackToHome }: Props) => {
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

        const decryptedFile = {
          uri: 'file://' + path,
          name: originalName,
          type: file.type,
          size: file.size,
        };

        outputFiles.push(decryptedFile);

        await addFileToHistory({
          id: Date.now().toString(),
          name: originalName,
          size: `${file.size} bytes`,
          uri: 'file://' + path,
          status: 'decrypted',
          timestamp: Date.now(),
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

      {/* 🔥 PREMIUM CARD */}
      <View style={styles.card}>

        <Text style={styles.title}>🔓 Decrypting</Text>

        <Animated.Text style={[styles.message, { opacity: fadeAnim }]}>
          {messages[index]}
        </Animated.Text>

        {/* PROGRESS BAR */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        <Text style={styles.percent}>{progress}%</Text>

      </View>

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

  /* 🔥 CARD (same as encryption) */
  card: {
    width: '85%',
    padding: 24,
    borderRadius: 24,

    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',

    alignItems: 'center',
  },

  title: {
    color: '#e6f1ff',
    fontSize: 22,
    fontWeight: '700',
  },

  message: {
    color: '#8892b0',
    marginVertical: 20,
    textAlign: 'center',
  },

  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: '#112240',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#17A697',
    borderRadius: 10,
  },

  percent: {
    color: '#17A697',
    marginTop: 12,
    fontWeight: '600',
  },
});