import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';

const articlesData = [
  { id: '1', title: 'How to Reset Your Password' },
  { id: '2', title: 'Getting Started with Your Account' },
  { id: '3', title: 'How to Report a Problem' },
  { id: '4', title: 'Safety Tips for Drivers' },
  { id: '5', title: 'Understanding Your Ratings' },
  // Add more articles here
];

export default function SupportScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArticles, setFilteredArticles] = useState(articlesData);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text !== '') {
      const filteredData = articlesData.filter((item) =>
        item.title.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredArticles(filteredData);
    } else {
      setFilteredArticles(articlesData);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.articleItem}>
      <Text style={styles.articleTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBox}
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search articles..."
      />
      <FlatList
        data={filteredArticles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.articlesList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  searchBox: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
    margin: 10,
  },
  articlesList: {
    paddingHorizontal: 10,
  },
  articleItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  articleTitle: {
    fontSize: 18,
  },
});
