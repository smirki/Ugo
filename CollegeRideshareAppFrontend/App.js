import * as React from 'react';
import { StyleSheet, Text, View, Image} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { styles }  from './style.js';
import { Button } from '@rneui/base';

//components
import HomeScreen from './components/HomeScreen.js';

const Onboarding = ({navigation}) => {
  return(
  <View style={styles.container}>
  <Image style={styles.mainCircleImage} source={ require('./assets/logo.png') }/>
  <Text style={styles.bigText} >Welcome to College Rideshare</Text>
  <Text>Getting you to where you need to be safely and making it affordable</Text>
  <Button
  onPress = {() =>
    navigation.navigate('HomeScreen')
  }
title="Learn More"
color="#841584"
accessibilityLabel="Learn more about this purple button"
/>
<Button title="Hello World" />
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
