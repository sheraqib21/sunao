import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { View } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: '#FFFFFF', // White for active tab icons and labels
      tabBarInactiveTintColor: '#888888', // Grey for inactive tab icons and labels
      tabBarStyle: {
        backgroundColor: '#121212', // Matching dark background as in your screenshot
        borderTopWidth: 0,
        height: 60, // Standard height for better touch targets
        paddingBottom: 10, // Padding bottom for a better look
        shadowOpacity: 0, // No shadow for a flat design
      },
      tabBarLabelStyle: {
        fontSize: 12, // Smaller font size for labels
        fontWeight: 'bold', // Bold font weight for clarity
      },
      tabBarIconStyle: {
        marginBottom: -5, // Adjusting icon placement closer to the label
      },
      headerShown: false,
    }}> 
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
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
      
      {/* Additional screens can be added here */}
      
      {/* <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
          ),
        }}
      /> */}
    </Tabs>
  );
}
