import * as React from 'react';
import { StyleSheet, Text, View, Image, Button} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { styles }  from './style.js';

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
    navigation.replace('HomeScreen')
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
      <Stack.Navigator initialRouteName="Onboarding">
        <Stack.Screen
          name="Onboarding"
          component={Onboarding}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default App;
