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

  const handleTestLogin = () => {
    setIsLoading(true);
    onLoginSuccess({
      token: 'test-token-' + Date.now(),
      name: 'Test User',
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* 🔥 BACKGROUND GLOW */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      {/* 🔥 CARD */}
      <View style={styles.card}>

        <Text style={styles.title}>Arkive 🔒</Text>

        <Text style={styles.subtitle}>
          Security you can’t see. Protection you can feel
        </Text>

        {/* 🔥 GOOGLE BUTTON */}
        <TouchableOpacity
          style={[styles.googleBtn, isLoading && styles.btnDisabled]}
          onPress={handleGoogleLogin}
          disabled={isLoading}
        >
          <View style={styles.googleIconCircle}>
            <Text style={styles.googleIconText}>G</Text>
          </View>

          <Text style={styles.googleText}>
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </Text>
        </TouchableOpacity>

        {/* 🔥 DIVIDER */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* 🔥 TEST LOGIN (SECONDARY) */}
        <TouchableOpacity
          style={[styles.testBtn, isLoading && styles.btnDisabled]}
          onPress={handleTestLogin}
          disabled={isLoading}
        >
          <Text style={styles.testBtnText}>
            {isLoading ? 'Signing in...' : '🧪 Test Login'}
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

  /* 🔥 GLOW BACKGROUND */
  glowTop: {
    position: 'absolute',
    top: -100,
    width: 300,
    height: 300,
    backgroundColor: '#17A697',
    borderRadius: 200,
    opacity: 0.15,
  },

  glowBottom: {
    position: 'absolute',
    bottom: -100,
    width: 300,
    height: 300,
    backgroundColor: '#0ea5e9',
    borderRadius: 200,
    opacity: 0.15,
  },

  /* 🔥 CARD */
  card: {
    width: width * 0.88,
    padding: 28,
    borderRadius: 28,

    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#e6f1ff',
    textAlign: 'center',
    marginBottom: 10,
  },

  subtitle: {
    color: '#8892b0',
    marginBottom: 30,
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
    marginBottom: 20,
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
  },

  googleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  /* 🔥 DIVIDER */
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  dividerText: {
    marginHorizontal: 10,
    color: '#8892b0',
    fontSize: 12,
  },

  /* 🔥 TEST BUTTON */
  testBtn: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#17A697',
  },

  testBtnText: {
    color: '#17A697',
    fontWeight: '600',
    fontSize: 15,
  },

  btnDisabled: {
    opacity: 0.6,
  },
});