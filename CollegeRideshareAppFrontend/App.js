import * as React from 'react';
import { StyleSheet, Text, View, Image, Button} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
//components
import HomeScreen from './components/HomeScreen.js';
import Onboarding from './components/OnboardingScreen.js';
import ProfileScreen from './components/ProfileScreen.js';
import SettingsScreen from './components/SettingsScreen';
import RideConfirmation  from './components/RideConfirmation.js';
import MapScreen from './components/MapScreen.js'
import NotificationsScreen from './components/NotificationScreen.js'
import DriverScreen from './components/DriverScreen.js';

//navigation componenents
import DriverTabs from './components/Navigation/DriverTabs.js'

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },"tabBarActiveTintColor": "#FECC4C",
        "tabBarInactiveTintColor": "#676767",
        "tabBarStyle": [
          {
            "display": "flex"
          },
          null
        ]
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Map" component={MapScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }}/>
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
        <Stack.Screen
          name="RideConfirmation"
          component={RideConfirmation}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DriverScreen"
          component={DriverScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen
          name = "DriverTabs"
          component = {DriverTabs}
          options = {{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}



export default App;