import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

// Ensure you've got the icons you want to use for the buttons and user location
import { Ionicons } from '@expo/vector-icons'; // or any other icon library you prefer

const MapScreen = () => {
    // State for search input
    const [search, setSearch] = React.useState('');
  
    // This is just dummy data for the markers
    const markers = [
      { id: '1', latlng: { latitude: 37.78825, longitude: -122.4324 }, title: 'Spot 1', description: 'This is spot 1' },
      // Add more markers here
    ];
  
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          customMapStyle={mapStyle} // Your custom map style
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.latlng}
              title={marker.title}
              description={marker.description}
            />
          ))}
          {/* User location marker */}
          <Marker
            coordinate={{ latitude: 37.78825, longitude: -122.4324 }} // replace with user's actual location
            title="Your Location"
          >
            {/* Custom user location icon */}
            <Ionicons name="person-circle" size={30} color="black" />
          </Marker>
        </MapView>
  
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search here..."
            value={search}
            onChangeText={setSearch}
          />
          {/* Add additional buttons as needed */}
          <TouchableOpacity style={styles.button}>
            <Ionicons name="options" size={25} color="black" />
          </TouchableOpacity>
        </View>
      </View>
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
      position: 'absolute',
      top: 10,
      width: width * 0.9,
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
    // ...add other styles you may need
  });
  
  // Define your custom map style
  const mapStyle = [
    {
        "featureType": "all",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "gamma": 0.5
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text",
        "stylers": [
            {
                "color": "#e90303"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "saturation": "-4"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#000000"
            },
            {
                "saturation": "66"
            },
            {
                "lightness": "-92"
            },
            {
                "gamma": "1.76"
            },
            {
                "weight": "0.20"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.attraction",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#db6f6f"
            },
            {
                "weight": "0.01"
            },
            {
                "lightness": "9"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#b74a4a"
            },
            {
                "gamma": "1.23"
            },
            {
                "weight": "0.32"
            },
            {
                "saturation": "17"
            },
            {
                "lightness": "40"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "saturation": "40"
            },
            {
                "color": "#434343"
            }
        ]
    }
  ];

  export default MapScreen;
  
