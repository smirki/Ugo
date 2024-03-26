import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import io from 'socket.io-client';

const RideConfirmationScreen = () => {
  const [drivers, setDrivers] = useState([]);
  const [riders, setRiders] = useState([]);
  const socketRef = useRef(null);

  if (!socketRef.current) {
    socketRef.current = io('https://matching.saipriya.org');
  }

  useEffect(() => {
    const socket = socketRef.current;

    console.log('RideConfirmationScreen mounted.');

    socket.on('connect', () => {
      console.log(`Connected to server with socket ID: ${socket.id}`);
    });

    socket.on('update', (data) => {
      console.log('Update received:', data);
      setDrivers(data.drivers || []);
      setRiders(data.riders || []);
    });

    socket.on('disconnect', () => {
      console.log(`Disconnected from server with socket ID: ${socket.id}`);
    });

    socket.on('connect_error', (error) => {
      console.log(`Connection error: ${error}`);
    });

    return () => {
      console.log('RideConfirmationScreen will unmount, disconnecting socket.');
      socket.disconnect();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Drivers:</Text>
      <FlatList
        data={drivers}
        keyExtractor={(item) => item.driverId}
        renderItem={({ item }) => (
          <Text>{item.driverId} - {item.available ? 'Available' : 'Busy'}</Text>
        )}
      />
      <Text style={styles.heading}>Riders:</Text>
      <FlatList
        data={riders}
        keyExtractor={(item) => item.riderId}
        renderItem={({ item }) => (
          <Text>{item.riderId}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
});

export default RideConfirmationScreen;
