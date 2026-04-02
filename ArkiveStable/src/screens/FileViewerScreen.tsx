import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';

import RNFS from 'react-native-fs';
import Share from 'react-native-share';

import Video from 'react-native-video';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

type Props = {
  files: any[];
  initialIndex?: number;
  onBack: () => void;
};

const FileViewerScreen = ({ files, initialIndex = 0, onBack }: Props) => {
  const flatListRef = useRef<FlatList>(null);

  // 📥 SAVE TO DOWNLOADS
  const saveToDownloads = async (file: any) => {
    try {
      const dest = `${RNFS.DownloadDirectoryPath}/${file.name}`;

      await RNFS.copyFile(file.uri.replace('file://', ''), dest);

      Alert.alert('✅ Saved', 'File saved to Downloads');
    } catch (e) {
      console.log(e);
      Alert.alert('❌ Error saving file');
    }
  };

  // ☁️ SHARE (UPLOAD TO DRIVE)
  const uploadToDrive = async (file: any) => {
    try {
      await Share.open({
        url: file.uri,
        type: file.type,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const renderItem = ({ item }: any) => {
    const fileType = item.type || '';
    const uri = item.uri;

    const isArk = fileType === 'application/ark';
    const isImage = fileType.startsWith('image/');
    const isVideo = fileType.startsWith('video/');
    const isPDF = fileType.includes('pdf');

    return (
      <View style={styles.page}>

        {isArk && (
          <Text style={styles.arkText}>
            🔐 Encrypted .ark file
          </Text>
        )}

        {isImage && (
          <Image source={{ uri }} style={styles.preview} resizeMode="contain" />
        )}

        {isVideo && (
          <Video source={{ uri }} style={styles.preview} controls />
        )}

        {isPDF && (
          <WebView source={{ uri }} style={styles.preview} />
        )}

        {!isImage && !isVideo && !isPDF && !isArk && (
          <Text style={styles.noPreviewText}>Preview not available</Text>
        )}

        {/* 📁 INFO */}
        <View style={styles.info}>
          <Text style={styles.fileName}>{item.name}</Text>
          <Text style={styles.fileMeta}>
            {(item.size / 1024).toFixed(2)} KB
          </Text>
        </View>

        {/* 🔥 ACTION BUTTONS */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => saveToDownloads(item)}
          >
            <Text style={styles.btnText}>📥 Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => uploadToDrive(item)}
          >
            <Text style={styles.btnText}>☁️ Drive</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preview</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={files}
        horizontal
        pagingEnabled
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};

export default FileViewerScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020c1b' },

  header: {
    flexDirection: 'row',
    padding: 16,
  },

  back: { color: '#64ffda' },
  headerTitle: { color: '#fff', marginLeft: 10 },

  page: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
  },

  preview: {
    width: '100%',
    height: '60%',
  },

  info: { marginTop: 10 },

  fileName: { color: '#fff' },
  fileMeta: { color: '#8892b0' },

  noPreviewText: { color: '#8892b0' },

  arkText: {
    color: '#64ffda',
    marginBottom: 20,
  },

  actions: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },

  btn: {
    backgroundColor: '#1E7A85',
    padding: 10,
    borderRadius: 10,
  },

  btnText: {
    color: '#fff',
  },
});