import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const notifications = [
  { id: '1', title: 'Your ride is on the way!', time: 'Just now' },
  { id: '2', title: 'Promo: 20% off your next ride', time: '1 hour ago' },
];

const NotificationsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationTime}>{item.time}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  notificationItem: {
    backgroundColor: '#FFCC00',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  notificationTitle: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  notificationTime: {
    fontSize: 14,
    color: 'black',
    opacity: 0.5,
  },
});

export default NotificationsScreen;
