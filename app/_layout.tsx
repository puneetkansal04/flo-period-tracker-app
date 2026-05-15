import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import { RootState } from '@/store';
import { useEffect } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as SplashScreen from 'expo-splash-screen';
import { registerForPushNotificationsAsync } from '@/utils/notifications';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function NavigationGuard() {
  const segments = useSegments();
  const router = useRouter();
  const { onboardingComplete, isSecretModeEnabled, isSessionUnlocked } = useSelector((state: RootState) => state.period);

  useEffect(() => {
    const inTabsGroup = segments[0] === '(tabs)';
    const inOnboarding = segments[0] === 'onboarding';
    const inDisguise = segments[0] === 'disguise';

    if (!onboardingComplete) {
      if (!inOnboarding) router.replace('/onboarding');
    } else {
      // Onboarding complete
      if (isSecretModeEnabled && !isSessionUnlocked) {
        if (!inDisguise) router.replace('/disguise');
      } else if (inOnboarding || inDisguise) {
        router.replace('/(tabs)');
      }
    }
  }, [onboardingComplete, isSecretModeEnabled, isSessionUnlocked, segments]);

  return null;
}

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Hide the splash screen after the app is ready.
    SplashScreen.hideAsync();
  }, []);

  const customTheme = {
    ...(colorScheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(colorScheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      primary: '#FF5A76', // Opaque Flo pink
      background: '#FFFFFF', // Opaque white
    }
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider value={customTheme}>
          <NavigationGuard />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="log-day" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="symptoms" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="paywall" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="article" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="generic-setting" options={{ headerShown: false }} />
            <Stack.Screen name="reminders" options={{ headerShown: false }} />
            <Stack.Screen name="post-detail" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
            <Stack.Screen name="calendar-settings" options={{ headerShown: false }} />
            <Stack.Screen name="disguise" options={{ headerShown: false }} />
            <Stack.Screen name="cycle-syncing" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" backgroundColor="#FFFFFF" />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
