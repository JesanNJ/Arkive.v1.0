// SAME IMPORTS (unchanged)
import { getStoredFiles } from '../services/storageService';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
  Alert,
} from 'react-native';

import DocumentPicker from 'react-native-document-picker';
import LoginBackground from '../components/LoginBackground';

const { width } = Dimensions.get('window');

const HomeScreen = ({
  onGoToEncryption,
  onGoToDecryption,
  onGoToViewer,
  user,
  onLogout,
}) => {

  const [historyFiles, setHistoryFiles] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const files = await getStoredFiles();
    setHistoryFiles(files);
  };

  const uniqueFiles = Object.values(
    historyFiles.reduce((acc, file) => {
      const baseName = file.name.replace('.ark', '');
      if (!acc[baseName] || acc[baseName].timestamp < file.timestamp) {
        acc[baseName] = file;
      }
      return acc;
    }, {})
  );

  const handleFilePress = (file) => {
  if (file?.status === 'encrypted') {
    Alert.alert(
      'Encrypted File',
      file.name + '\n\nWhat do you want to do?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decrypt',
          onPress: () => onGoToDecryption([file]),
        },
      ]
    );
  } else {
    Alert.alert(
      'Decrypted File',
      file.name + '\n\nWhat do you want to do?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open',
          onPress: () => onGoToViewer([file]),
        },
        {
          text: 'Re-encrypt',
          onPress: () => onGoToEncryption([file]),
        },
      ]
    );
  }
};

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        allowMultiSelection: true,
        type: [DocumentPicker.types.allFiles],
      });

      onGoToEncryption(result);
    } catch (err) {}
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const firstName = user?.name?.split(' ')[0] || 'User';
  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Background */}
      <View style={StyleSheet.absoluteFillObject}>
        <LoginBackground />
      </View>

      <View style={styles.overlay} />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.appName}>Arkive</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          
          {/* 🚪 LOGOUT ICON */}
          <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
  <Text style={styles.logoutText}>Logout</Text>
</TouchableOpacity>

          {/* Avatar */}
          {user?.photo ? (
            <Image source={{ uri: user.photo }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{firstLetter}</Text>
            </View>
          )}
        </View>
      </View>

      {/* MAIN CARD */}
      <View style={styles.mainCard}>
        <Text style={styles.greeting}>
          {getGreeting()}, {firstName} 👋
        </Text>

        <Text style={styles.subText}>
          Your vault is secure
        </Text>

        <TouchableOpacity style={styles.uploadBtn} onPress={pickFile}>
          <Text style={styles.uploadText}>Upload Files</Text>
        </TouchableOpacity>
      </View>

      {/* 🔥 PUSH RECENT FILES DOWN */}
      <View style={styles.historyWrapper}>

        <View style={styles.historyCard}>
          <Text style={styles.sectionTitle}>Recent Files</Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {uniqueFiles.length === 0 ? (
              <Text style={styles.emptyText}>No recent files</Text>
            ) : (
              uniqueFiles.slice(0, 8).map((file, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.fileItem}
                  onPress={() => handleFilePress(file)}
                  activeOpacity={0.85}
                >
                  <Text style={{ marginRight: 8 }}>
                    {file.status === 'encrypted' ? '🔐' : '📄'}
                  </Text>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {file.name}
                    </Text>

                    <Text style={styles.fileMeta}>
                      {file.size}
                    </Text>
                  </View>

                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {file.status === 'encrypted'
                        ? '🔐 Encrypted'
                        : '📂 Decrypted'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>

      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 Arkive • Secure Document Vault</Text>
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
    backgroundColor: 'rgba(10,25,47,0.3)',
  },

  header: {
    marginTop: 50,
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 20,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#e6f1ff',
  },

  avatar: {
    backgroundColor: '#17A697',
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtn: {
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 12,
  backgroundColor: 'rgba(255,255,255,0.05)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.1)',
},

logoutText: {
  color: '#64ffda',
  fontSize: 12,
  fontWeight: '600',
},
  avatarText: {
    color: '#000',
    fontWeight: 'bold',
  },

  avatarImage: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },

  mainCard: {
    marginTop: 25,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 22,

    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  greeting: {
    color: '#e6f1ff',
    fontSize: 22,
    fontWeight: '700',
  },

  subText: {
    color: '#8892b0',
    marginTop: 6,
    marginBottom: 20,
  },

  uploadBtn: {
    backgroundColor: '#17A697',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },

  uploadText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  /* 🔥 THIS PUSHES HISTORY DOWN */
  historyWrapper: {
      flex: 1,
      marginTop: 30,
  },

  historyCard: {
    height: 490,// 🔥 ADD THIS
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 22,

    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  sectionTitle: {
    color: '#e6f1ff',
    fontSize: 16,
    marginBottom: 10,
  },

  fileItem: {
    marginTop: 10,
    marginBottom: 8,
    padding: 14,
    borderRadius: 16,

    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',

    flexDirection: 'row',
    alignItems: 'center',
  },

  fileName: {
    color: '#fff',
    fontSize: 14,
  },

  fileMeta: {
    color: '#8892b0',
    fontSize: 12,
    marginTop: 2,
  },

  badge: {
    backgroundColor: '#17A697',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },

  emptyText: {
    color: '#8892b0',
    marginTop: 10,
  },

  footer: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },

  footerText: {
    color: '#555',
    fontSize: 10,
  },
});