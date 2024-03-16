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
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

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
      // Handle find ride logic here
      console.log('Find ride from:', pickupLocation, 'to:', destinationLocation);
    } else {
      Alert.alert('Please select both a pickup and destination location.');
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
              <Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor="blue" />
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
                <Ionicons name="location" size={24} color="blue" />
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
          <BottomSheetView style={styles.bottomSheetContent}>
            <BlurView intensity={100} style={styles.blurView}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, activeInput === 'pickup' && styles.inputFocused]}
                  placeholder="Pickup Location"
                  value={pickupQuery}
                  onChangeText={(text) => {
                    setPickupQuery(text);
                    fetchSuggestions(text);
                  }}
                  onFocus={() => {
                    setActiveInput('pickup');
                    bottomSheetRef.current.snapToIndex(1);
                  }}
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, activeInput === 'destination' && styles.inputFocused]}
                  placeholder="Destination Location"
                  value={destinationQuery}
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
              </View>

              {activeInput && renderSuggestions()}

              <TouchableOpacity style={styles.findRideButton} onPress={handleFindRide}>
                <Text style={styles.findRideButtonText}>Find Ride</Text>
              </TouchableOpacity>
            </BlurView>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 16,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 8,
  },
  inputFocused: {
    borderColor: 'blue',
  },
  suggestionItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  suggestionText: {
    fontSize: 18,
  },
  suggestionsContainer: {
    maxHeight: 200,
  },
  durationMarker: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'blue',
  },
  durationText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'blue',
  },
  userLocationButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: 'blue',
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
  },
  bottomSheetContent: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  blurView: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  findRideButton: {
    backgroundColor: 'blue',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  findRideButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  markerImage: {
    width: 30,
    height: 30,
  },
});

export default MapScreen;