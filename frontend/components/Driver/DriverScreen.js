import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, Animated } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';

const DriverScreen = ({ navigation }) => {
  const [isOnline, setIsOnline] = useState(false);
  const [rideRequest, setRideRequest] = useState({
    visible: false,
    from: 'Farshid Darvishi',
    to: 'GeorgeTown',
    earnings: 43.02,
    duration: '15m, 30min'
  });
  const bottomSheetRef = React.useRef(null);
  const snapPoints = React.useMemo(() => ['25%', '50%'], []);

  // Dummy current location
  const currentLocation = {
    latitude: 35.3088,
    longitude: -80.7444,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    // Show the ride request after 1 second and hide it after 10 seconds
    setTimeout(() => setRideRequest({ ...rideRequest, visible: true }), 1000);
    //setTimeout(() => setRideRequest({ ...rideRequest, visible: false }), 11000);
  }, []);

  const toggleOnlineStatus = () => {
    setTimeout(() => setRideRequest({ ...rideRequest, visible: true }), 1000);
    //setTimeout(() => setRideRequest({ ...rideRequest, visible: false }), 11000);
    setIsOnline(current => !current);
  };

  const acceptRide = () => {
    // Logic to accept the ride
    setRideRequest({ ...rideRequest, visible: false });
  };

  const dismissRide = () => {
    // Logic to dismiss the ride
    setRideRequest({ ...rideRequest, visible: false });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={currentLocation}
      >
        <Marker coordinate={currentLocation} />
      </MapView>
      <View style={styles.earningsContainer}>
        <Text style={styles.earningsText}>$208.56</Text>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
      >
        {/* Bottom sheet content here */}
      </BottomSheet>
      {isOnline ? (
        <TouchableOpacity style={styles.goButton} onPress={toggleOnlineStatus}>
          <Text style={styles.goButtonText}>You're Online!</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.goButton} onPress={toggleOnlineStatus}>
          <Ionicons name="home" size={24} color="black" />
          <Text style={styles.goButtonText}>Go</Text>
        </TouchableOpacity>
      )}
      {rideRequest.visible && (
        <View style={styles.rideRequestContainer}>
          <View style={styles.rideRequestDetails}>
            <Text style={styles.rideRequestText}>{rideRequest.from} → {rideRequest.to}</Text>
            <Text style={styles.rideRequestText}>${rideRequest.earnings}</Text>
            <Text style={styles.rideRequestText}>{rideRequest.duration}</Text>
          </View>
          <View style={styles.rideRequestActions}>
            <TouchableOpacity style={styles.acceptButton} onPress={acceptRide}>
              <MaterialIcons name="check" size={24} color="white" />
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dismissButton} onPress={dismissRide}>
              <MaterialIcons name="close" size={24} color="white" />
              <Text style={styles.buttonText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // ... other styles here ...

  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#0008',
    padding: 10,
    borderRadius: 50,
  },
  earningsSummary: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#0008',
    padding: 10,
    borderRadius: 20,
  },
  statusToggle: {
    position: 'absolute',
    bottom: 100, // Adjust based on bottom sheet size
    right: 20,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 20,
  },
  rideRequestCard: {
    position: 'absolute',
    bottom: 150, // Adjust accordingly
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rideRequestActions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: 'green',
    marginRight: 10,
    padding: 10,
    borderRadius: 5,
  },
  denyButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },

  earningsContainer: {
    position: 'absolute',
    top: 48, // Adjust to match your status bar height
    left: 20,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 18,
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  earningsText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  goButton: {
    // Styles for the 'Go' button or 'You're Online!' indicator
    position: 'absolute',
    bottom: 25,
    left: 20,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 30,
    elevation: 5,
    // Add shadow styles for iOS
  },
  goButtonText: {
    fontSize: 18,
    marginLeft: 8,
  },
  rideRequestContainer: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    elevation: 5,
    // Add shadow styles for iOS
  },
  rideRequestDetails: {
    marginBottom: 12,
  },
  rideRequestText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rideRequestActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acceptButton: {
    backgroundColor: 'green',
    borderRadius: 20,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  dismissButton: {
    backgroundColor: 'red',
    borderRadius: 20,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  // ... other styles you may need ...
});

export default DriverScreen;
