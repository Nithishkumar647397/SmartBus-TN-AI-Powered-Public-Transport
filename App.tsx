import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useColorScheme } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { lightTheme, darkTheme } from './src/utils/theme';
import { PreferencesProvider, usePreferences } from './src/context/PreferencesContext';
import './src/i18n'; // Initialize i18n

const queryClient = new QueryClient();

const AppContent = () => {
  const { themeMode, isLoaded } = usePreferences();
  const systemColorScheme = useColorScheme();

  if (!isLoaded) return null; // Or a splash screen

  let currentTheme = lightTheme;
  if (themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark')) {
    currentTheme = darkTheme;
  }

  return (
    <PaperProvider 
      theme={currentTheme}
      settings={{
        icon: props => <MaterialCommunityIcons {...props} />,
      }}
    >
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PreferencesProvider>
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      </PreferencesProvider>
    </QueryClientProvider>
  );
}
