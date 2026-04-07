import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TestScreen = () => {
  console.log('✅ TestScreen rendered!');
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Arkive App is Loading!</Text>
      <Text style={styles.subtitle}>If you see this, the app is working!</Text>
      
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#17A697',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TestScreen;
