const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let drivers = [];
let riders = [];

app.use(express.static('public'));

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'join') {
      if (data.role === 'driver') {
        drivers.push({ id: data.id, ws, status: 'available' });
      } else if (data.role === 'rider') {
        riders.push({ id: data.id, ws, status: 'available' });
      }
      broadcastUserLists();
    } else if (data.type === 'requestRide') {
      const rider = riders.find((r) => r.id === data.id);
      if (rider) {
        rider.status = 'busy';
        const driversCopy = [...drivers];
        requestRide(rider, driversCopy);
        broadcastUserLists();
      }
    } else if (data.type === 'acceptRide') {
      const rider = riders.find((r) => r.id === data.riderId);
      const driver = drivers.find((d) => d.id === data.driverId);
      if (rider && driver) {
        rider.status = 'busy';
        driver.status = 'busy';
        rider.ws.send(JSON.stringify({ type: 'rideAccepted', driverId: data.driverId }));
        broadcastUserLists();
      }
    } else if (data.type === 'declineRide') {
      const rider = riders.find((r) => r.id === data.riderId);
      if (rider) {
        const driversCopy = rider.driversCopy.filter((d) => d.id !== data.driverId);
        if (driversCopy.length > 0) {
          requestRide(rider, driversCopy);
        } else {
          rider.status = 'available';
          rider.ws.send(JSON.stringify({ type: 'noDriversAvailable' }));
          broadcastUserLists();
        }
      }
    }
  });

  ws.on('close', () => {
    drivers = drivers.filter((driver) => driver.ws !== ws);
    riders = riders.filter((rider) => rider.ws !== ws);
    broadcastUserLists();
  });
});

function requestRide(rider, driversCopy) {
  rider.driversCopy = driversCopy;
  const driver = driversCopy[0];
  if (driver) {
    driver.status = 'choosing';
    driver.ws.send(JSON.stringify({ type: 'rideRequest', riderId: rider.id }));
    broadcastUserLists();
  } else {
    rider.status = 'available';
    rider.ws.send(JSON.stringify({ type: 'noDriversAvailable' }));
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
    }
  });
}

function requestRide(rider, driversCopy) {
  rider.driversCopy = driversCopy;
  const driver = driversCopy[0];
  if (driver) {
    driver.ws.send(JSON.stringify({ type: 'rideRequest', riderId: rider.id }));
  } else {
    rider.ws.send(JSON.stringify({ type: 'noDriversAvailable' }));
  }
}

server.listen(3000, () => {
  console.log('Server started on port 3000');
});