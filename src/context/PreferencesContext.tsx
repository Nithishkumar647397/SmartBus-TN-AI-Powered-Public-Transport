import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';

export type ThemeMode = 'light' | 'dark' | 'system';
export type Language = 'en' | 'ta';

interface PreferencesContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isLoaded: boolean;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('themeMode') as ThemeMode;
        if (storedTheme) setThemeModeState(storedTheme);

        const storedLang = await AsyncStorage.getItem('language') as Language;
        if (storedLang) {
          setLanguageState(storedLang);
          i18n.changeLanguage(storedLang);
        }
      } catch (e) {
        console.error('Failed to load preferences', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadPreferences();
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem('themeMode', mode);
    } catch (e) {
      console.error('Failed to save themeMode', e);
    }
  };

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    try {
      await AsyncStorage.setItem('language', lang);
    } catch (e) {
      console.error('Failed to save language', e);
    }
  };

  return (
    <PreferencesContext.Provider value={{ themeMode, setThemeMode, language, setLanguage, isLoaded }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};
