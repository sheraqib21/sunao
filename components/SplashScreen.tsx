import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';  // Import Poppins font

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

SplashScreen.preventAutoHideAsync();

const SplashScreenComponent = () => {
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,  // Regular Poppins
    Poppins_700Bold,     // Bold Poppins
  });

  useEffect(() => {
    if (fontsLoaded) {
      const timeout = setTimeout(() => {
        SplashScreen.hideAsync();
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;  // Wait for fonts to load
  }

  return (
    <View style={styles.container}>
      {/* Play the first animation */}
      <LottieView
        source={require('../assets/animations/sunao-animation.json')}  // Your first animation
        autoPlay
        loop={false}
        style={styles.animation}
      />
      
      {/* Play the second animation in place of the text */}
      <LottieView
        source={require('../assets/animations/sunao.json')}  // Your second sunao.json animation
        autoPlay
        loop={false}  // If you want the animation to play only once
        style={styles.sunaoAnimation}  // Adjust size of the second animation here
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',  // Dark gray background
  },
  animation: {
    width: screenWidth * 0.8,  // First animation size remains the same
    height: screenHeight * 0.4,
  },
  sunaoAnimation: {
    width: screenWidth * 1.2,  // Moderate increase in size
    height: screenHeight * 0.5,  // Increased height proportionally
    marginTop: 20,  // Positive margin to ensure it stays below the first animation
  },
});

export default SplashScreenComponent;
