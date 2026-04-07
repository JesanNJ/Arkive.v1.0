import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import FileListScreen from '../screens/FileListScreen';
import FileViewerScreen from '../screens/FileViewerScreen';
import EncryptionScreen from '../screens/EncryptionScreen';
import DecryptionScreen from '../screens/DecryptionScreen';

GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/drive'],
  webClientId: '208494516842-n7c44vo8rkqu03vfr1sfpepjtqrnb3u7.apps.googleusercontent.com',
});

const AppNavigator = () => {
  const [route, setRoute] = useState<string>('login');
  const [previousRoute, setPreviousRoute] = useState<string>('home');
  const [token, setToken] = useState<string | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [userName, setUserName] = useState("User");
  const [userPhoto, setUserPhoto] = useState<string | undefined>(undefined);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const user = {
    name: userName,
    photo: userPhoto,
  };

  // Navigate with back tracking
  const navigateTo = (newRoute: string) => {
    setPreviousRoute(route);
    setRoute(newRoute);
  };

  const goBack = () => {
    setRoute(previousRoute);
  };

  useEffect(() => {
    checkForSavedSession();
  }, []);

  const checkForSavedSession = async () => {
    try {
      console.log('🔍 Checking for saved session...');
      const savedToken = await AsyncStorage.getItem('userToken');
      const savedName = await AsyncStorage.getItem('userName');

      if (savedToken && savedName) {
        console.log('✅ Found saved session!');
        setToken(savedToken);
        setUserName(savedName);
        setRoute('home');
      } else {
        console.log('❌ No saved session found');
      }
    } catch (error) {
      console.log('❌ Error checking session:', error);
    } finally {
      setIsCheckingSession(false);
    }
  };

  const fetchDriveFiles = async (accessToken: string) => {
    try {
      const res = await fetch(
        "https://www.googleapis.com/drive/v3/files",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const data = await res.json();
      console.log("DRIVE FILES:", data);
    } catch (err) {
      console.log("DRIVE ERROR:", err);
    }
  };

  const handleLoginSuccess = async ({ token, name }: { token: string; name: string }) => {
    try {
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userName', name);
      setUserName(name);
      setToken(token);
      fetchDriveFiles(token);
      setRoute('home');
    } catch (error) {
      console.log('❌ Error saving session:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await GoogleSignin.signOut();
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userName');
      setToken(null);
      setUserName('User');
      setRoute('login');
    } catch (error) {
      console.log('❌ Error during logout:', error);
    }
  };

  if (isCheckingSession) return null;

  if (route === 'login') {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  if (route === 'home') {
    return (
     <HomeScreen
  user={user}
  token={token}
  onLogout={handleLogout}

  onGoToEncryption={(files) => {
    setFiles(files);
    navigateTo('preview');
  }}

  onGoToDecryption={(files) => {
    setFiles(files);
    navigateTo('decrypt');
  }}

  onGoToViewer={(files) => {
    setFiles(files);
    navigateTo('viewer');
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
          navigateTo('viewer');
        }}
        onEncrypt={() => navigateTo('encrypt')}
        onDecrypt={() => navigateTo('decrypt')}
        onBack={() => setRoute('home')}  // ← back to home
      />
    );
  }

  if (route === 'viewer') {
    return (
      <FileViewerScreen
        files={files}
        initialIndex={activeFileIndex}
        onBack={() => setRoute('preview')}
        onBackToHome={() => setRoute('home')}
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

  if (route === 'decrypt') {
    return (
      <DecryptionScreen
        files={files}
        onComplete={(decryptedFiles) => {
          setFiles(decryptedFiles);
          setRoute('viewer');
        }}
        onBackToHome={() => setRoute('home')}
      />
    );
  }

  return null;
};

export default AppNavigator;