import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import FlashMessage from 'react-native-flash-message';
import SplashScreenComponent from '../components/SplashScreen';  // Import the SplashScreen component

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // State to track whether the splash screen should be displayed
  const [isSplashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    if (fontsLoaded) {
      // Wait for fonts to load, then hide the splash screen after 3 seconds
      setTimeout(() => {
        setSplashVisible(false);
      }, 3000);  // Adjust according to your desired duration
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || isSplashVisible) {
    return <SplashScreenComponent />;  // Show the splash screen until fonts are loaded and animation finishes
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="AddSongScreen" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>

      {/* FlashMessage is shown at the bottom */}
      <FlashMessage position="bottom" style={{ marginBottom: 50 }} />
    </ThemeProvider>
  );
}
