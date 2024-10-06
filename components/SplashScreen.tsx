import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

SplashScreen.preventAutoHideAsync();

const SplashScreenComponent = () => {
  const [fontsLoaded] = useFonts({
    'Lobster': require('../assets/fonts/Lobster-Regular.ttf'),  // Correct path to Lobster font
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
      <LottieView
        source={require('../assets/animations/sunao-animation.json')}
        autoPlay
        loop={false}
        style={styles.animation}
      />
      <Text style={styles.text}>SUNAO</Text>
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
    width: screenWidth * 0.8,
    height: screenHeight * 0.4,
  },
  text: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF6F61',  // Vibrant coral text color for contrast
    marginTop: 20,
    fontFamily: 'Lobster',  // Correct font reference
  },
});

export default SplashScreenComponent;
