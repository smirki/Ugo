const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Secret key for JWT
const secretKey = 'your-secret-key';

// Middleware to verify JWT token
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    return null;
  }
};

// Store messages in memory (you can use a database instead)
const messages = [];

wss.on('connection', (socket, req) => {
  const token = req.url.split('token=')[1];
  const decoded = verifyToken(token);

  if (decoded) {
    console.log('User connected:', decoded);

    // Send previous messages to the client
    socket.send(JSON.stringify({ type: 'previous messages', messages }));

    // Handle new message
    socket.on('message', (message) => {
      const { text, timestamp } = JSON.parse(message);
      const newMessage = {
        id: messages.length + 1,
        text,
        sender: decoded.id,
        senderName: decoded.name,
        senderProfilePic: decoded.profilePic,
        timestamp,
        likes: 0,
      };
      messages.push(newMessage);
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'new message', message: newMessage }));
        }
      });
    });

    // Handle message like
    socket.on('message', (message) => {
      const { type, messageId } = JSON.parse(message);
      if (type === 'like message') {
        const message = messages.find((msg) => msg.id === messageId);
        if (message) {
          message.likes += 1;
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: 'message liked', messageId }));
            }
          });
        }
      }
    });

    // Handle disconnection
    socket.on('close', () => {
      console.log('User disconnected:', decoded);
    });
  } else {
    socket.close(4001, 'Authentication error');
  }
});

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});