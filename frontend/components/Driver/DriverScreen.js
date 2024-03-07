import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, Animated, Vibration } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';

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
    setTimeout(() => setRideRequest({ ...rideRequest, visible: false }), 11000);
  }, []);

  const toggleOnlineStatus = () => {
    setIsOnline(current => !current);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleRideRequest = (action) => {
    Vibration.vibrate();
    if (action === 'accept') {
      // Logic to accept the ride
      setRideRequest({ ...rideRequest, visible: false });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      // Logic to reject the ride
      setRideRequest({ ...rideRequest, visible: false });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={currentLocation}
        accessibilityElementsHidden={isOnline} // Hide map elements when online
        importantForAccessibility={isOnline ? 'no-hide-descendants' : 'auto'}
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
        accessibilityElementsHidden={!isOnline} // Hide bottom sheet when offline
        importantForAccessibility={isOnline ? 'auto' : 'no-hide-descendants'}
      >
        {/* Bottom sheet content here */}
      </BottomSheet>
      {isOnline ? (
        <TouchableOpacity
          style={[styles.goButton, styles.goButtonActive]}
          onPress={toggleOnlineStatus}
          accessibilityRole="button"
          accessibilityLabel="You're Online. Tap to go offline."
        >
          <Text style={styles.goButtonText}>You're Online!</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.goButton}
          onPress={toggleOnlineStatus}
          accessibilityRole="button"
          accessibilityLabel="Tap to go online."
        >
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
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => handleRideRequest('accept')}
              accessibilityRole="button"
              accessibilityLabel="Accept ride request"
            >
              <MaterialIcons name="check" size={24} color="white" />
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dismissButton}
              onPress={() => handleRideRequest('reject')}
              accessibilityRole="button"
              accessibilityLabel="Reject ride request"
            >
              <MaterialIcons name="close" size={24} color="white" />
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <TouchableOpacity
        style={[styles.startRideButton, isOnline && styles.startRideButtonActive]}
        onPress={() => {}}
        disabled={!isOnline}
        accessibilityRole="button"
        accessibilityLabel={isOnline ? "Start a Ride" : "Go online to start a ride"}
      >
        <MaterialIcons name="drive-eta" size={24} color={isOnline ? 'white' : 'gray'} />
        <Text style={[styles.startRideButtonText, !isOnline && styles.startRideButtonTextInactive]}>
          Start a Ride
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  earningsContainer: {
    position: 'absolute',
    top: 48,
    left: 20,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 18,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  earningsText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  goButton: {
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  goButtonActive: {
    backgroundColor: '#4CAF50',
  },
  goButtonText: {
    fontSize: 18,
    marginLeft: 8,
    color: 'black',
  },
  rideRequestContainer: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
  startRideButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  startRideButtonActive: {
    backgroundColor: '#4CAF50',
  },
  startRideButtonText: {
    fontSize: 18,
    marginLeft: 8,
    color: 'black',
  },
  startRideButtonTextInactive: {
    color: 'gray',
  },
});

export default DriverScreen;