import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import CartProvider from '@/providers/CartProvider';
import AuthProvider from '@/providers/AuthProvider';
import QueryProvider from '@/providers/QueryProvider';
import PaystackProvider from '@/providers/PaystackProvider';


import { useColorScheme } from '@components/useColorScheme';
import AnimatedSplash from '@/components/AnimatedSplash';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const [ready, setReady] = useState(false);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);


  if (!loaded) {
    return null;
  };

    if (!ready) {
    return <AnimatedSplash onAnimationFinish={() => setReady(true)} />;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <QueryProvider>
          <PaystackProvider>
          <CartProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name='(admin)' options={{ headerShown: false }} />
              <Stack.Screen name='(user)' options={{ headerShown: false }} />
              <Stack.Screen name='(auth)' options={{ headerShown: false }} />
              <Stack.Screen name='(modals)' options={{ headerShown: false }} />
              <Stack.Screen name="cart" options={{ presentation: 'formSheet' }} />
            </Stack>
          </CartProvider>
          </PaystackProvider>
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
