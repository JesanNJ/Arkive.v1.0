import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import FileListScreen from '../screens/FileListScreen';
import FileViewerScreen from '../screens/FileViewerScreen';
import EncryptionScreen from '../screens/EncryptionScreen';
import DecryptionScreen from '../screens/DecryptionScreen';

// 🔥 CONFIGURE GOOGLE SIGN-IN ONCE AT APP STARTUP
GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/drive'],
  webClientId: '208494516842-n7c44vo8rkqu03vfr1sfpepjtqrnb3u7.apps.googleusercontent.com',
});

const AppNavigator = () => {
  const [route, setRoute] = useState<string>('login');
  const [token, setToken] = useState<string | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [userName, setUserName] = useState("User");
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const user = {
    name: userName,
  };

  // 🔥 CHECK FOR SAVED SESSION ON APP START
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
        console.log('📝 Name:', savedName);
        
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

  // 🔥 SAVE SESSION ON LOGIN
  const handleLoginSuccess = async ({ token, name }: { token: string; name: string }) => {
    try {
      console.log("RECEIVED TOKEN:", token);
      console.log("RECEIVED NAME:", name);

      // Save to AsyncStorage
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userName', name);
      console.log('✅ Session saved to storage');

      setUserName(name);
      setToken(token);
      fetchDriveFiles(token);
      setRoute('home');
    } catch (error) {
      console.log('❌ Error saving session:', error);
    }
  };

  // 🔥 CLEAR SESSION ON LOGOUT
  const handleLogout = async () => {
    try {
      console.log('🚪 Logging out...');

      // Sign out from Google
      await GoogleSignin.signOut();
      console.log('✅ Signed out from Google');

      // Clear AsyncStorage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userName');
      console.log('✅ Session cleared from storage');

      // Reset state
      setToken(null);
      setUserName('User');
      setRoute('login');
      
      console.log('✅ Logout complete');
    } catch (error) {
      console.log('❌ Error during logout:', error);
    }
  };

  // Show nothing while checking for saved session
  if (isCheckingSession) {
    return null;
  }

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
      onDecrypt={() => setRoute('decrypt')}  // 🔥 NEW
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

  if (route === 'decrypt') {
  return (
    <DecryptionScreen
      files={files}
      onComplete={(decryptedFiles) => {
        setFiles(decryptedFiles);
        setRoute('viewer');
      }}
    />
  );
}

return null;
};

export default AppNavigator;