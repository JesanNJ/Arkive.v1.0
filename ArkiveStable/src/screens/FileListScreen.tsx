import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';

type Props = {
  files: any[];
  onEncrypt: () => void;
  onDecrypt?: () => void;  // 🔥 NEW
  onOpenFile: (file: any, index: number) => void;
};

const FileListScreen = ({ files, onEncrypt, onDecrypt, onOpenFile }: Props) => {
  
  // 🔥 CHECK IF FILES ARE ENCRYPTED
  const hasEncryptedFiles = files.some(file => file.name.endsWith('.ark'));
  const hasUnencryptedFiles = files.some(file => !file.name.endsWith('.ark'));

  const renderItem = ({ item, index }: any) => {
    const isEncrypted = item.name.endsWith('.ark');
    
    return (
      <TouchableOpacity
        style={styles.fileCard}
        onPress={() => onOpenFile(item, index)}
      >
        <View style={styles.fileInfo}>
          <Text style={styles.fileName}>{item.name}</Text>
          <Text style={styles.fileSize}>
            {(item.size / 1024).toFixed(2)} KB
          </Text>
        </View>
        
        {/* 🔥 SHOW ENCRYPTED/DECRYPTED BADGE */}
        {isEncrypted && (
          <View style={styles.encryptedBadge}>
            <Text style={styles.badgeText}>🔒 Encrypted</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selected Files</Text>
      
      <FlatList
        data={files}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
      />

      {/* 🔥 DYNAMIC BUTTON BASED ON FILE TYPE */}
      {hasEncryptedFiles && (
        <TouchableOpacity 
          style={[styles.actionBtn, styles.decryptBtn]} 
          onPress={onDecrypt}
        >
          <Text style={styles.actionText}>🔓 Decrypt Files</Text>
        </TouchableOpacity>
      )}

      {hasUnencryptedFiles && (
        <TouchableOpacity 
          style={[styles.actionBtn, styles.encryptBtn]} 
          onPress={onEncrypt}
        >
          <Text style={styles.actionText}>🔐 Encrypt Files</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FileListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020c1b',
    padding: 20,
  },
  title: {
    color: '#e6f1ff',
    fontSize: 22,
    marginBottom: 20,
  },
  fileCard: {
    backgroundColor: '#112240',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    color: '#fff',
    marginBottom: 4,
  },
  fileSize: {
    color: '#8892b0',
    fontSize: 12,
  },
  encryptedBadge: {
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#64ffda',
  },
  badgeText: {
    color: '#64ffda',
    fontSize: 10,
    fontWeight: '600',
  },
  actionBtn: {
    marginTop: 20,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  encryptBtn: {
    backgroundColor: '#1E7A85',
  },
  decryptBtn: {
    backgroundColor: '#64ffda',
  },
  actionText: {
    color: '#0a192f',
    fontWeight: '700',
    fontSize: 16,
  },
});