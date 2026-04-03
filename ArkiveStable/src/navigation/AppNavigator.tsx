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
  const [userName, setUserName] = useState("User");

  const user = {
    name: userName,
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
      console.log("DRIVE FILES:", data);
    } catch (err) {
      console.log("DRIVE ERROR:", err);
    }
  };

  const handleLoginSuccess = ({ token, name }: { token: string; name: string }) => {
    console.log("RECEIVED TOKEN:", token);
    setUserName(name);
    setToken(token);
    fetchDriveFiles(token);
    setRoute('home');
  };

  // Simple logout - no persistence
  const handleLogout = () => {
    console.log("Logging out...");
    setToken(null);
    setUserName('User');
    setRoute('login');
  };

  if (route === 'login') {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  if (route === 'home') {
    return (
      <HomeScreen
        user={user}
        token={token}
        onLogout={handleLogout}
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