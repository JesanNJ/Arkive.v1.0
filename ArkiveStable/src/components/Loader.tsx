import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

type Props = {
  visible: boolean;
  label?: string;
};

const Loader = ({visible, label}: Props) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#007bff" />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 12,
  },
});
