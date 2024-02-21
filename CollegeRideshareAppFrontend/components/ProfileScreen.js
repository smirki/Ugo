import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const ProfileScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  // ... any other state you might need

  const handleVerification = () => {
    // Implement verification logic here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Fill out your profile</Text>
      <Text style={styles.subHeader}>To Ensure the safety of everyone on this platform</Text>
      <View style={styles.avatarContainer}>
        {/* Placeholder for avatar, implement image picker if needed */}
        <Image style={styles.avatar} source={require('../assets/favicon.png')} />
      </View>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Nickname (shown to drivers)"
        value={nickname}
        onChangeText={setNickname}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Emergency Contact"
        value={emergencyContact}
        onChangeText={setEmergencyContact}
      />
      {/* Implement driver's license upload feature */}
      <TouchableOpacity style={styles.verificationButton} onPress={handleVerification}>
        <Text style={styles.verificationButtonText}>Get Verified</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: 'grey',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  verificationButton: {
    width: '80%',
    backgroundColor: '#FFCC00',
    borderRadius: 25,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  verificationButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // ... add any other styles you might need
});

export default ProfileScreen;
