import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Alert,
  Image,
} from 'react-native';

import DocumentPicker from 'react-native-document-picker';
import LoginBackground from '../components/LoginBackground';

const { width } = Dimensions.get('window');

type Props = {
  onGoToEncryption: (files: any) => void;
  user: {
    name: string;
    photo?: string;
  };
};

const HomeScreen = ({ onGoToEncryption, user }: Props) => {

  // 🔥 Greeting logic
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // 🔥 User processing
  const firstName = user?.name?.split(' ')[0] || 'User';
  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || 'U';

  // 🔥 File picker
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        allowMultiSelection: true,
        type: [DocumentPicker.types.allFiles],
      });

      onGoToEncryption(result);

    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Error picking file');
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Background */}
      <View style={StyleSheet.absoluteFillObject}>
        <LoginBackground />
      </View>

      {/* Overlay */}
      <View style={styles.overlay} />

      {/* 🔥 GLASS HEADER */}
      <View style={styles.headerGlass}>
        <Text style={styles.appName}>Arkive</Text>

        <View style={styles.userRow}>
          {user?.photo ? (
            <Image source={{ uri: user.photo }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{firstLetter}</Text>
            </View>
          )}
          <Text style={styles.username}>{firstName}</Text>
        </View>
      </View>

      {/* 🔥 GREETING */}
      <View style={styles.greetingBox}>
        <Text style={styles.greeting}>
          {getGreeting()}, {firstName} 👋
        </Text>
      </View>

      {/* 🔥 GLASS UPLOAD BOX */}
      <View style={styles.uploadGlass}>
        <Text style={styles.sectionTitle}>Secure Upload</Text>

        <TouchableOpacity style={styles.bigBtn} onPress={pickFile}>
          <Text style={styles.bigBtnText}>Select File / Files</Text>
        </TouchableOpacity>

        {/* 🔐 AES NOTE */}
        <Text style={styles.aesNote}>
          Your files are protected using AES encryption — secured on your device before upload.
        </Text>
      </View>

      {/* 🔥 FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.quote}>Your legacy, encrypted.</Text>
        <Text style={styles.footerText}>
          © 2026 Arkive. All rights reserved.
        </Text>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020c1b',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,25,47,0.25)',
  },

  /* 🔥 HEADER */
  headerGlass: {
    marginTop: 60,
    marginHorizontal: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 40,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(100,255,218,0.2)',
  },

  appName: {
    fontSize: 26,
    fontWeight: '900',
    color: '#e6f1ff',
  },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    backgroundColor: '#64ffda',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },

  avatarText: {
    color: '#0a192f',
    fontWeight: 'bold',
  },

  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 6,
  },

  username: {
    color: '#e6f1ff',
    fontWeight: '600',
  },

  /* 🔥 GREETING */
  greetingBox: {
    marginTop: 25,
    paddingHorizontal: 20,
  },

  greeting: {
    color: '#e6f1ff',
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 0.5,
    lineHeight: 32,
  },

  /* 🔥 UPLOAD BOX */
  uploadGlass: {
    marginTop: 40,
    marginHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 30,
    alignItems: 'center',

    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(100,255,218,0.15)',
  },

  sectionTitle: {
    color: '#e6f1ff',
    fontSize: 18,
    marginBottom: 20,
  },

  bigBtn: {
    backgroundColor: '#1E7A85',
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 18,
  },

  bigBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  aesNote: {
    color: '#8892b0',
    fontSize: 12,
    marginTop: 15,
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  /* 🔥 FOOTER */
  footer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },

  quote: {
    color: '#64ffda',
    fontSize: 14,
    textAlign: 'center',
  },

  footerText: {
    color: '#8892b0',
    fontSize: 12,
    textAlign: 'center',
  },
});