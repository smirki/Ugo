import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
  Animated,
  Button
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

// Dummy data for the flat list
const data = [
  { key: '1', title: 'ATO', time: '8 PM EST.', backgroundColor: '#EBF8EE' },
  { key: '2', title: 'World Nightclub', time: '8 PM EST.', backgroundColor: '#FD4E26' },
  { key: '3', title: 'ATO', time: '8 PM EST.', backgroundColor: '#EBF8EE' },
  { key: '4', title: 'World Nightclub', time: '8 PM EST.', backgroundColor: '#FD4E26' },
  { key: '5', title: 'ATO', time: '8 PM EST.', backgroundColor: '#EBF8EE' },
  { key: '6', title: 'World Nightclub', time: '8 PM EST.', backgroundColor: '#FD4E26' },
  { key: '7', title: 'ATO', time: '8 PM EST.', backgroundColor: '#EBF8EE' },
  { key: '8', title: 'World Nightclub', time: '8 PM EST.', backgroundColor: '#FD4E26' },
];

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
      paddingHorizontal: 100,
      marginHorizontal: 18
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      alignItems: 'center',
      marginTop: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      alignSelf: 'flex-start',
      marginLeft: 10,
      marginTop: 10,
    },
    searchInput: {
      height: 40,
      marginVertical: 10,
      borderWidth: 1,
      padding: 10,
      borderRadius: 20,
      borderColor: '#ddd',
      backgroundColor: '#f9f9f9',
    },
    sectionHeader: {
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 10,
      marginVertical: 10,
    },
    columnWrapper: {
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    destinationCard: {
      backgroundColor: 'white', borderRadius: 10,
      padding: 15,
      margin: 5,
      alignItems: 'center',
      width: '48%', // approximately half of the screen width minus margin
    },
    destinationImage: {
      width: '100%',
      height: 120,
      borderRadius: 10,
      marginBottom: 8,
      // replace with actual image source
      justifyContent: 'center',
      alignItems: 'center',
    },
    destinationTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    destinationTime: {
      fontSize: 14,
      color: 'gray',
      marginBottom: 8,
    },
    goButtonSmall: {
      backgroundColor: '#ffcc00',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
    },
    goButtonTextSmall: {
      fontSize: 14,
      fontWeight: 'bold',
      color: 'white',
    },
    goButtonLarge: {
      backgroundColor: '#ffcc00',
      position: 'absolute',
      bottom: 30,
      alignSelf: 'center',
      width: 70,
      height: 70,
      borderRadius: 35,
      justifyContent: 'center',
      alignItems: 'center',
    },
    goButtonTextLarge: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      searchInputContainer: {
        flex: 1, // Take available space
        marginRight: 10, // Add margin between search input and filter button
      },
      searchInput: {
        // Style your search input
      },
      filterButton: {
        // Style your filter button
      },searchBar: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
      },
      searchInput: {
        flex: 1,
        paddingHorizontal: 10,
      },
      filterButton: {
        backgroundColor: '#FFCC00',
        borderRadius: 15,
        padding: 10,
      },
      iconWrapper: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 5,
      },
  });

const HomeScreen = ({ navigation }) => {

    // State for search input
  const [search, setSearch] = useState('');
  // Animated value for the search input width
  const searchWidth = useRef(new Animated.Value(200)).current;
    
    const animateSearchBar = () => {
        // Animate the width of the search bar
        Animated.timing(searchWidth, {
          toValue: 300, // Adjust the value to the width you want
          duration: 400,
          useNativeDriver: false, // width is not supported by native driver
        }).start();
      };
    
    // Function to render each destination card
    const renderDestination = ({ item }) => (
      <View style={styles.destinationCard}>
        <View style={[styles.destinationImage, { backgroundColor: item.backgroundColor }]}>
          {/* Replace with Image component if necessary */}
        </View>
        <Text style={styles.destinationTitle}>{item.title}</Text>
        <Text style={styles.destinationTime}>{item.time}</Text>
        <TouchableOpacity style={styles.goButtonSmall}>
          <Text style={styles.goButtonTextSmall}>GO</Text>
        </TouchableOpacity>
      </View>
    );
  
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
          <View style={styles.iconWrapper}>
            <Ionicons name="settings" size={24} color="black" />
          </View>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Find a Driver</Text>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Events..."
          onChangeText={setSearch}
          value={search}
        />
        <TouchableOpacity style={styles.filterButton} onPress={() => {}}>
          <Ionicons name="md-options" size={24} color="white" />
        </TouchableOpacity>
      </View>
        <Text style={styles.sectionHeader}>Popular Destinations</Text>
        <FlatList
          data={data}
          renderItem={renderDestination}
          keyExtractor={item => item.key}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
        <TouchableOpacity style={styles.goButtonLarge} onPress = {() =>
      navigation.navigate('RideConfirmation')
    }>
          <Text style={styles.goButtonTextLarge}>GO</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  };

  export default HomeScreen;