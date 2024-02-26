import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

export default function EarningsScreen() {
  // Dummy data for the example
  const earningsData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        data: [450, 650, 800, 900],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ]
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Earnings Overview</Text>
      <LineChart
        data={earningsData}
        width={screenWidth - 20}
        height={220}
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726'
          }
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />
      <View style={styles.earningsContainer}>
        {earningsData.labels.map((label, index) => (
          <Text key={label} style={styles.earningsText}>{`${label}: $${earningsData.datasets[0].data[index]}`}</Text>
        ))}
      </View>
      <TouchableOpacity style={styles.exportButton}>
        <Text style={styles.exportButtonText}>Export Earnings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  earningsContainer: {
    marginVertical: 20,
  },
  earningsText: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 5,
    textAlign: 'center',
  },
  exportButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
