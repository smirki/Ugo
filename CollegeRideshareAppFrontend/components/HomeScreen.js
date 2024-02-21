import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView
} from 'react-native';

// Dummy data for the flat list
const data = [
  { key: '1', title: 'ATO', time: '8 PM EST.', backgroundColor: '#EBF8EE' },
  { key: '2', title: 'World Nightclub', time: '8 PM EST.', backgroundColor: '#FD4E26' },
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
    }
  });

const HomeScreen = ({ navigation }) => {
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
          <TouchableOpacity onPress={() => {}}>
            <Image source={require('../assets/favicon.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Image source={require('../assets/favicon.png')} />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Find a Driver</Text>
        <TextInput style={styles.searchInput} placeholder="Search Events..." />
        <Text style={styles.sectionHeader}>Popular Destinations</Text>
        <FlatList
          data={data}
          renderItem={renderDestination}
          keyExtractor={item => item.key}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
        <TouchableOpacity style={styles.goButtonLarge}>
          <Text style={styles.goButtonTextLarge}>GO</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  };

  export default HomeScreen;