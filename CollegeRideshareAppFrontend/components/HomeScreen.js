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
  { key: '1', title: 'AvidXchange Music Factory', time: '9 PM EST', backgroundColor: '#EBF8EE', category: 'Nightlife' },
  { key: '2', title: 'Bojangles Coliseum', time: '8 PM EST', backgroundColor: '#FD4E26', category: 'Nightlife' },
  { key: '3', title: 'Ink n Ivy', time: '10 PM EST', backgroundColor: '#EBF8EE' },
  { key: '4', title: 'Merchant & Trade', time: '7 PM EST', backgroundColor: '#FD4E26' },
  { key: '5', title: 'Middle C Jazz', time: '6 PM EST', backgroundColor: '#EBF8EE' },
  { key: '6', title: 'Nuvole Rooftop TwentyTwo', time: '8 PM EST', backgroundColor: '#FD4E26' },
  { key: '7', title: 'Ovens Auditorium', time: '9 PM EST', backgroundColor: '#EBF8EE' },
  { key: '8', title: 'Petra\'s', time: '10 PM EST', backgroundColor: '#FD4E26' },
  { key: '9', title: 'Pinhouse', time: '11 AM EST', backgroundColor: '#EBF8EE' },
  { key: '10', title: 'PNC Music Pavilion', time: '8 PM EST', backgroundColor: '#FD4E26' },
  { key: '11', title: 'Puttery', time: '7 PM EST', backgroundColor: '#EBF8EE' },
  { key: '12', title: 'Skyla Credit Union Amphitheatre', time: '9 PM EST', backgroundColor: '#FD4E26' },
  { key: '13', title: 'Society at 229', time: '10 PM EST', backgroundColor: '#EBF8EE' },
  { key: '14', title: 'Spectrum Center', time: '8 PM EST', backgroundColor: '#FD4E26' },
  { key: '15', title: 'SupperClub', time: '11 PM EST', backgroundColor: '#EBF8EE' },
  { key: '16', title: 'The Amp Ballantyne', time: '9 PM EST', backgroundColor: '#FD4E26' },
  { key: '17', title: 'The Comedy Zone', time: '8 PM EST', backgroundColor: '#EBF8EE' },
  { key: '18', title: 'The Fillmore', time: '10 PM EST', backgroundColor: '#FD4E26' },
  { key: '19', title: 'The Underground', time: '9 PM EST', backgroundColor: '#EBF8EE' },
  { key: '20', title: 'The Union at Station West', time: '8 PM EST', backgroundColor: '#FD4E26' },
  // Adding fictional grocery stores with random times
  { key: '21', title: 'Charlotte Grocery Store A', time: 'Open 24 Hours', backgroundColor: '#B2EBF2', category: 'Grocery' },
  { key: '22', title: 'Charlotte Grocery Store B', time: '6 AM - 11 PM EST', backgroundColor: '#B2EBF2', category: 'Grocery' },
  { key: '23', title: 'Charlotte Grocery Store C', time: '7 AM - 10 PM EST', backgroundColor: '#B2EBF2' },
  { key: '24', title: 'Charlotte Grocery Store D', time: '5 AM - Midnight EST', backgroundColor: '#B2EBF2' },
  // ... add more venues and grocery stores as needed
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
        flex: 1, 
        marginRight: 10, 
      },
      searchInput: {
        // Style your search input
      },
      filterButton: {
        
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
      filtersContainer: {
        flexDirection: 'row',
    flexWrap: 'wrap', // This allows the filter tags to wrap to the next line
    justifyContent: 'center',
    paddingVertical: 10,
      },
      filterTag: {
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginHorizontal: 5,
      },
      activeFilterTag: {
        backgroundColor: '#FECC4C', // Change color for active state
        color: 'white',
      },
      filterTagText: {
        color: 'black',
      },
  });


  
  

const HomeScreen = ({ navigation }) => {
  const handlePressGo = (item) => {
    navigation.navigate('RideConfirmation', {
      pickupAddress: 'Pickup Address Here or Get User Address', 
      destinationAddress: item.title,
    });
  };

    // State for search input

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  // Animated value for the search input width
  const searchWidth = useRef(new Animated.Value(200)).current;

  const filteredData = data.filter(item => 
    activeCategory === 'All' || item.category === activeCategory
  );
    
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
        <TouchableOpacity style={styles.goButtonSmall} onPress={() => handlePressGo(item)}>
          <Text style={styles.goButtonTextSmall}>GO</Text>
        </TouchableOpacity>
      </View>
    );

    const renderFilterTag = (category) => (
      <TouchableOpacity
        key={category}
        style={[styles.filterTag, activeCategory === category && styles.activeFilterTag]}
        onPress={() => setActiveCategory(category)}
      >
        <Text style={styles.filterTagText}>{category}</Text>
      </TouchableOpacity>
    );
  
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
        
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
          <Ionicons name="options" size={24} color="white" />
        </TouchableOpacity>
      </View>
        <Text style={styles.sectionHeader}>Popular Destinations</Text>
        <View style={styles.filtersContainer}>
        {['All', 'Nightlife', 'Grocery', 'Party', 'Frat', 'Venue', 'Bar', 'Brewery'].map(renderFilterTag)}
      </View>
      <FlatList
        data={filteredData}
        renderItem={renderDestination}
        keyExtractor={item => item.key}
        numColumns={2}
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