const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",  // This will allow requests from any origin. Be cautious with this in production.
    methods: ["GET", "POST"] // Methods allowed to access the server
  }
});

app.get('/', (req, res) => {
  res.send('<h1>Hello from WebSocket Server!</h1>');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  socket.on('message', (msg) => {
    console.log('Message received: ' + msg);
    io.emit('message', msg);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});