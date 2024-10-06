import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

SplashScreen.preventAutoHideAsync();

const SplashScreenComponent = () => {
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      const timeout = setTimeout(() => {
        SplashScreen.hideAsync();
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* First animation moved higher */}
      <LottieView
        source={require('../assets/animations/sunao-animation.json')}
        autoPlay
        loop={false}
        style={styles.animation}
      />
      
      {/* Larger second animation */}
      <LottieView
        source={require('../assets/animations/sunao.json')}
        autoPlay
        loop={false}
        style={styles.sunaoAnimation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  animation: {
    width: screenWidth * 1.3,
    height: screenHeight * 0.6, // Slightly reduced height
    position: 'absolute',
    top: '10%', // Moved higher up
  },
  sunaoAnimation: {
    width: screenWidth * 2, // Increased width
    height: screenHeight * 0.7, // Significantly increased height
    position: 'absolute',
    bottom: '-5%', // Positioned from bottom instead of top
  },
});

export default SplashScreenComponent;