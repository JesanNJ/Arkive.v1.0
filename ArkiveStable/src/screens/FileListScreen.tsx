import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Video from 'react-native-video';

const { width } = Dimensions.get('window');

type Props = {
  files: any[];
  onEncrypt: () => void;
  onDecrypt?: () => void;
  onOpenFile: (file: any, index: number) => void;
  onBack: () => void;
};

const FileListScreen = ({ files, onEncrypt, onDecrypt, onOpenFile, onBack }: Props) => {

  const hasEncryptedFiles = files.some(file => file.name.endsWith('.ark'));
  const hasUnencryptedFiles = files.some(file => !file.name.endsWith('.ark'));

  // 🔥 FILE PREVIEW COMPONENT
  const renderPreview = (item: any) => {
    const fileType = item.type || '';
    const uri = item.uri;

    const isArk = item.name.endsWith('.ark');
    const isImage = fileType.startsWith('image/');
    const isVideo = fileType.startsWith('video/');
    const isPDF = fileType.includes('pdf');

    if (isArk) {
      return (
        <View style={styles.previewBox}>
          <Text style={styles.previewIcon}>🔐</Text>
          <Text style={styles.previewLabel}>Encrypted File</Text>
        </View>
      );
    }

    if (isImage) {
      return (
        <Image
          source={{ uri }}
          style={styles.previewImage}
          resizeMode="cover"
        />
      );
    }

    if (isVideo) {
      return (
        <Video
          source={{ uri }}
          style={styles.previewImage}
          paused={true}
          resizeMode="cover"
        />
      );
    }

    if (isPDF) {
      return (
        <View style={styles.previewBox}>
          <Text style={styles.previewIcon}>📄</Text>
          <Text style={styles.previewLabel}>PDF Document</Text>
        </View>
      );
    }

    return (
      <View style={styles.previewBox}>
        <Text style={styles.previewIcon}>📁</Text>
        <Text style={styles.previewLabel}>No preview available</Text>
      </View>
    );
  };

  // 🔥 PREVIEW SECTION — swipeable if multiple files
  const renderPreviewSection = () => {
    if (files.length === 1) {
      return (
        <View style={styles.singlePreviewContainer}>
          {renderPreview(files[0])}
          <Text style={styles.previewFileName} numberOfLines={1}>
            {files[0].name}
          </Text>
        </View>
      );
    }

    return (
      <View>
        <FlatList
          data={files}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => 'preview_' + index}
          renderItem={({ item, index }) => (
            <View style={styles.slidePreviewContainer}>
              {renderPreview(item)}
              <Text style={styles.previewFileName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.slideCounter}>
                {index + 1} / {files.length}
              </Text>
            </View>
          )}
        />
        <Text style={styles.swipeHint}>← Swipe to preview all files →</Text>
      </View>
    );
  };

  const renderItem = ({ item, index }: any) => {
    const isEncrypted = item.name.endsWith('.ark');

    return (
      <TouchableOpacity
        style={styles.fileCard}
        onPress={() => onOpenFile(item, index)}
      >
        <View style={styles.fileInfo}>
          <Text style={styles.fileName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.fileSize}>
            {(item.size / 1024).toFixed(2)} KB
          </Text>
        </View>

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

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Selected Files</Text>
      </View>

      {/* 🔥 FILE PREVIEW SECTION */}
      {renderPreviewSection()}

      {/* DIVIDER */}
      <View style={styles.divider} />

      {/* FILE LIST */}
      <FlatList
        data={files}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        style={styles.list}
      />

      {/* ACTION BUTTONS */}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  backBtn: {
    color: '#64ffda',
    fontSize: 16,
  },
  title: {
    color: '#e6f1ff',
    fontSize: 22,
    fontWeight: '700',
  },

  // 🔥 PREVIEW STYLES
  singlePreviewContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  slidePreviewContainer: {
    width: width - 40,
    alignItems: 'center',
    marginBottom: 8,
  },
  previewImage: {
    width: width - 40,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#112240',
  },
  previewBox: {
    width: width - 40,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#112240',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(100,255,218,0.15)',
  },
  previewIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  previewLabel: {
    color: '#8892b0',
    fontSize: 14,
  },
  previewFileName: {
    color: '#e6f1ff',
    fontSize: 13,
    marginTop: 8,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  slideCounter: {
    color: '#8892b0',
    fontSize: 12,
    marginTop: 4,
  },
  swipeHint: {
    color: '#8892b0',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 8,
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(100,255,218,0.1)',
    marginVertical: 12,
  },

  list: {
    flex: 1,
  },

  // FILE CARD
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

  // ACTION BUTTONS
  actionBtn: {
    marginTop: 12,
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