import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppTheme } from '../utils/theme';

interface Props {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = 'Failed to load data. Please check your connection.',
  onRetry,
}: Props) {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.error + '15' }]}>
        <MaterialIcons name="error-outline" size={36} color={theme.colors.error} />
      </View>
      <Text style={[styles.title, { color: theme.colors.text }]}>Unable to Connect</Text>
      <Text style={[styles.message, { color: theme.colors.secondaryText }]}>{message}</Text>
      {onRetry ? (
        <Button
          mode="contained"
          onPress={onRetry}
          style={[styles.retryBtn, { backgroundColor: theme.colors.primary }]}
          icon="refresh"
        >
          Try Again
        </Button>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
    maxWidth: 280,
  },
  retryBtn: {
    borderRadius: 12,
    paddingHorizontal: 12,
  },
});
