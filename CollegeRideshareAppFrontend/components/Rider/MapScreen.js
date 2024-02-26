import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, FlatList, Text, Alert, Dimensions } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Location from 'expo-location';

const MapScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null); // Ref for the MapView
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
      setUserLocation(location);
    })();
  }, []);

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
    fetchSuggestions(searchQuery);
  }, [searchQuery]);

  const selectLocationAndFetchRoute = async (selectedLocation) => {
    const { coordinates } = selectedLocation.geometry;
    const [longitude, latitude] = coordinates;

    if (!userLocation) {
      console.log('User location is not available');
      return;
    }

    try {
      const routeRes = await fetch(`http://136.57.138.240:8080/ors/v2/directions/driving-car?start=${longitude},${latitude}&end=${userLocation.coords.longitude},${userLocation.coords.latitude}`);
      const routeData = await routeRes.json();
      const routeCoords = routeData.features[0].geometry.coordinates.map(coord => ({
        latitude: coord[1],
        longitude: coord[0],
      }));
      setRouteCoordinates(routeCoords);

      // Adjust map to fit the route
      mapRef.current.fitToCoordinates(routeCoords, {
        edgePadding: { top: 100, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    } catch (error) {
      console.error("Failed to fetch route", error);
      Alert.alert("Error", "Failed to fetch route");
    }
    // Close bottom sheet and clear suggestions
    setSuggestions([]);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <MapView
          ref={mapRef} // Set the ref for the MapView
          style={styles.map}
          initialRegion={{
            latitude: 35.3088,
            longitude: -80.7444,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#FECC4C"
            strokeWidth={6}
          />
        </MapView>

        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
        >
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a location"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.button} onPress={() => fetchSuggestions(searchQuery)}>
              <Ionicons name="search" size={25} color="white" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.properties.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.suggestionItem} onPress={() => selectLocationAndFetchRoute(item)}>
                <Text>{item.properties.label}</Text>
              </TouchableOpacity>
            )}
          />
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 5,
    padding: 10,
  },
  searchInput: {
    flex: 1,
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginRight: 10,
  },
  button: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default MapScreen;
