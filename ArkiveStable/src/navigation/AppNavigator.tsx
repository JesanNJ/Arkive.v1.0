import React, { useState } from 'react';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import FileListScreen from '../screens/FileListScreen';
import FileViewerScreen from '../screens/FileViewerScreen';
import EncryptionScreen from '../screens/EncryptionScreen';

const AppNavigator = () => {
  const [route, setRoute] = useState('login');

  const [files, setFiles] = useState<any[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);

  const user = {
    name: 'Jesan N J',
  };

  if (route === 'login') {
    return <LoginScreen onLoginSuccess={() => setRoute('home')} />;
  }

  if (route === 'home') {
    return (
      <HomeScreen
        user={user}
        onGoToEncryption={(selectedFiles) => {
          setFiles(selectedFiles);
          setRoute('preview');
        }}
      />
    );
  }

  if (route === 'preview') {
    return (
      <FileListScreen
        files={files}
        onOpenFile={(file, index) => {
          setActiveFileIndex(index);
          setRoute('viewer');
        }}
        onEncrypt={() => setRoute('encrypt')}
      />
    );
  }

  if (route === 'viewer') {
    return (
      <FileViewerScreen
        files={files}
        initialIndex={activeFileIndex}
        onBack={() => setRoute('preview')}
      />
    );
  }

  if (route === 'encrypt') {
    return (
      <EncryptionScreen
        files={files}
        onComplete={(encryptedFiles) => {
          setFiles(encryptedFiles);
          setRoute('viewer');
        }}
      />
    );
  }

  return null;
};

export default AppNavigator;