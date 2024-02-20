import * as React from 'react';
import { StyleSheet, Text, View, Image , Button} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



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

const HomeScreen = ({navigation}) => { <View style={styles.container}> hi </View> };

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FECC4C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigText: {
    fontSize: 40,
    textAlign: "center",
    color: 'black',
  },
  mainCircleImage: {
    height: 80,
    width: 80,
    borderRadius: 40,
  }
});


export default App;
