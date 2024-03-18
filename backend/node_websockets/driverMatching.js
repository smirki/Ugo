const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let drivers = [];
let riders = [];

app.use(cors());
app.use(express.static('public'));

const verifyToken = (token) => {
  // Implement your token verification logic here
  // Return true if the token is valid, false otherwise
  // You can use JWT or any other token verification method
  return true;
};

wss.on('connection', (ws) => {
  console.log('New connection established');
  
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log('Received message:', data);

    // Verify token before processing the request
    if (data.token && verifyToken(data.token)) {
      if (data.type === 'join') {
        if (data.role === 'driver') {
          drivers.push({ id: data.id, ws, status: 'available' });
          console.log(`Driver ${data.id} joined`);
        } else if (data.role === 'rider') {
          riders.push({ id: data.id, ws, status: 'available' });
          console.log(`Rider ${data.id} joined`);
        }
        broadcastUserLists();
      } else if (data.type === 'requestRide') {
        let rider = riders.find((r) => r.id === data.id);
        if (!rider) {
          rider = { id: data.id, ws, status: 'available' };
          riders.push(rider);
          console.log(`New rider ${data.id} joined and requested a ride`);
          broadcastUserLists(); // Broadcast updated user lists after creating a new rider
        }
        rider.status = 'busy';
        const driversCopy = [...drivers];
        requestRide(rider, driversCopy);
        console.log(`Ride requested by rider ${rider.id}`);
        broadcastUserLists();
      } else if (data.type === 'declineRide') {
        const rider = riders.find((r) => r.id === data.riderId);
        if (rider) {
          const driversCopy = rider.driversCopy.filter((d) => d.id !== data.driverId);
          if (driversCopy.length > 0) {
            requestRide(rider, driversCopy);
          } else {
            rider.status = 'available';
            rider.ws.send(JSON.stringify({ type: 'noDriversAvailable' }));
            console.log(`Ride declined by all drivers for rider ${rider.id}`);
            broadcastUserLists();
          }
        }
      }
    }
  });

  ws.on('close', () => {
    drivers = drivers.filter((driver) => driver.ws !== ws);
    riders = riders.filter((rider) => rider.ws !== ws);
    console.log('Connection closed');
    broadcastUserLists();
  });
});

function requestRide(rider, driversCopy) {
  rider.driversCopy = driversCopy;
  const driver = driversCopy[0];
  if (driver) {
    driver.status = 'choosing';
    driver.ws.send(JSON.stringify({ type: 'rideRequest', riderId: rider.id }));
    console.log(`Ride request sent to driver ${driver.id} from rider ${rider.id}`);
    broadcastUserLists();
  } else {
    rider.status = 'available';
    rider.ws.send(JSON.stringify({ type: 'noDriversAvailable' }));
    console.log(`No drivers available for rider ${rider.id}`);
    broadcastUserLists();
  }
}

function broadcastUserLists() {
  const userLists = {
    type: 'userLists',
    drivers: drivers.map((driver) => ({ id: driver.id, status: driver.status })),
    riders: riders.map((rider) => ({ id: rider.id, status: rider.status })),
  };
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(userLists));
      console.log(JSON.stringify(userLists));
    }
  });
  console.log('Broadcasted user lists');
  console.log(JSON.stringify(userLists));
}

server.listen(3000, () => {
  console.log('Server started on port 3000');
});