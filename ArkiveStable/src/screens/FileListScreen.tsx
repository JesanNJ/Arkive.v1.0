import React, { useState } from 'react';
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

const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const FileListScreen = ({ files, setFiles, onEncrypt, onDecrypt, onOpenFile, onBack }: Props) => {
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);

  const hasEncryptedFiles = files.some(file => file.name.endsWith('.ark'));
  const hasUnencryptedFiles = files.some(file => !file.name.endsWith('.ark'));

  const handleAddFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });
      setFiles([...files, ...res]);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.log('Picker Error: ', err);
      }
    }
  };

  const renderPreview = (item: any) => {
    if (!item) return null;
    const fileType = item.type || '';
    const uri = item.uri;
    if (item.name.endsWith('.ark')) {
      return (
        <View style={styles.previewBox}>
          <Text style={styles.previewIcon}>🔐</Text>
          <Text style={styles.previewLabel}>Encrypted Arkive</Text>
        </View>
      );
    }
    if (fileType.startsWith('image/')) {
      return <Image source={{ uri }} style={styles.previewImage} resizeMode="cover" />;
    }
    if (fileType.startsWith('video/')) {
      return <Video source={{ uri }} style={styles.previewImage} paused={true} resizeMode="contain" />;
    }
    if (fileType.includes('pdf') || item.name.toLowerCase().endsWith('.pdf')) {
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
        <Text style={styles.previewLabel}>No preview available</Text>
      </View>
    );
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      style={[styles.fileCard, activePreviewIndex === index && styles.activeFileCard]}
      onPress={() => { setActivePreviewIndex(index); onOpenFile(item, index); }}
    >
      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.fileSize}>{formatBytes(item.size)}</Text>
      </View>
      {item.name.endsWith('.ark') && <Text style={{ fontSize: 18 }}>🔐</Text>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#020c1b" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.headerSide} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Selected Files</Text>
        <TouchableOpacity onPress={handleAddFile} style={styles.headerSide} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.addBtn}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {files.length > 0 ? (
          <>
            <View style={styles.previewContainer}>
              {renderPreview(files[activePreviewIndex])}
              <Text style={styles.previewFileName} numberOfLines={1}>{files[activePreviewIndex]?.name}</Text>
            </View>
            <View style={styles.divider} />
            <FlatList
              data={files}
              keyExtractor={(_, i) => i.toString()}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.previewIcon}>📂</Text>
            <Text style={styles.emptyText}>No files selected</Text>
            <TouchableOpacity style={styles.emptyAddBtn} onPress={handleAddFile}>
              <Text style={styles.emptyAddText}>+ Select Files</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.footer}>
        {hasEncryptedFiles && (
          <TouchableOpacity style={styles.decryptBtn} onPress={onDecrypt}>
            <Text style={styles.actionText}>🔓 Decrypt Files</Text>
          </TouchableOpacity>
        )}
        {hasUnencryptedFiles && (
          <TouchableOpacity style={styles.encryptBtn} onPress={onEncrypt}>
            <Text style={styles.actionText}>🔐 Encrypt Files</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default FileListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020c1b' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  headerSide: { width: 60, justifyContent: 'center' },
  backBtn: { color: '#64ffda', fontSize: 16, fontWeight: '500' },
  title: { color: '#e6f1ff', fontSize: 20, fontWeight: '700', flex: 1, textAlign: 'center' },
  addBtn: { fontSize: 32, color: '#64ffda', fontWeight: '300', textAlign: 'right' },
  content: { flex: 1, paddingHorizontal: 20 },
  previewContainer: { alignItems: 'center', marginVertical: 10 },
  previewImage: { width: width - 40, height: width * 0.6, borderRadius: 16, backgroundColor: '#112240' },
  previewBox: { width: width - 40, height: width * 0.6, borderRadius: 16, backgroundColor: '#112240', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#233554' },
  previewIcon: { fontSize: 48, marginBottom: 10 },
  previewLabel: { color: '#8892b0', fontSize: 14 },
  previewFileName: { color: '#ccd6f6', marginTop: 12, fontSize: 14, textAlign: 'center' },
  divider: { height: 1, backgroundColor: '#233554', marginVertical: 15 },
  fileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#112240', padding: 15, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: 'transparent' },
  activeFileCard: { borderColor: '#64ffda', backgroundColor: '#1d2d50' },
  fileInfo: { flex: 1 },
  fileName: { color: '#e6f1ff', fontSize: 14, marginBottom: 4 },
  fileSize: { color: '#8892b0', fontSize: 12 },
  footer: { paddingBottom: 20, paddingTop: 10 },
  encryptBtn: { backgroundColor: '#1E7A85', padding: 16, marginHorizontal: 20, borderRadius: 12, alignItems: 'center' },
  decryptBtn: { backgroundColor: '#64ffda', padding: 16, marginHorizontal: 20, marginBottom: 10, borderRadius: 12, alignItems: 'center' },
  actionText: { color: '#0a192f', fontWeight: '700', fontSize: 16 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#8892b0', fontSize: 18, marginTop: 10 },
  emptyAddBtn: { marginTop: 20, paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25, borderWidth: 1, borderColor: '#64ffda' },
  emptyAddText: { color: '#64ffda', fontWeight: '600' },
});
