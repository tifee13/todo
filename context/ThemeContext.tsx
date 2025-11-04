import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

export const lightTheme = {
  bg: '#FAFAFA',
  card: '#FFFFFF',
  text: '#25273c',
  textCompleted: '#D1D2DA',
  textPlaceholder: '#9495A5',
  brightBlue: '#3A7CFD',
  checkGradientFrom: '#55DDFF',
  checkGradientTo: '#C058F3',
};

export const darkTheme = {
  bg: '#171823',
  card: '#25273D',
  text: '#C8CBE7',
  textCompleted: '#4D5067',
  textPlaceholder: '#767992',
  brightBlue: '#3A7CFD',
  checkGradientFrom: '#55DDFF',
  checkGradientTo: '#C058F3',
};

export type Theme = typeof lightTheme;

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const THEME_STORAGE_KEY = '@theme_mode';

interface ThemeProviderProps {
  children: ReactNode;
}

export function CustomThemeProvider({ children }: ThemeProviderProps) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeModeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.log('Error loading theme preference:', error);
      }
    };
    loadThemePreference();
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const systemColorScheme = useRNColorScheme();
  
  const isDark =
    themeMode === 'system'
      ? systemColorScheme === 'dark'
      : themeMode === 'dark';

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, isDark, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a CustomThemeProvider');
  }
  return context;
}