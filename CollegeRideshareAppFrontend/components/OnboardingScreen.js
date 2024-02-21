import React from 'react';
import { styles }  from '../style.js';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    FlatList,
    SafeAreaView,
    Button
  } from 'react-native';

const Onboarding = ({navigation}) => {
    return(
    <View style={styles.container}>
    <Image style={styles.mainCircleImage} source={ require('../assets/logo.png') }/>
    <Text style={styles.bigText} >Welcome to College Rideshare</Text>
    <Text>Getting you to where you need to be safely and making it affordable</Text>
    <Button
    onPress = {() =>
      navigation.replace('HomeTabs')
    }
  title="Learn More"
  color="#841584"
  accessibilityLabel="Learn more about this purple button"
  />
  <Button title="Hello World" />
  </View>
    )
  }

export default Onboarding;
  