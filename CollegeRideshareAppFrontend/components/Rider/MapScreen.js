import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Dimensions, Text, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Location from 'expo-location'; // Make sure to install expo-location

const MapScreen = () => {
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['50%','75%'], []);

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

    const fetchRoute = async () => {
        if (!userLocation) {
            console.log('user no location');
            return;
        }

        console.log(latitude, longitude,userLocation.coords.latitude, userLocation.coords.longitude )

        const response = await fetch(`http://136.57.138.240:8080/ors/v2/directions/driving-car?start=${latitude},${longitude}&end=${userLocation.coords.longitude},${userLocation.coords.latitude}`);
        const data = await response.json();
        console.log(data);
        const coordinates = data.features[0].geometry.coordinates.map(coord => ({
            latitude: coord[1],
            longitude: coord[0]
        }));
        setRouteCoordinates(coordinates);
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          <MapView
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
                strokeColor="#FECC4C" // Color of the polyline
                strokeWidth={6} // Thickness of the polyline
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
                placeholder="Latitude"
                value={latitude}
                onChangeText={setLatitude}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Longitude"
                value={longitude}
                onChangeText={setLongitude}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.button} onPress={fetchRoute}>
                <Ionicons name="send" size={25} color="white" />
              </TouchableOpacity>
            </View>
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
  
});

export default MapScreen;