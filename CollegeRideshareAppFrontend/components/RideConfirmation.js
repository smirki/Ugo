import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const RideConfirmation = ({ route }) => {
  const { pickupAddress, destinationAddress } = route.params || {};
  const [pickup, setPickup] = useState(pickupAddress || 'Default Pickup Address');
  const [destination, setDestination] = useState(destinationAddress || 'Default Destination Address');
  const [riders, setRiders] = useState('1');
  const [estimatedCost, setEstimatedCost] = useState('$10.00');

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/car.webp')} // Replace with your image path
        style={styles.topImage}
      />
      <Text style={styles.headerText}>Book Your Ride</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setPickup}
          value={pickup}
          placeholder="Pick Up"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setDestination}
          value={destination}
          placeholder="Destination"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setRiders}
          value={riders}
          placeholder="Number of Riders"
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.estimatedCostText}>Estimated Cost: {estimatedCost}</Text>

      <TouchableOpacity style={styles.findDriverButton} onPress={() => {}}>
        <Text style={styles.findDriverButtonText}>Confirm Ride</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  topImage: {
    width: '100%',
    height: 200, // Set this to the aspect ratio of your image
    resizeMode: 'cover',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 10,
  },
  estimatedCostText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    alignSelf: 'center',
    marginVertical: 20,
  },
  findDriverButton: {
    backgroundColor: '#FFCC00',
    paddingVertical: 15,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  findDriverButtonText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
});

export default RideConfirmation;
