import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import RNFS from 'react-native-fs';

import {
  generateAndStoreKey,
  encryptFileData,
} from '../services/encryptionService';

import { saveEncryptedFile } from '../services/fileService';

type Props = {
  files: any[];
  onComplete?: (files: any[]) => void;
};

const messages = [
  "Encrypting your files...",
  "Securing your data...",
  "Almost done...",
];

const EncryptionScreen = ({ files, onComplete }: Props) => {
  const [progress, setProgress] = useState(0);
  const [index, setIndex] = useState(0);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    processEncryption();
  }, []);

  const processEncryption = async () => {
    try {
      const key = await generateAndStoreKey();
      let outputFiles: any[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const base64 = await RNFS.readFile(file.uri, 'base64');
        const encrypted = await encryptFileData(base64, key, file);
        const path = await saveEncryptedFile(encrypted, file.name);

        outputFiles.push({
          uri: 'file://' + path,
          name: file.name + '.ark',
          type: 'application/ark',
          size: file.size,
        });

        const percent = Math.round(((i + 1) / files.length) * 100);
        setProgress(percent);
        setIndex(i % messages.length);
      }

      setTimeout(() => {
        if (onComplete) {
          onComplete(outputFiles);
        } else {
          console.log('❌ onComplete not passed');
        }
      }, 500);

    } catch (e) {
      console.log('❌ Encryption Error:', e);
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
      <Text style={styles.title}>Encrypting 🔐</Text>

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

export default EncryptionScreen;

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