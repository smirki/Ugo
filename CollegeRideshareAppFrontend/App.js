import * as React from 'react';
import { StyleSheet, Text, View, Image , Button} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { styles }  from './style.js'

//components
import HomeScreen from './components/HomeScreen.js';

const Onboarding = ({navigation}) => {
  return(
  <View style={styles.container}>
  <Text style={styles.bigText} >Welcome to College Rideshare</Text>
  <Button
  onPress = {() =>
    navigation.navigate('HomeScreen')
  }
title="Learn More"
color="#841584"
accessibilityLabel="Learn more about this purple button"
/>
</View>
  )
}


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen 

      name= "Onboarding" 
      component = {Onboarding}>
        </Stack.Screen>
      <Stack.Screen name = "HomeScreen" component = {HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default App;
