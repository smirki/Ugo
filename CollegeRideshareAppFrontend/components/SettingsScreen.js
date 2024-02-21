import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Linking } from 'react-native';

const SettingsScreen = () => {
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
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Push Notifications</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={notificationsEnabled ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={toggleNotifications}
          value={notificationsEnabled}
        />
      </View>
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Location Tracking</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={locationTrackingEnabled ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={toggleLocationTracking}
          value={locationTrackingEnabled}
        />
      </View>
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Dark Mode</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={darkModeEnabled ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={toggleDarkMode}
          value={darkModeEnabled}
        />
      </View>
      {/* Additional settings can be added here */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => openURL('https://yourwebsite.com/privacy-policy')}
      >
        <Text style={styles.buttonText}>Privacy Policy</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => openURL('https://yourwebsite.com/terms-of-service')}
      >
        <Text style={styles.buttonText}>Terms of Service</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Log Out</Text>
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
