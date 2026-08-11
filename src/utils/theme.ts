import { MD3LightTheme, MD3DarkTheme, useTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0D1B3E',
    background: '#F5F7FA',
    surface: '#FFFFFF',
    text: '#0F172A',
    secondaryText: '#64748B',
    success: '#4CAF50',
    error: '#E53935',
    outline: '#E2E8F0',
    surfaceVariant: '#F8FAFC',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#0D1B3E',
    background: '#121826',
    surface: '#1E2433',
    text: '#F8FAFC',
    secondaryText: '#94A3B8',
    success: '#4CAF50',
    error: '#EF4444',
    outline: '#334155',
    surfaceVariant: '#2A3441',
  },
};

export type AppTheme = typeof lightTheme;

export const useAppTheme = () => useTheme<AppTheme>();
