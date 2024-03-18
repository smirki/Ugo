import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  Alert,
  Dimensions,
  Keyboard,
  Image,
} from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import BottomSheet from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MapScreen = ({ navigation, route }) => {
  const [pickupQuery, setPickupQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [pickupLocation, setPickupLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const mapRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const [tripDuration, setTripDuration] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [activeInput, setActiveInput] = useState(null);
  const { initialDestination } = route.params || {};

  const { initialPickupLocation, initialDestinationLocation } = route.params || {};
  const [user, setUser] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (initialPickupLocation) {
        setPickupLocation(initialPickupLocation);
        setPickupQuery(initialPickupLocation.label || '');
      } else {
        setPickupLocation(userLocation);
        setPickupQuery('Current Location');
      }

      if (initialDestinationLocation) {
        setDestinationLocation(initialDestinationLocation);
        setDestinationQuery(initialDestinationLocation.label || '');
        fetchRoute(initialDestinationLocation);
      }

      if (initialDestination) {
        setDestinationLocation(initialDestination);
        setDestinationQuery(initialDestination.label || '');
        fetchRoute(initialDestination);
      }
    })();
    fetchUserInfo();
    connectWebSocket();

    return () => {
      disconnectWebSocket();
    };
  }, [initialDestination]);

  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://pelias.saipriya.org/v1/autocomplete?text=${encodeURIComponent(
          query
        )}&focus.point.lat=35.25&focus.point.lon=-80.85`
      );
      const data = await response.json();
      setSuggestions(data.features);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestions([]);
    }
  };

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

  const connectWebSocket = () => {
    ws.current = new WebSocket('wss://matching.saipriya.org');

    ws.current.onopen = () => {
      console.log('Connected to server');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'rideAccepted') {
        navigation.navigate('Riding', {
          pickupLocation,
          destinationLocation,
          driverLocation: data.driverLocation,
        });
      }
    };

    ws.current.onclose = () => {
      console.log('Disconnected from server');
    };
  };

  const disconnectWebSocket = () => {
    if (ws.current) {
      ws.current.close();
    }
  };

  const handleSuggestionSelect = async (suggestion, field) => {
    const { coordinates, label } = suggestion.geometry;
    const selectedLocation = { latitude: coordinates[1], longitude: coordinates[0], label };

    if (field === 'pickup') {
      setPickupLocation(selectedLocation);
      setPickupQuery(label);
    } else if (field === 'destination') {
      setDestinationLocation(selectedLocation);
      setDestinationQuery(label);
      fetchRoute(selectedLocation);
    }
    setSuggestions([]);
    setActiveInput(null);
    bottomSheetRef.current.snapToIndex(0);
    Keyboard.dismiss();
  };

  const fetchRoute = async (destinationLocation) => {
    if (!pickupLocation || !destinationLocation) {
      Alert.alert('Please select both a pickup and destination location.');
      return;
    }

    const url = `https://routing.saipriya.org/ors/v2/directions/driving-car?start=${pickupLocation.longitude},${pickupLocation.latitude}&end=${destinationLocation.longitude},${destinationLocation.latitude}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.features && data.features[0].geometry.coordinates) {
        const coords = data.features[0].geometry.coordinates.map((coord) => ({
          latitude: coord[1],
          longitude: coord[0],
        }));
        const durationInSeconds = data.features[0].properties.summary.duration;
        const durationInMinutes = Math.round(durationInSeconds / 60);
        setTripDuration(`${durationInMinutes} mins`);

        setRouteCoordinates(coords);
        if (mapRef.current) {
          mapRef.current.fitToCoordinates(coords, {
            edgePadding: { top: 100, right: 50, bottom: 50, left: 50 },
            animated: true,
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch route:', error);
      Alert.alert('Failed to fetch route. Please try again.');
    }
  };

  const handleUserLocationPress = () => {
    if (userLocation) {
      setPickupLocation(userLocation);
      setPickupQuery('Current Location');
    }
  };

  const handleFindRide = () => {
    if (pickupLocation && destinationLocation) {
      if (user && user.id) {
        // Send ride request to the server
        const rideRequest = {
          type: 'requestRide',
          id: user.id, // Use the user's ID from the fetched user data
          pickupLocation,
          destinationLocation,
        };
        ws.current.send(JSON.stringify(rideRequest));
  
        // Navigate to the RideConfirmationScreen
        navigation.navigate('RideConfirmation');
      } else {
        Alert.alert('User information not available. Please try again later.');
      }
    } else {
      Alert.alert('Please select both a pickup and destination location.');
    }
  };

  const handleClearInput = (field) => {
    if (field === 'pickup') {
      setPickupLocation(null);
      setPickupQuery('');
    } else if (field === 'destination') {
      setDestinationLocation(null);
      setDestinationQuery('');
      setRouteCoordinates([]);
    }
  };

  const renderSuggestions = () => {
    return (
      <FlatList
        data={suggestions}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.suggestionItem}
            onPress={() => handleSuggestionSelect(item, activeInput)}
          >
            <Text style={styles.suggestionText}>{item.properties.label}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.properties.label}
        contentContainerStyle={styles.suggestionsContainer}
      />
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: 35.3088,
            longitude: -80.7444,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {routeCoordinates.length > 0 && (
            <>
              <Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor="#007bff" />
              {pickupLocation && (
                <Marker coordinate={pickupLocation}>
                  <Image
                    source={require('../../assets/pickup-marker.png')}
                    style={styles.markerImage}
                  />
                </Marker>
              )}
              {destinationLocation && (
                <Marker coordinate={destinationLocation}>
                  <Image
                    source={require('../../assets/destination-marker.png')}
                    style={styles.markerImage}
                  />
                </Marker>
              )}
              {routeCoordinates.length > 0 && (
                <Marker coordinate={routeCoordinates[Math.floor(routeCoordinates.length / 2)]}>
                  <View style={styles.durationMarker}>
                    <Text style={styles.durationText}>{tripDuration}</Text>
                  </View>
                </Marker>
              )}
            </>
          )}
          {userLocation && (
            <Marker coordinate={userLocation}>
              <TouchableOpacity style={styles.userLocationButton} onPress={handleUserLocationPress}>
                <Ionicons name="location" size={24} color="#007bff" />
              </TouchableOpacity>
            </Marker>
          )}
        </MapView>

        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={['25%', '75%']}
          style={styles.bottomSheet}
          handleComponent={null}
          onChange={(index) => {
            if (index === 0) {
              setActiveInput(null);
            }
          }}
        >
          <View style={styles.bottomSheetContent}>
          {user && (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            {/* Display other user information */}
          </View>
        )}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, activeInput === 'pickup' && styles.inputFocused]}
                placeholder="Pickup Location"
                value={pickupLocation ? pickupLocation.label : pickupQuery}
                onChangeText={(text) => {
                  setPickupQuery(text);
                  fetchSuggestions(text);
                }}
                onFocus={() => {
                  setActiveInput('pickup');
                  bottomSheetRef.current.snapToIndex(1);
                }}
              />
              {pickupLocation && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => handleClearInput('pickup')}
                >
                  <Ionicons name="close" size={20} color="gray" />
                </TouchableOpacity>
              )}
              {pickupLocation && pickupLocation.label === 'Current Location' && (
                <TouchableOpacity style={styles.currentLocationButton}>
                  <Ionicons name="location" size={20} color="#007bff" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, activeInput === 'destination' && styles.inputFocused]}
                placeholder="Destination Location"
                value={destinationLocation ? destinationLocation.label : destinationQuery}
                onChangeText={(text) => {
                  setDestinationQuery(text);
                  fetchSuggestions(text);
                }}
                onFocus={() => {
                  setActiveInput('destination');
                  bottomSheetRef.current.snapToIndex(1);
                }}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
              />
              {destinationLocation && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => handleClearInput('destination')}
                >
                  <Ionicons name="close" size={20} color="gray" />
                </TouchableOpacity>
              )}
            </View>

            {activeInput && renderSuggestions()}

            <TouchableOpacity style={styles.findRideButton} onPress={handleFindRide}>
              <Text style={styles.findRideButtonText}>Find Ride</Text>
            </TouchableOpacity>
          </View>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  inputFocused: {
    borderColor: '#007bff',
  },
  suggestionItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
  suggestionText: {
    fontSize: 16,
    color: '#343A40',
  },
  suggestionsContainer: {
    maxHeight: 200,
  },
  durationMarker: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007bff',
  },
  durationText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007bff',
  },
  userLocationButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: '#007bff',
  },
  bottomSheet: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#F8F9FA',
  },
  bottomSheetContent: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -10 }],
    padding: 5,
  },
  currentLocationButton: {
    marginLeft: 8,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#007bff',
  },
  findRideButton: {
    backgroundColor: '#007bff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  findRideButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  markerImage: {
    width: 30,
    height: 30,
  },
});

export default MapScreen;