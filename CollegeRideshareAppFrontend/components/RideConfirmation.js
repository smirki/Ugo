import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const RideConfirmation = () => {
  const [pickup, setPickup] = useState('1001 Graduate Ln.');
  const [destination, setDestination] = useState('1001 Graduate Ln.');
  const [riders, setRiders] = useState('1');
  const [estimatedCost, setEstimatedCost] = useState('$10.00');

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Book Your Ride</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Pick Up</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPickup}
          value={pickup}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Destination</Text>
        <TextInput
          style={styles.input}
          onChangeText={setDestination}
          value={destination}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Number of Riders</Text>
        <TextInput
          style={styles.input}
          onChangeText={setRiders}
          value={riders}
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.estimatedCostText}>Estimated Cost: {estimatedCost}</Text>

      <TouchableOpacity style={styles.findDriverButton}>
        <Text style={styles.findDriverButtonText}>Find a Driver</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFCC00',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: 'black',
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 15,
    fontSize: 16,
  },
  estimatedCostText: {
    fontSize: 16,
    color: 'black',
    marginVertical: 20,
  },
  findDriverButton: {
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  findDriverButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RideConfirmation;
