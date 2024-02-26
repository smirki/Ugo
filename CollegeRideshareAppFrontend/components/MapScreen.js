import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const MapScreen = () => {
    const [search, setSearch] = React.useState('');

        // Ref for the bottom sheet
    const bottomSheetRef = useRef(null);

    // Variables for the bottom sheet behavior
    const snapPoints = useMemo(() => ['25%', '50%'], []);

    // Callback for handling the bottom sheet changes
    const handleSheetChanges = useCallback((index) => {
        console.log('Bottom sheet has snapped to:', index);
    }, []);

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

      const routeCoordinates = [
        [
            -80.744304,
            35.308884
        ],
        [
            -80.744385,
            35.308945
        ],
        [
            -80.744388,
            35.309228
        ],
        [
            -80.744516,
            35.30924
        ],
        [
            -80.744775,
            35.309409
        ],
        [
            -80.744672,
            35.30951
        ],
        [
            -80.745461,
            35.310026
        ],
        [
            -80.745589,
            35.310129
        ],
        [
            -80.745857,
            35.310351
        ],
        [
            -80.746543,
            35.310843
        ],
        [
            -80.746611,
            35.310891
        ],
        [
            -80.746718,
            35.310924
        ],
        [
            -80.74705,
            35.31112
        ],
        [
            -80.747407,
            35.311386
        ],
        [
            -80.747481,
            35.311404
        ],
        [
            -80.747524,
            35.311392
        ],
        [
            -80.747408,
            35.311494
        ],
        [
            -80.747725,
            35.311785
        ],
        [
            -80.747947,
            35.312015
        ],
        [
            -80.748245,
            35.312372
        ],
        [
            -80.748782,
            35.313099
        ],
        [
            -80.748919,
            35.313246
        ],
        [
            -80.749107,
            35.313411
        ],
        [
            -80.749305,
            35.313561
        ],
        [
            -80.749513,
            35.313691
        ],
        [
            -80.749746,
            35.31381
        ],
        [
            -80.750215,
            35.313982
        ],
        [
            -80.750591,
            35.314067
        ],
        [
            -80.750811,
            35.314087
        ],
        [
            -80.751146,
            35.314083
        ],
        [
            -80.751395,
            35.314049
        ],
        [
            -80.751701,
            35.313968
        ],
        [
            -80.751984,
            35.313846
        ],
        [
            -80.752305,
            35.313642
        ],
        [
            -80.752511,
            35.313462
        ],
        [
            -80.752677,
            35.313272
        ],
        [
            -80.752822,
            35.313026
        ],
        [
            -80.752917,
            35.312789
        ],
        [
            -80.752965,
            35.312552
        ],
        [
            -80.752974,
            35.312312
        ],
        [
            -80.75297,
            35.312212
        ],
        [
            -80.752928,
            35.311017
        ],
        [
            -80.752962,
            35.310719
        ],
        [
            -80.753124,
            35.310339
        ],
        [
            -80.753357,
            35.310023
        ],
        [
            -80.75428,
            35.309152
        ],
        [
            -80.756228,
            35.310505
        ],
        [
            -80.75643,
            35.310629
        ],
        [
            -80.756615,
            35.310758
        ],
        [
            -80.757219,
            35.311169
        ],
        [
            -80.758119,
            35.31174
        ],
        [
            -80.758986,
            35.312215
        ],
        [
            -80.759962,
            35.312677
        ],
        [
            -80.760196,
            35.312798
        ],
        [
            -80.76059,
            35.312972
        ],
        [
            -80.761588,
            35.313348
        ],
        [
            -80.762287,
            35.313586
        ],
        [
            -80.762789,
            35.313733
        ],
        [
            -80.763241,
            35.31387
        ],
        [
            -80.763448,
            35.314002
        ],
        [
            -80.763526,
            35.314065
        ],
        [
            -80.763569,
            35.314125
        ],
        [
            -80.763606,
            35.314254
        ],
        [
            -80.763599,
            35.314342
        ],
        [
            -80.763554,
            35.314489
        ],
        [
            -80.763391,
            35.314755
        ],
        [
            -80.763165,
            35.315008
        ],
        [
            -80.763009,
            35.315143
        ],
        [
            -80.762701,
            35.315362
        ],
        [
            -80.762592,
            35.315424
        ],
        [
            -80.762461,
            35.315491
        ],
        [
            -80.762406,
            35.315546
        ],
        [
            -80.762192,
            35.315626
        ],
        [
            -80.761403,
            35.315864
        ],
        [
            -80.761193,
            35.315944
        ],
        [
            -80.76102,
            35.315307
        ],
        [
            -80.760787,
            35.315347
        ],
        [
            -80.760653,
            35.315384
        ],
        [
            -80.76058,
            35.315416
        ]
    ].map(coord => ({ latitude: coord[1], longitude: coord[0] }));

    // Sample markers for University City, Charlotte, NC
    const markers = [
      { id: '1', latlng: { latitude: 35.3088, longitude: -80.7444 }, title: 'UNC Charlotte', description: 'University of North Carolina at Charlotte' },
      { id: '2', latlng: { latitude: 35.3156, longitude: -80.7607 }, title: 'IKEA', description: 'Furniture store in University City' },
      // Add more markers as needed
    ];

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
            customMapStyle={mapStyle}
          >
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                coordinate={marker.latlng}
                title={marker.title}
                description={marker.description}
              />
            ))}
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
            onChange={handleSheetChanges}
          >
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search here..."
                value={search}
                onChangeText={setSearch}
              />
              <TouchableOpacity style={styles.button}>
                <Ionicons name="options" size={25} color="black" />
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
  // Define your custom map style here
  
});

export default MapScreen;