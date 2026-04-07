import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';

import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import Video from 'react-native-video';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

const FileViewerScreen = ({ files, initialIndex = 0, onBack, onBackToHome }) => {
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(initialIndex * width)).current;

  // 📥 SAVE SINGLE
  const saveToDownloads = async (file) => {
    try {
      const dest = `${RNFS.DownloadDirectoryPath}/${file.name}`;
      await RNFS.copyFile(file.uri.replace('file://', ''), dest);
      Alert.alert('✅ Saved');
    } catch {
      Alert.alert('❌ Error saving file');
    }
  };

  // 📥 SAVE ALL
  const saveAllToDownloads = async () => {
    try {
      for (const file of files) {
        const dest = `${RNFS.DownloadDirectoryPath}/${file.name}`;
        await RNFS.copyFile(file.uri.replace('file://', ''), dest);
      }
      Alert.alert('✅ All files saved');
    } catch {
      Alert.alert('❌ Error saving files');
    }
  };

  const shareFile = async (file) => {
    try {
      await Share.open({ url: file.uri, type: file.type });
    } catch {}
  };

  const renderItem = ({ item }) => {
    const type = item.type || '';
    const uri = item.uri;

    const isArk = item.name.endsWith('.ark');
    const isImage = type.startsWith('image/');
    const isVideo = type.startsWith('video/');
    const isPDF = type.includes('pdf');

    return (
      <View style={styles.page}>

        {/* 🔥 TRUE CENTER (NOT FLEX 1 TRICK) */}
        <View style={styles.centerBlock}>

          {isArk && (
            <View style={styles.arkContainer}>
              <Text style={styles.arkIcon}>🔐</Text>
              <Text style={styles.arkText}>Encrypted .ark file</Text>
            </View>
          )}

          {isImage && <Image source={{ uri }} style={styles.preview} resizeMode="contain" />}
          {isVideo && <Video source={{ uri }} style={styles.preview} controls />}
          {isPDF && <WebView source={{ uri }} style={styles.preview} />}

          {!isImage && !isVideo && !isPDF && !isArk && (
            <View style={styles.noPreviewContainer}>
              <Text style={styles.noPreviewIcon}>📁</Text>
              <Text style={styles.noPreviewText}>Preview not available</Text>
            </View>
          )}

        </View>

        {/* 🔥 INFO + ACTIONS (MOVED UP) */}
        <View style={styles.bottomBlock}>
          <Text style={styles.fileName}>{item.name}</Text>
          <Text style={styles.fileMeta}>{(item.size / 1024).toFixed(2)} KB</Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.btn} onPress={() => saveToDownloads(item)}>
              <Text style={styles.btnText}>📥 Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={() => shareFile(item)}>
              <Text style={styles.btnText}>☁️ Share</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    );
  };

  return (
    <View style={styles.container}>

      {/* 🔥 HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Preview</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn} onPress={onBackToHome}>
            <Text style={styles.homeIcon}>🏠</Text>
            <Text style={styles.homeText}>Home</Text>
          </TouchableOpacity>

          {files.length > 1 && (
            <TouchableOpacity style={styles.headerBtn} onPress={saveAllToDownloads}>
              <Text style={styles.homeIcon}>📥</Text>
              <Text style={styles.homeText}>All</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 🔥 SWIPE VIEW */}
      <Animated.FlatList
        ref={flatListRef}
        data={files}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderItem}
        initialScrollIndex={initialIndex}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      />

      {/* 🔥 DOTS */}
      <View style={styles.pagination}>
        {files.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [6, 20, 6],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[styles.dot, { width: dotWidth }]}
            />
          );
        })}
      </View>

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
    gap: 10,
  },

  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  homeIcon: {
    fontSize: 14,
    color: '#64ffda',
  },

  homeText: {
    color: '#64ffda',
    fontSize: 12,
    fontWeight: '600',
  },

  page: {
    width,
    height: height * 0.8,
    alignItems: 'center',
  },

  // 🔥 REAL CENTER
  centerBlock: {
    position: 'absolute',
    top: height * 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  preview: {
    width: width * 0.9,
    height: width * 0.9,
  },

  arkContainer: {
    alignItems: 'center',
  },

  arkIcon: {
    fontSize: 70,
  },

  arkText: {
    color: '#64ffda',
    fontSize: 18,
    marginTop: 10,
  },

  noPreviewContainer: {
    alignItems: 'center',
  },

  noPreviewIcon: {
    fontSize: 50,
  },

  noPreviewText: {
    color: '#8892b0',
  },

  // 🔥 MOVED UP
  bottomBlock: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
  },

  fileName: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
  },

  fileMeta: {
    color: '#8892b0',
    fontSize: 12,
    marginTop: 4,
  },

  actions: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },

  btn: {
    backgroundColor: '#1E7A85',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 12,
  },

  btnText: {
    color: '#fff',
    fontWeight: '600',
  },

  pagination: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    alignSelf: 'center',
  },

  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#64ffda',
    marginHorizontal: 4,
  },
});