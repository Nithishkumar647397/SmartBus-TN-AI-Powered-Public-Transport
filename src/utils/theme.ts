import { MD3LightTheme as DefaultTheme, useTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0D1B3E',
    background: '#F5F7FA',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    secondaryText: '#757575',
    success: '#4CAF50',
    error: '#E53935',
  },
};

export type AppTheme = typeof theme;

export const useAppTheme = () => useTheme<AppTheme>();
