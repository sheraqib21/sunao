import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { View, StyleSheet, Dimensions } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF', // White for active tab icons and labels
        tabBarInactiveTintColor: '#888888', // Grey for inactive tab icons and labels
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
      {/* Add additional screens here */}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute', // Ensure the tab bar is positioned at the bottom
    bottom: 20, // Move it slightly above the bottom of the screen
    left: 20,
    right: 20,
    backgroundColor: '#ff6f61', // Custom background color for the tab bar
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
});
