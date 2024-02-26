import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, FlatList, Text, Alert, Dimensions, Image } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import BottomSheet from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Import GestureHandlerRootView
const MapScreen = () => {
  // State to manage input fields and their values
  const [pickupQuery, setPickupQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [activeField, setActiveField] = useState(''); // 'pickup' or 'destination'
  const [suggestions, setSuggestions] = useState([]);

  // Other states and refs
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [riders, setRiders] = useState('1');
  const [estimatedCost, setEstimatedCost] = useState('$10.00');
  const mapRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['50%', '75%'], []);

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
    })();
  }, []);

  // Function to fetch autocomplete suggestions based on the active input field
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

  // Function to handle selection from autocomplete suggestions
  const onSuggestionSelect = async (suggestion) => {
    const { coordinates } = suggestion.geometry;
    const selectedLocation = { latitude: coordinates[1], longitude: coordinates[0] };

    if (activeField === 'pickup') {
      setPickupQuery(suggestion.properties.label);
      // Assume function to update pickup location on map
    } else if (activeField === 'destination') {
      setDestinationQuery(suggestion.properties.label);
      // Assume function to update destination location on map
    }

    // Clear suggestions and active field
    setSuggestions([]);
    setActiveField('');
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
        }}>
        {/* Display route and markers */}
      </MapView>

      <BottomSheet ref={bottomSheetRef} index={0} snapPoints={snapPoints}>
        {/* Render input fields and other UI elements */}
        <TextInput
          style={styles.input}
          onFocus={() => setActiveField('pickup')}
          onChangeText={(text) => {
            setPickupQuery(text);
            fetchSuggestions(text);
          }}
          value={pickupQuery}
          placeholder="Pick Up"
        />
        <TextInput
          style={styles.input}
          onFocus={() => setActiveField('destination')}
          onChangeText={(text) => {
            setDestinationQuery(text);
            fetchSuggestions(text);
          }}
          value={destinationQuery}
          placeholder="Destination"
        />
        {/* Render autocomplete suggestions */}
        {suggestions.length > 0 && activeField && (
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.properties.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onSuggestionSelect(item)}>
                <Text>{item.properties.label}</Text>
              </TouchableOpacity>
            )}
          />
        )}
        {/* Other UI elements */}
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

export default MapScreen;
