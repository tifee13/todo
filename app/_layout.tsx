import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';

import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import { CustomThemeProvider, useTheme, lightTheme } from '../context/ThemeContext';

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  console.warn('EXPO_PUBLIC_CONVEX_URL is not set. Convex features will not work.');
}
const convex = convexUrl 
  ? new ConvexReactClient(convexUrl, { unsavedChangesWarning: false })
  : null;

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <CustomThemeProvider>
        <AppContent />
      </CustomThemeProvider>
    </SafeAreaProvider>
  );
}

const StyledAppView = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.bg};
`;

function AppContent() {
  const [fontsLoaded, fontError] = useFonts({
    'Josefin Sans': require('../assets/fonts/josefin_sans.ttf'),
  });

  const { isDark, theme } = useTheme();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const AppNavigation = (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        {/* ❌ REMOVED <Stack.Screen name="modal" ... /> */}
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );

  return (
    <StyledThemeProvider theme={theme || lightTheme}>
      <StyledAppView>
        <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
          {convex ? (
            <ConvexProvider client={convex}>
              {AppNavigation}
            </ConvexProvider>
          ) : (
            AppNavigation
          )}
        </NavigationThemeProvider>
      </StyledAppView>
    </StyledThemeProvider>
  );
}