import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';

const {width} = Dimensions.get('window');

const LoginScreen = () => {
  const handleGoogleLogin = () => {
    console.log('Google Login Clicked');
    // call authService here
  };

  return (
    <LinearGradient
      colors={['#0f172a', '#1e293b', '#0ea5e9']}
      style={styles.container}>

      {/* Glow Effect */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      {/* Glass Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Arkive</Text>
        <Text style={styles.subtitle}>
          Secure your files with encryption + cloud
        </Text>

        {/* Google Button */}
        <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleLogin}>
          <Icon name="google" size={20} color="#fff" />
          <Text style={styles.googleText}>Continue with Google</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  glowTop: {
    position: 'absolute',
    top: -100,
    width: 300,
    height: 300,
    backgroundColor: '#0ea5e9',
    borderRadius: 200,
    opacity: 0.2,
  },

  glowBottom: {
    position: 'absolute',
    bottom: -100,
    width: 300,
    height: 300,
    backgroundColor: '#9333ea',
    borderRadius: 200,
    opacity: 0.2,
  },

  card: {
    width: width * 0.85,
    padding: 24,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
  },

  subtitle: {
    color: '#cbd5f5',
    marginBottom: 30,
  },

  googleBtn: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#1f2937',
  },

  googleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});