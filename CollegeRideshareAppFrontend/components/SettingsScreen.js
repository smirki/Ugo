import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Linking } from 'react-native';

const SettingsScreen = ({navigation}) => {
  // Example of individual state for different settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [locationTrackingEnabled, setLocationTrackingEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  // Toggle functions for each setting
  const toggleNotifications = () => setNotificationsEnabled(!notificationsEnabled);
  const toggleLocationTracking = () => setLocationTrackingEnabled(!locationTrackingEnabled);
  const toggleDarkMode = () => setDarkModeEnabled(!darkModeEnabled);

  // Function to open URLs for privacy policy and terms of service
  const openURL = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      {/* Existing settings toggles... */}

      {/* Navigate to Profile Screen */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ProfileScreen')}
      >
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>

      {/* Navigate to Payments Screen (Assuming you have this screen, add it to your navigator if you haven't) */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PaymentsScreen')} // Add this screen to your navigator
      >
        <Text style={styles.buttonText}>Payments</Text>
      </TouchableOpacity>

      {/* Additional settings navigation */}

      {/* Swap to DriverTabsScreen */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('DriverTabs')}
      >
        <Text style={styles.buttonText}>Switch to Driver Mode</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingText: {
    fontSize: 18,
    color: 'black',
  },
  button: {
    backgroundColor: '#FFCC00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
