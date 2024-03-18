import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RideConfirmationScreen = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await fetch('https://test.saipriya.org/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          console.log('Failed to retrieve user information');
        }
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Finding a driver...</Text>
      {user && (
        <Text style={styles.userInfo}>Ride requested by {user.name}</Text>
      )}
      <ActivityIndicator size="large" color="#007bff" />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default RideConfirmationScreen;