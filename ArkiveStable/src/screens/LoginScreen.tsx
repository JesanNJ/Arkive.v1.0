import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import LoginBackground from '../components/LoginBackground';

const { width } = Dimensions.get('window');

type Props = {
  onLoginSuccess: () => void;
};

const LoginScreen = ({ onLoginSuccess }: Props) => {
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Background */}
      <View style={StyleSheet.absoluteFillObject}>
        <LoginBackground />
      </View>

      {/* Overlay */}
      <View style={styles.overlay} />

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Arkive 🔒</Text>
        <Text style={styles.subtitle}>
          Security you can’t see. Protection you can feel
        </Text>

        <TouchableOpacity style={styles.googleBtn} onPress={onLoginSuccess}>
          <View style={styles.googleIconCircle}>
            <Text style={styles.googleIconText}>G</Text>
          </View>
          <Text style={styles.googleText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextBtn} onPress={onLoginSuccess}>
          <Text style={styles.nextText}>Go to Home →</Text>
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
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 25, 47, 0.2)',
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
  },
  subtitle: {
    color: '#8892b0',
    marginBottom: 30,
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
  },
  nextBtn: {
    backgroundColor: '#1E7A85',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextText: {
    color: '#fff',
    fontWeight: '700',
  },
});