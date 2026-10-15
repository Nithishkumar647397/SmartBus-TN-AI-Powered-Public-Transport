import { Platform } from 'react-native';

const getBaseUrl = (): string => {
  // If explicitly configured via environment variable
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Web environment
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      return `http://${window.location.hostname}:8000`;
    }
    return 'http://127.0.0.1:8000';
  }

  // Android emulator reaches host machine at 10.0.2.2
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000';
  }

  // iOS simulator / default
  return 'http://127.0.0.1:8000';
};

export const API_BASE_URL = getBaseUrl();
