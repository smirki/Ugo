import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetchUserInfo();
    connectToSocket();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);
  

  const fetchUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await fetch('https://login.saipriya.org/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          try {
            const data = await response.json();
            setUser(data.user);
          } catch (error) {
            console.log('Failed to parse server response:', error);
          }
        } else {
          console.log('Failed to retrieve user information');
        }
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const connectToSocket = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const newSocket = new WebSocket(`ws://localhost:3000?token=${token}`);

        newSocket.onopen = () => {
          console.log('WebSocket connected');
        };

        newSocket.onmessage = (event) => {
          const { type, message, messages, messageId } = JSON.parse(event.data);
          if (type === 'previous messages') {
            setMessages(messages);
          } else if (type === 'new message') {
            setMessages((prevMessages) => [...prevMessages, message]);
          } else if (type === 'message liked') {
            setMessages((prevMessages) =>
              prevMessages.map((msg) => {
                if (msg.id === messageId) {
                  return { ...msg, likes: msg.likes + 1 };
                }
                return msg;
              })
            );
          }
        };

        newSocket.onclose = (event) => {
          console.log('WebSocket closed:', event.code, event.reason);
        };

        newSocket.onerror = (error) => {
          console.log('WebSocket error:', error);
        };

        setSocket(newSocket);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const sendMessage = () => {
    if (socket && inputText.trim() !== '') {
      const message = {
        type: 'new message',
        text: inputText.trim(),
        timestamp: new Date().toISOString(),
      };
      socket.send(JSON.stringify(message));
      setInputText('');
    }
  };

  const likeMessage = (messageId) => {
    if (socket) {
      const message = {
        type: 'like message',
        messageId,
      };
      socket.send(JSON.stringify(message));
    }
  };

  const renderMessageItem = ({ item }) => {
    const isUserMessage = item.sender === user?.id;
  
    const renderInitialsCircle = (name) => {
      const initials = name ? name.charAt(0).toUpperCase() : '?';
      return (
        <View style={styles.initialsCircle}>
          <Text style={styles.initialsText}>{initials}</Text>
        </View>
      );
    };
    
    const senderAvatar = item.senderProfilePic
      ? <Image source={{ uri: item.senderProfilePic }} style={styles.profilePic} />
      : renderInitialsCircle(item.senderName);
    
    const userAvatar = user && user.name
      ? renderInitialsCircle(user.name)
      : null;
    
    return (
      <View style={[
        styles.messageItem, 
        isUserMessage ? styles.userMessageItem : styles.otherMessageItem
      ]}>
        {!isUserMessage && (
          <View style={styles.senderInfo}>
            {senderAvatar}
            <Text style={styles.senderName}>{item.senderName}</Text>
          </View>
        )}
        <View style={[styles.messageContent, isUserMessage && styles.userMessageContent]}>
          <Text style={[styles.messageText, isUserMessage && styles.userMessageText]}>
            {item.text}
          </Text>
          <View style={styles.messageFooter}>
            <Text style={styles.messageTime}>{new Date(item.timestamp).toLocaleString()}</Text>
            <TouchableOpacity onPress={() => likeMessage(item.id)}>
              <Text style={styles.likeButton}>Like ({item.likes})</Text>
            </TouchableOpacity>
          </View>
        </View>
        {isUserMessage && (
          <View style={styles.userInfo}>
            {userAvatar}
          </View>
        )}
      </View>
    );
  };
  
  

  return (
    <View style={styles.container}>
      {user && (
        <View style={styles.headerContainer}>
          <Image source={{ uri: user.profilePic }} style={styles.profilePic} />
          <Text style={styles.userName}>{user.name}</Text>
        </View>
      )}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#999999"
          value={inputText}
          onChangeText={(text) => setInputText(text)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  initialsCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#C4C4C4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  initialsText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // ... any other styles you may need
  userMessageText: {
    color: '#FFFFFF', // If user message text should also be white
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },

  initialsCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#C4C4C4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  initialsText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageList: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  messageItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  userMessageItem: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  messageContent: {
    flex: 1,
    marginLeft: 10,
  },
  senderName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
    color: '#333333',
  },

  otherMessageItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignSelf: 'flex-start',
    maxWidth: '80%', // Ensure the message doesn't take the full width
  },
  
  // Updated userMessageItem to only include unique styles
  userMessageItem: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF', // iOS blue color for the user's messages
    maxWidth: '80%', // Ensure the message doesn't take the full width
  },
  
  messageContent: {
    // Removed marginLeft to apply it conditionally below
    flex: 1,
  },
  
  // Apply conditional padding based on the message owner
  messageText: {
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#007AFF',
    borderRadius: 15,
    overflow: 'hidden', // This is to ensure the text doesn't spill out of borderRadius
    maxWidth: '80%',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  messageTime: {
    fontSize: 12,
    color: '#999999',
  },
  likeButton: {
    fontSize: 12,
    color: '#999999',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
    },
    otherMessageItem: {
    justifyContent: 'flex-start',
    },
    userMessageItem: {
    justifyContent: 'flex-end',
    },
    senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    },
    userInfo: {
    marginLeft: 10,
    },
    messageContent: {
    maxWidth: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 10,
    },
    userMessageContent: {
    backgroundColor: '#007AFF',
    },
    messageText: {
    fontSize: 16,
    color: '#333333',
    },
    userMessageText: {
    color: '#FFFFFF',
    },
});

export default ChatScreen;