import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DriverScreen from '../Driver/DriverScreen.js';

const DriverTab = createBottomTabNavigator();

function DriverTabs() {
  return (
    <DriverTab.Navigator>
      <DriverTab.Screen name="DriverHome" component={DriverScreen} options={{ headerShown: false }} />
      {/* Add more tabs if needed */}
    </DriverTab.Navigator>
  );
}

export default DriverTabs;
