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
  onOpenFile: (file: any, index: number) => void;
};

const FileListScreen = ({ files, onEncrypt, onOpenFile }: Props) => {

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity
      style={styles.fileCard}
      onPress={() => onOpenFile(item, index)}
    >
      <Text style={styles.fileName}>{item.name}</Text>
      <Text style={styles.fileSize}>
        {(item.size / 1024).toFixed(2)} KB
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selected Files</Text>

      <FlatList
        data={files}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
      />

      <TouchableOpacity style={styles.encryptBtn} onPress={onEncrypt}>
        <Text style={styles.encryptText}>Encrypt Files 🔐</Text>
      </TouchableOpacity>
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
  },
  fileName: {
    color: '#fff',
  },
  fileSize: {
    color: '#8892b0',
  },
  encryptBtn: {
    marginTop: 20,
    backgroundColor: '#1E7A85',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  encryptText: {
    color: '#fff',
    fontWeight: '700',
  },
});