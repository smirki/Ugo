import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const Onboarding = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Icons and illustrations here */}
      <View style={styles.iconsContainer}>
        <Image style={styles.icon} source={require('../assets/favicon.png')} />
        <Image style={styles.icon} source={require('../assets/favicon.png')} />
        <Image style={styles.icon} source={require('../assets/favicon.png')} />
      </View>
      <View style={styles.circle}>
        <Image style={styles.carImage} source={require('../assets/logo.png')} />
      </View>
      <Text style={styles.headerText}>Welcome to Ugo</Text>
      <Text style={styles.subHeaderText}>
        Getting you to where you need to be safely and making it affordable.
      </Text>
      <TouchableOpacity
        style={styles.getStartedButton}
        onPress={() => navigation.replace('HomeTabs')}
      >
        <Text style={styles.getStartedButtonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // Set width or margin as needed to position your icons
  },
  icon: {
    // Add styles for the icons if needed
  },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFCC00', // Use the color from your brand palette
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  carImage: {
    // Adjust the size as needed based on your icon's aspect ratio
    width: 100,
    height: 50,
  },
  headerText: {
    fontSize: 110,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  getStartedButton: {
    backgroundColor: '#FFCC00',
    padding: 15,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
    marginBottom: 50,
  },
  getStartedButtonText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  // ... any additional styles you may need
});

export default Onboarding;
