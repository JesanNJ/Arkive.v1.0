// SAME IMPORTS (UNCHANGED)
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

const { width, height } = Dimensions.get('window');

const FileViewerScreen = ({ files, initialIndex = 0, onBack, onBackToHome }) => {
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(initialIndex * width)).current;

  const saveToDownloads = async (file) => {
    try {
      const dest = `${RNFS.DownloadDirectoryPath}/${file.name}`;
      await RNFS.copyFile(file.uri.replace('file://', ''), dest);
      Alert.alert('✅ Saved');
    } catch {
      Alert.alert('❌ Error saving file');
    }
  };

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
    const isImage =
      type.startsWith('image/') ||
      item.name.match(/\.(jpg|jpeg|png)$/i);

    const isVideo =
      type.startsWith('video/') ||
      item.name.match(/\.(mp4|mov)$/i);

    const isPDF =
      type.includes('pdf') ||
      item.name.match(/\.pdf$/i);

    return (
      <View style={styles.page}>

        {/* 🔥 MAIN PREVIEW CARD */}
        <View style={styles.previewCard}>

          {isArk && (
            <>
              <Text style={styles.icon}>🔐</Text>
              <Text style={styles.title}>Encrypted File</Text>
            </>
          )}

          {isImage && <Image source={{ uri }} style={styles.preview} resizeMode="contain" />}
          {isVideo && <Video source={{ uri }} style={styles.preview} controls />}

          {isPDF && (
            <View style={styles.noPreviewContainer}>
              <Text style={styles.icon}>📄</Text>
              <Text style={styles.noPreviewText}>
                PDF preview not supported
              </Text>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => shareFile(item)}>
                <Text style={styles.secondaryText}>📂 Open PDF</Text>
              </TouchableOpacity>
            </View>
          )}

          {!isImage && !isVideo && !isPDF && !isArk && (
            <View style={styles.noPreviewContainer}>
              <Text style={styles.icon}>📁</Text>
              <Text style={styles.noPreviewText}>Preview not available</Text>
            </View>
          )}
        </View>

        {/* 🔥 FILE INFO CARD */}
        <View style={styles.infoCard}>
          <Text style={styles.fileName} numberOfLines={2}>
            {item.name}
          </Text>

          <Text style={styles.fileMeta}>
            {item.size
              ? (() => {
                  const sizeNum = parseInt(item.size);
                  if (isNaN(sizeNum)) return 'Unknown size';

                  if (sizeNum > 1024 * 1024) {
                    return `${(sizeNum / (1024 * 1024)).toFixed(2)} MB`;
                  }
                  return `${(sizeNum / 1024).toFixed(2)} KB`;
                })()
              : 'Unknown size'}
          </Text>
        </View>

        {/* 🔥 ACTION BUTTONS */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => saveToDownloads(item)}>
            <Text style={styles.primaryText}>📥 Save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryBtn} onPress={() => shareFile(item)}>
            <Text style={styles.primaryText}>☁️ Share</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Preview</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity onPress={onBackToHome}>
            <Text style={styles.home}>🏠</Text>
          </TouchableOpacity>

          {files.length > 1 && (
            <TouchableOpacity onPress={saveAllToDownloads}>
              <Text style={styles.home}>📥</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

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

      {/* DOTS */}
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
            <Animated.View key={index} style={[styles.dot, { width: dotWidth }]} />
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
    padding: 14,
    justifyContent: 'space-between',
  },

  back: {
    color: '#64ffda',
    fontSize: 14,
  },

  home: {
    color: '#64ffda',
    fontSize: 18,
  },

  headerTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },

  page: {
    width,
    alignItems: 'center',
  },

  /* 🔥 MAIN PREVIEW CARD */
  previewCard: {
    marginTop: 20,
    width: width * 0.9,
    height: 260,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  preview: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },

  icon: {
    fontSize: 50,
  },

  title: {
    color: '#17A697',
    marginTop: 10,
    fontSize: 14,
  },

  noPreviewContainer: {
    alignItems: 'center',
  },

  noPreviewText: {
    color: '#8892b0',
    marginTop: 10,
    textAlign: 'center',
  },

  secondaryBtn: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#112240',
  },

  secondaryText: {
    color: '#fff',
  },

  /* 🔥 FILE INFO CARD */
  infoCard: {
    marginTop: 20,
    width: width * 0.9,
    padding: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  fileName: {
    color: '#fff',
    fontSize: 14,
  },

  fileMeta: {
    color: '#8892b0',
    marginTop: 4,
    fontSize: 12,
  },

  /* 🔥 BUTTONS */
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },

  primaryBtn: {
    backgroundColor: '#17A697',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },

  primaryText: {
    color: '#fff',
    fontWeight: '600',
  },

  /* 🔥 DOTS */
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