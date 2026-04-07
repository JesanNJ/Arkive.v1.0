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
      console.log('STEP 1: start');

      await GoogleSignin.signOut();
      console.log('STEP 2: signed out');

      await GoogleSignin.hasPlayServices();
      console.log('STEP 3: play services ok');

      const userInfo: any = await GoogleSignin.signIn();
      console.log('STEP 4: signin success', userInfo);

      const tokens = await GoogleSignin.getTokens();
      console.log('STEP 5: tokens', tokens);

      if (!tokens?.accessToken) {
        throw new Error('No access token');
      }

      console.log('STEP 6: calling onLoginSuccess');

      onLoginSuccess({
        token: tokens.accessToken,
        name: userInfo?.data?.user?.name || 'User',
      });
    } catch (error: any) {
      console.log('LOGIN ERROR:', error);
      Alert.alert(
        'Sign In Error',
        `Error: ${error?.message || 'Unknown error occurred'}\n\nMake sure google-services.json is configured.`
      );
      setIsLoading(false);
    }
  };

  const handleTestLogin = () => {
    setIsLoading(true);
    console.log('🧪 Test login initiated');

    onLoginSuccess({
      token: 'test-token-' + Date.now(),
      name: 'Test User',
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <View style={styles.card}>
        <Text style={styles.title}>Arkive 🔒</Text>
        <Text style={styles.subtitle}>
          Security you can't see. Protection you can feel
        </Text>

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

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or</Text>
          <View style={styles.dividerLine} />
        </View>

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
  card: {
    width: width * 0.88,
    padding: 24,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(100,255,218,0.15)',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#e6f1ff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#8892b0',
    marginBottom: 30,
    textAlign: 'center',
  },
  googleBtn: {
    flexDirection: 'row',
    backgroundColor: '#112240',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  googleIconCircle: {
    backgroundColor: '#fff',
    width: 26,
    height: 26,
    borderRadius: 13,
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(100,255,218,0.2)',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#8892b0',
    fontSize: 12,
  },
  testBtn: {
    backgroundColor: '#0a4a2e',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#17A697',
  },
  testBtnText: {
    color: '#64ffda',
    fontWeight: '600',
    fontSize: 16,
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
