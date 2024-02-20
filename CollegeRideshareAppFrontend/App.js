import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image , Button} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Image source={require('./assets/logo.png')} style={styles.mainCircleImage} />
      <Text style={styles.bigText} >Welcome to College Rideshare</Text>
      <Button
  title="Learn More"
  color="#841584"
  accessibilityLabel="Learn more about this purple button"
/>
    </View>
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
