import React from "react";
import { View, Text } from "react-native";
import { styles }  from '../style.js'
import { SearchBar } from '@rneui/themed';


export default function HomeScreen ({navigation}) { 
    return(
<View style={styles.container}>
    <Text>Find a</Text>
    <Text>Driver</Text>
    <SearchBar style={styles.searchbarHome}
    placeholder="Type Here...">
        Hi
        </SearchBar>
</View> 
    )
};