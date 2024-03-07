import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const notifications = [
  {
    id: '1',
    title: 'Your ride is arriving in 5 minutes!',
    description: 'Your driver, John, is on the way to pick you up.',
    time: 'Just now',
    icon: 'car',
    color: '#4CAF50',
  },
  {
    id: '2',
    title: 'Promo: 50% off your next ride',
    description: 'Use code RIDE50 to get 50% off your next ride.',
    time: '2 hours ago',
    icon: 'pricetag',
    color: '#2196F3',
  },
  {
    id: '3',
    title: 'Ride completed',
    description: 'Your ride from Downtown to University Campus has been completed.',
    time: '1 day ago',
    icon: 'checkmark-circle',
    color: '#FF9800',
  },
  {
    id: '4',
    title: 'New feature: Schedule rides',
    description: 'You can now schedule rides in advance! Try it out now.',
    time: '3 days ago',
    icon: 'calendar',
    color: '#9C27B0',
  },
];

const NotificationsScreen = () => {
  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity style={[styles.notificationItem, { backgroundColor: item.color }]}>
      <View style={styles.notificationIconContainer}>
        <Ionicons name={item.icon} size={24} color="white" />
      </View>
      <View style={styles.notificationTextContainer}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationDescription}>{item.description}</Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.notificationList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  notificationList: {
    paddingHorizontal: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  notificationDescription: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
  notificationTime: {
    fontSize: 14,
    color: 'white',
    opacity: 0.7,
  },
});

export default NotificationsScreen;