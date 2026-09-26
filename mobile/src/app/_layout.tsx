import { useCallback, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Fraunces_500Medium, Fraunces_600SemiBold, Fraunces_500Medium_Italic } from '@expo-google-fonts/fraunces';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import { JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { queryClient } from '@/services/queryClient';
import { useSessionInit } from '@/features/auth/useSessionInit';
import { useAuthStore } from '@/store/authStore';
import { Colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

function SessionGate({ children }: { children: React.ReactNode }) {
  // Kicks off the refresh-token bootstrap; consumers read isInitializing
  // from the store directly rather than needing a render-prop here.
  useSessionInit();
  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isInitializing = useAuthStore((s) => s.isInitializing);

  const [fontsLoaded, fontError] = useFonts({
    Fraunces_600SemiBold,
    Fraunces_500Medium,
    Fraunces_500Medium_Italic,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    JetBrainsMono_500Medium,
  });

  const appReady = (fontsLoaded || Boolean(fontError)) && !isInitializing;

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  useEffect(() => {
    onLayoutRootView();
  }, [onLayoutRootView]);

  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const navigationTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <SessionGate>
            <ThemeProvider
              value={{
                ...navigationTheme,
                colors: {
                  ...navigationTheme.colors,
                  primary: theme.ink,
                  background: theme.background,
                  card: theme.surface,
                  text: theme.text,
                  border: theme.border,
                },
              }}
            >
              {!appReady ? null : (
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="(app)" />
                </Stack>
              )}
              <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            </ThemeProvider>
          </SessionGate>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
