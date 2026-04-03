import React, { useState } from 'react';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import FileListScreen from '../screens/FileListScreen';
import FileViewerScreen from '../screens/FileViewerScreen';
import EncryptionScreen from '../screens/EncryptionScreen';

const AppNavigator = () => {
  const [route, setRoute] = useState('login');
  const [token, setToken] = useState<string | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);

  const user = {
    name: 'Jesan N J',
  };

  const fetchDriveFiles = async (accessToken: string) => {
    try {
      const res = await fetch(
        "https://www.googleapis.com/drive/v3/files",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await res.json();
      console.log("FILES:", data);

    } catch (err) {
      console.log(err);
    }
  };

  const handleLoginSuccess = (accessToken: string) => {
    setToken(accessToken);
    fetchDriveFiles(accessToken);
    setRoute('home');
  };

  if (route === 'login') {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  if (route === 'home') {
    return (
      <HomeScreen
        user={user}
        token={token}
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