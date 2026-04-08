import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const { width } = Dimensions.get('window');

type Props = {
  onLoginSuccess: (data: { token: string; name: string }) => void;
};

const LoginScreen = ({ onLoginSuccess }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();

      const userInfo: any = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();

      if (!tokens?.accessToken) {
        throw new Error('No access token');
      }

      onLoginSuccess({
        token: tokens.accessToken,
        name: userInfo?.data?.user?.name || 'User',
      });
    } catch (error: any) {
      Alert.alert(
        'Sign In Error',
        `Error: ${error?.message || 'Unknown error occurred'}`
      );
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* 🔥 BACKGROUND GLOW */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      {/* 🔥 CARD */}
      <View style={styles.card}>

        {/* TITLE */}
        <Text style={styles.title}>Arkive 🔒</Text>

        {/* SUBTITLE */}
        <Text style={styles.subtitle}>
          Security you can’t see. Protection you can feel
        </Text>

        {/* GOOGLE BUTTON */}
        <TouchableOpacity
          style={[styles.googleBtn, isLoading && styles.btnDisabled]}
          onPress={handleGoogleLogin}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          <View style={styles.googleIconCircle}>
            <Text style={styles.googleIconText}>G</Text>
          </View>

          <Text style={styles.googleText}>
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020c1b',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  /* 🔥 BACKGROUND GLOW */
  glowTop: {
    position: 'absolute',
    top: -120,
    width: 320,
    height: 320,
    backgroundColor: '#17A697',
    borderRadius: 200,
    opacity: 0.12,
  },

  glowBottom: {
    position: 'absolute',
    bottom: -120,
    width: 320,
    height: 320,
    backgroundColor: '#0ea5e9',
    borderRadius: 200,
    opacity: 0.12,
  },

  /* 🔥 CARD */
  card: {
    width: width * 0.88,
    padding: 24,
    borderRadius: 28,

    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  /* 🔥 TITLE */
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#e6f1ff',
    textAlign: 'center',
    marginBottom: 8,
  },

  /* 🔥 SUBTITLE */
  subtitle: {
    color: '#8892b0',
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 14,
  },

  /* 🔥 GOOGLE BUTTON */
  googleBtn: {
    flexDirection: 'row',
    backgroundColor: '#112240',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  googleIconCircle: {
    backgroundColor: '#fff',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  googleIconText: {
    fontWeight: 'bold',
    color: '#000',
  },

  googleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  /* 🔥 DISABLED STATE */
  btnDisabled: {
    opacity: 0.6,
  },
});