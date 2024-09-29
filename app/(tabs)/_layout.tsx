import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function TabLayout() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#FFFFFF', // White for active tab icons and labels
          tabBarInactiveTintColor: '#999999', // Grey for inactive tab icons and labels
          tabBarStyle: styles.tabBarStyle, // Custom tab bar styles
          tabBarLabelStyle: styles.tabBarLabelStyle,
          tabBarIconStyle: styles.tabBarIconStyle,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
            ),
          }}
        />
      </Tabs>

      {/* Floating Plus Button */}
      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => navigation.navigate('AddSongScreen')} // Navigate to AddSongScreen
      >
        <Ionicons name="add" size={40} color="#fff" /> 
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute', // Ensure the tab bar is positioned at the bottom
    bottom: 20, // Move it slightly above the bottom of the screen
    left: 20,
    right: 20,
    backgroundColor: '#333333', // Darker background for nav bar
    borderRadius: 30, // Rounded corners for the tab bar
    height: 70, // Adjust height for better visibility
    paddingBottom: 10,
    elevation: 5, // Add elevation for Android shadow
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  tabBarLabelStyle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabBarIconStyle: {
    marginBottom: -5,
  },
  plusButton: {
    position: 'absolute',
    bottom: 35, // Placed slightly above the tab bar
    left: Dimensions.get('window').width / 2 - 40, // Center the button horizontally
    backgroundColor: '#FF6F61', // Matching the color of the Plus button to complement nav bar
    width: 75, // Increase button width
    height: 75, // Increase button height
    borderRadius: 40, // Circular shape
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
});
