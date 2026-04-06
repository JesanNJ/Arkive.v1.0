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

const { width } = Dimensions.get('window');

type Props = {
  files: any[];
  initialIndex?: number;
  onBack: () => void;
  onBackToHome: () => void;
};

const FileViewerScreen = ({ files, initialIndex = 0, onBack, onBackToHome }: Props) => {
  const flatListRef = useRef<FlatList>(null);

  // 📥 SAVE SINGLE FILE
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

  // 📥 SAVE ALL FILES
  const saveAllToDownloads = async () => {
    try {
      let successCount = 0;
      let failCount = 0;

      for (const file of files) {
        try {
          const dest = `${RNFS.DownloadDirectoryPath}/${file.name}`;
          await RNFS.copyFile(file.uri.replace('file://', ''), dest);
          successCount++;
        } catch (e) {
          console.log('Failed to save:', file.name, e);
          failCount++;
        }
      }

      if (failCount === 0) {
        Alert.alert('✅ All Saved', `${successCount} file(s) saved to Downloads`);
      } else {
        Alert.alert('⚠️ Partial Save', `${successCount} saved, ${failCount} failed`);
      }
    } catch (e) {
      Alert.alert('❌ Error saving files');
    }
  };

  // ☁️ SHARE
  const shareFile = async (file: any) => {
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

    const isArk = fileType === 'application/ark' || item.name.endsWith('.ark');
    const isImage = fileType.startsWith('image/');
    const isVideo = fileType.startsWith('video/');
    const isPDF = fileType.includes('pdf');

    return (
      <View style={styles.page}>

        {isArk && (
          <View style={styles.arkContainer}>
            <Text style={styles.arkIcon}>🔐</Text>
            <Text style={styles.arkText}>Encrypted .ark file</Text>
            <Text style={styles.arkSubText}>Decrypt to view contents</Text>
          </View>
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
          <View style={styles.noPreviewContainer}>
            <Text style={styles.noPreviewIcon}>📁</Text>
            <Text style={styles.noPreviewText}>Preview not available</Text>
          </View>
        )}

        {/* FILE INFO */}
        <View style={styles.info}>
          <Text style={styles.fileName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.fileMeta}>{(item.size / 1024).toFixed(2)} KB</Text>
        </View>

        {/* ACTION BUTTONS */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => saveToDownloads(item)}
          >
            <Text style={styles.btnText}>📥 Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => shareFile(item)}
          >
            <Text style={styles.btnText}>☁️ Share</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Preview</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity onPress={onBackToHome} style={styles.homeBtn}>
            <Text style={styles.homeBtnText}>🏠 Home</Text>
          </TouchableOpacity>

          {files.length > 1 && (
            <TouchableOpacity onPress={saveAllToDownloads} style={styles.saveAllBtn}>
              <Text style={styles.saveAllText}>📥 Save All ({files.length})</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={files}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        initialScrollIndex={initialIndex}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

    </View>
  );
};

export default FileViewerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020c1b',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(100,255,218,0.1)',
  },
  headerBtn: {
    minWidth: 60,
  },
  back: {
    color: '#64ffda',
    fontSize: 15,
  },
  headerTitle: {
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 60,
    justifyContent: 'flex-end',
  },
  homeBtn: {
    backgroundColor: 'rgba(100,255,218,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#64ffda',
  },
  homeBtnText: {
    color: '#64ffda',
    fontSize: 12,
    fontWeight: '600',
  },
  saveAllBtn: {
    backgroundColor: '#1E7A85',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  saveAllText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  page: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  preview: {
    width: '100%',
    height: '55%',
  },
  arkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '55%',
  },
  arkIcon: {
    fontSize: 64,
    marginBottom: 12,
  },
  arkText: {
    color: '#64ffda',
    fontSize: 18,
    fontWeight: '600',
  },
  arkSubText: {
    color: '#8892b0',
    fontSize: 13,
    marginTop: 6,
  },
  noPreviewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '55%',
  },
  noPreviewIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  noPreviewText: {
    color: '#8892b0',
    fontSize: 15,
  },
  info: {
    marginTop: 16,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  fileName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  fileMeta: {
    color: '#8892b0',
    fontSize: 12,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  btn: {
    backgroundColor: '#1E7A85',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
});