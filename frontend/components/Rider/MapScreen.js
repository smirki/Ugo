import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  Button,
  Alert,
  Dimensions,
} from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import BottomSheet from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const MapScreen = ({ navigation, route }) => {
  const [pickupQuery, setPickupQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [pickupLocation, setPickupLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const mapRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['50%', '90%'], []);
  const [tripDuration, setTripDuration] = useState('');

  const [suggestions, setSuggestions] = useState([]); // State for autocomplete suggestions

  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`http://136.57.138.240:4000/v1/autocomplete?text=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSuggestions(data.features);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({ // Assuming function to set user location
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const handleSuggestionSelect = async (suggestion, field) => {
    const { coordinates } = suggestion.geometry;
    const selectedLocation = { latitude: coordinates[1], longitude: coordinates[0] };

    if (field === 'pickup') {
      setPickupQuery(suggestion.properties.label);
      setPickupLocation(selectedLocation);
    } else if (field === 'destination') {
      setDestinationQuery(suggestion.properties.label);
      setDestinationLocation(selectedLocation);
    }
    setSuggestions([]); // Clear suggestions after selection
  };

  const fetchRoute = async () => {
    if (!pickupLocation || !destinationLocation) {
      Alert.alert('Please select both a pickup and destination location.');
      return;
    }

    // Construct the API URL for your routing API
    const url = `http://136.57.138.240:8080/ors/v2/directions/driving-car?start=${pickupLocation.longitude},${pickupLocation.latitude}&end=${destinationLocation.longitude},${destinationLocation.latitude}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.features && data.features[0].geometry.coordinates) {
        const coords = data.features[0].geometry.coordinates.map((coord) => ({
          latitude: coord[1],
          longitude: coord[0],
        }));
          // Assuming you already have the duration in seconds from the API response
          const durationInSeconds = data.features[0].properties.summary.duration;
          // Convert seconds to a readable format, e.g., "8 mins"
          const durationInMinutes = Math.round(durationInSeconds / 60);
          setTripDuration(`${durationInMinutes} mins`);

          // Example midpoint calculation (this is a simple linear interpolation, consider the actual path for accurate placement)
          const midpointIndex = Math.floor(coords.length / 2);
          const midpoint = coords[midpointIndex];
        setRouteCoordinates(coords);
        if (mapRef.current) {
          mapRef.current.fitToCoordinates(coords, {
            edgePadding: { top: 100, right: 50, bottom: 50, left: 50 },
            animated: true,
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch route:", error);
      Alert.alert('Failed to fetch route. Please try again.');
    }
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
    topImage: {
      width: '100%',
      height: 200,
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
    input: {
      backgroundColor: 'white',
      borderRadius: 5,
      padding: 10,
      fontSize: 16,
      borderWidth: 1,
      borderColor: '#ddd',
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} initialRegion={{
  latitude: 35.3088,
  longitude: -80.7444,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
}}>
  {routeCoordinates.length > 0 && (
    <Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor="blue" />
  )}
  {pickupLocation && <Marker coordinate={pickupLocation} title="Pickup" />}
  {destinationLocation && <Marker coordinate={destinationLocation} title="Destination" />}
  {tripDuration && (
    <Marker coordinate={midpoint} anchor={{x: 0.5, y: 0.5}}>
      <View style={styles.durationMarker}>
        <Text style={styles.durationText}>{tripDuration}</Text>
      </View>
    </Marker>
  )}
</MapView>
  
        <BottomSheet ref={bottomSheetRef} index={0} snapPoints={snapPoints}>
          <View style={styles.bottomSheetContent}>
            <TextInput
              style={styles.input}
              placeholder="Pickup Location"
              value={pickupQuery}
              onChangeText={(text) => {
                setPickupQuery(text);
                fetchSuggestions(text);
              }}
            />
            {suggestions.length > 0 && (
              <FlatList
                data={suggestions}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => handleSuggestionSelect(item, 'pickup')}
                  >
                    <Text>{item.properties.label}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.properties.label}
              />
            )}
  
            <TextInput
              style={styles.input}
              placeholder="Destination Location"
              value={destinationQuery}
              onChangeText={(text) => {
                setDestinationQuery(text);
                fetchSuggestions(text);
              }}
            />
            {suggestions.length > 0 && (
              <FlatList
                data={suggestions}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => handleSuggestionSelect(item, 'destination')}
                  >
                    <Text>{item.properties.label}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.properties.label}
              />
            )}
  
            <Button title="Go" onPress={fetchRoute} style={styles.goButton} />
          </View>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );

                };

export default MapScreen;
