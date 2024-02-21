import * as React from 'react';
import { StyleSheet, Text, View, Image, Button} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


//components
import HomeScreen from './components/HomeScreen.js';
import Onboarding from './components/OnboardingScreen.js';
import ProfileScreen from './components/ProfileScreen';
import SettingsScreen from './components/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Profile" component={HomeScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Settings" component={Onboarding} options={{ headerShown: false }}/>
      <Tab.Screen name="Setstings" component={Onboarding} options={{ headerShown: false }}/>
      {/* Add more tabs as needed */}
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* The initial route will be the OnboardingScreen */}
        <Stack.Screen
          name="Onboarding"
          component={Onboarding}
          options={{ headerShown: false }}
        />
        {/* Once the onboarding is completed, the HomeTabs will be shown */}
        <Stack.Screen
          name="HomeTabs"
          component={HomeTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}



export default App;
