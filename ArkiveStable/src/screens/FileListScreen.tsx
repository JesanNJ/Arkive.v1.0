import React, { useState, useEffect } from 'react';
import DocumentPicker from 'react-native-document-picker';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
// @ts-ignore
import Video from 'react-native-video';

const { width, height } = Dimensions.get('window');

type Props = {
  files: any[];
  setFiles: (files: any[]) => void;
  onEncrypt: () => void;
  onDecrypt?: () => void;
  onOpenFile: (file: any, index: number) => void;
  onBack: () => void;
};

const FileListScreen = ({
  files,
  setFiles,
  onEncrypt,
  onDecrypt,
  onOpenFile,
  onBack,
}: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const hasEncryptedFiles = files.some(f => f.name?.endsWith('.ark'));
  const hasUnencryptedFiles =
    files.length > 0 && files.some(f => !f.name?.endsWith('.ark'));

  useEffect(() => {
    if (files.length > 0 && activeIndex >= files.length) {
      setActiveIndex(0);
    }
  }, [files]);

  const handleAddFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });

      setFiles([...files, ...res]);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.log('Picker error:', err);
      }
    }
  };

  const renderPreview = (item: any) => {
    if (!item) return null;
    const type = item.type || '';

    if (item.name?.endsWith('.ark')) {
      return (
        <View style={styles.previewBox}>
          <Text style={styles.previewIcon}>🔐</Text>
          <Text style={styles.previewLabel}>Encrypted File</Text>
        </View>
      );
    }

    if (type.startsWith('image/')) {
      return <Image source={{ uri: item.uri }} style={styles.previewImage} />;
    }

    if (type.startsWith('video/')) {
      return (
        <Video source={{ uri: item.uri }} style={styles.previewImage} paused />
      );
    }

    if (item.name?.toLowerCase().endsWith('.pdf')) {
      return (
        <View style={styles.previewBox}>
          <Text style={styles.previewIcon}>📄</Text>
          <Text style={styles.previewLabel}>PDF File</Text>
        </View>
      );
    }

    return (
      <View style={styles.previewBox}>
        <Text style={styles.previewIcon}>📁</Text>
        <Text style={styles.previewLabel}>No Preview</Text>
      </View>
    );
  };

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity
      style={[
        styles.fileCard,
        index === activeIndex && styles.activeCard,
      ]}
      onPress={() => {
        setActiveIndex(index);
        onOpenFile(item, index);
      }}
    >
      <Text style={styles.fileName} numberOfLines={1}>
        {item.name}
      </Text>
      {item.name?.endsWith('.ark') && <Text>🔐</Text>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#020c1b" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Selected Files</Text>

        <TouchableOpacity onPress={handleAddFile}>
          <Text style={styles.add}>＋</Text>
        </TouchableOpacity>
      </View>

      {files.length > 0 ? (
        <>
          {/* 🔥 PREVIEW SLIDER */}
          <FlatList
            data={files}
            horizontal
            style={{ maxHeight: width * 0.8 }} // 🔥 IMPORTANT FIX
            contentContainerStyle={{ alignItems: 'flex-start' }} // 🔥 TOP ALIGN
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => i.toString()}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x / width
              );
              setActiveIndex(index);
            }}
            renderItem={({ item }) => (
              <View style={styles.previewContainer}>
                {renderPreview(item)}
              </View>
            )}
          />

          {/* 🔥 FIXED DOTS */}
          <View style={styles.pagination}>
            {files.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  activeIndex === index && styles.activeDot,
                ]}
              />
            ))}
          </View>

          {/* 🔥 NEW TEXT */}
          <Text style={styles.previewAvailable}>
            Swipe for preview
          </Text>

          {/* 🔥 NEW DIVIDER */}
          <View style={styles.divider} />

          {/* 🔥 SCROLLABLE FILE LIST AREA */}
          <View style={styles.listWrapper}>
            <FlatList
              data={files}
              renderItem={renderItem}
              keyExtractor={(_, i) => i.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 120 }}
            />
          </View>
        </>
      ) : (
        <View style={styles.empty}>
          <Text style={{ color: '#8892b0' }}>No files selected</Text>
          <TouchableOpacity onPress={handleAddFile}>
            <Text style={{ color: '#64ffda', marginTop: 10 }}>
              + Add Files
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* FOOTER */}
      <View style={styles.footer}>
        {hasEncryptedFiles && (
          <TouchableOpacity style={styles.decrypt} onPress={onDecrypt}>
            <Text style={styles.actionText}>🔓 Decrypt Files</Text>
          </TouchableOpacity>
        )}

        {hasUnencryptedFiles && (
          <TouchableOpacity style={styles.encrypt} onPress={onEncrypt}>
            <Text style={styles.actionText}>🔐 Encrypt Files</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default FileListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020c1b',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  back: {
    color: '#64ffda',
    fontSize: 16,
  },

  add: {
    color: '#64ffda',
    fontSize: 28,
  },

  title: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },

  // 🔥 PREVIEW CONTAINER (TIGHTENED)
  previewContainer: {
  width: width,
  alignItems: 'center',
  justifyContent: 'flex-start', // 🔥 FIX (top align)
  paddingTop: 5, // optional small spacing
},

  // 🔥 BIGGER BUT CONTROLLED PREVIEW
  previewImage: {
    width: width * 0.92,
    height: width*0.78, // reduced from 0.72
    borderRadius: 20,
  },

  previewBox: {
    width: width * 0.92,
    height: width*0.78, // reduced from 0.72
    borderRadius: 20,
    backgroundColor: '#112240',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#233554',
  },

  previewIcon: {
    fontSize: 50,
  },

  previewLabel: {
    color: '#8892b0',
    marginTop: 6,
  },

  // 🔥 DOTS (TIGHT)
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#233554',
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: '#64ffda',
    width: 18,
  },

  // 🔥 TEXT BELOW DOTS
  previewAvailable: {
    textAlign: 'center',
    color: '#8892b0',
    fontSize: 11,
    marginTop: 4,
  },

  // 🔥 DIVIDER (CLOSER)
  divider: {
    height: 1,
    backgroundColor: '#233554',
    marginHorizontal: 20,
    marginTop: 12,
  },

  // 🔥 FILE LIST WRAPPER (REMOVES GAP)
  listWrapper: {
    flex: 1,
    marginTop: 5,
  },

  // 🔥 FILE CARD
  fileCard: {
    backgroundColor: '#112240',
    padding: 15,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  activeCard: {
    borderColor: '#64ffda',
    borderWidth: 1,
    shadowColor: '#64ffda',
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 5,
  },

  fileName: {
    color: '#fff',
    flex: 1,
  },

  // 🔥 FOOTER FIXED POSITION
  footer: {
    position: 'absolute',
    bottom: 15,
    width: '100%',
  },

  encrypt: {
    backgroundColor: '#1E7A85',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },

  decrypt: {
    backgroundColor: '#1E7A85',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 12,
    alignItems: 'center',
  },

  actionText: {
    color: '#ffffff',
    fontWeight: '700',
  },

  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});