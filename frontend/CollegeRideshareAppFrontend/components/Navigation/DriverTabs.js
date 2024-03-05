import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import your screen components here
import DriverScreen from '../Driver/DriverScreen.js'; // Assuming this is your Dashboard/Home Screen
import RideRequestsScreen from '../Driver/RideRequestsScreen.js';
import EarningsScreen from '../Driver/EarningsScreen.js';
import RatingsScreen from '../Driver/RatingsScreen.js';
import ProfileScreen from '../Driver/ProfileScreen.js';
import SupportScreen from '../Driver/SupportScreen.js';

const DriverTab = createBottomTabNavigator();

function DriverTabs() {
  return (
    <DriverTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'DriverHome') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'RideRequests') {
            iconName = focused ? 'car-sport' : 'car-sport-outline';
          } else if (route.name === 'Earnings') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Ratings') {
            iconName = focused ? 'star' : 'star-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Support') {
            iconName = focused ? 'help-circle' : 'help-circle-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <DriverTab.Screen name="DriverHome" component={DriverScreen} options={{ headerShown: false, title: 'Home' }} />
      <DriverTab.Screen name="RideRequests" component={RideRequestsScreen} options={{ title: 'Rides' }} />
      <DriverTab.Screen name="Earnings" component={EarningsScreen} options={{ title: 'Earnings' }} />
      <DriverTab.Screen name="Ratings" component={RatingsScreen} options={{ title: 'Ratings' }} />
      <DriverTab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      <DriverTab.Screen name="Support" component={SupportScreen} options={{ title: 'Support' }} />
    </DriverTab.Navigator>
  );
}

export default DriverTabs;
