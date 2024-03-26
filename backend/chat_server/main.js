// server.js
const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const messages = [];

wss.on('connection', (ws, req) => {
  console.log('Client connected');

  // Extract the token from the query parameter
  const token = new URLSearchParams(req.url.substring(1)).get('token');
  console.log('Token received:', token);

  if (!token) {
    console.log('Connection rejected: Token is required');
    ws.close(1008, 'Token is required');
    return;
  }

  // Allow any non-empty token for now
  if (token) {
    try {
      // For now, we're skipping the verification step.
      // In the future, use jwt.verify(token, 'your_secret_key') to verify the token
      // const decoded = jwt.verify(token, 'your_secret_key');
      // ws.user = decoded;
      ws.user = { id: 'user_id_placeholder', token }; // Placeholder user object
      console.log('Token accepted:', token);
    } catch (err) {
      console.error('Token verification error:', err);
      ws.close(1008, 'Invalid token');
      return;
    }
  }

  // Send all previous messages to the newly connected client
  ws.send(JSON.stringify({ type: 'previous messages', messages }));

  ws.on('message', (data) => {
    console.log('Message received:', data);
    const message = JSON.parse(data);

    if (message.type === 'new message') {
      message.id = uuidv4();
      message.likes = 0;
      messages.push(message);

      // Broadcast the new message to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'new message', message }));
        }
      });
    } else if (message.type === 'like message') {
      const messageToLike = messages.find((msg) => msg.id === message.messageId);
      if (messageToLike) {
        messageToLike.likes += 1;

        // Broadcast the liked message to all connected clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'message liked', messageId: message.messageId }));
          }
        });
      }
    }
  });

  ws.on('close', (event) => {
    console.log('Client disconnected, code:', event.code, 'reason:', event.reason);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
