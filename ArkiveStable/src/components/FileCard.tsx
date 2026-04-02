import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export type FileCardProps = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
};

const FileCard = ({title, subtitle, onPress}: FileCardProps) => {
  const content = (
    <View style={styles.card}>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      {content}
    </TouchableOpacity>
  );
};

export default FileCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f6f7fb',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e6e8ef',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#555',
  },
});
