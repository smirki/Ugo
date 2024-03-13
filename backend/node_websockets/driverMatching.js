const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, 'public')));

const drivers = new Map();
const ridersQueue = [];
let requestIdCounter = 1;

const uri = "mongodb+srv://manavmaj2001:pEUHcpVLkrUys5VP@ugocluser.qv3ihnu.mongodb.net/?retryWrites=true&w=majority&appName=UgoCluser";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect((err) => {
  if (err) {
    console.error('Failed to connect to MongoDB:', err);
    return;
  }
  console.log('Connected to MongoDB');

  const db = client.db('UgoRideshare');
  const driversCollection = db.collection('Drivers');

  wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
      const data = JSON.parse(message);

      switch (data.type) {
        case 'register_driver':
          drivers.set(data.id, { socket: ws, location: data.location, status: 'available' });
          await driversCollection.updateOne(
            { _id: data.id },
            { $set: { status: 'available' } },
            { upsert: true }
          );
          ws.send(JSON.stringify({ type: 'driver_registered', id: data.id }));
          broadcastDrivers();
          break;
        case 'ride_request':
          const requestId = requestIdCounter++;
          ridersQueue.push({ ...data, requestId, socket: ws });
          findDriverForRider();
          break;
        case 'accept_ride':
          await notifyRider(data.requestId, true);
          break;
        case 'decline_ride':
          await notifyRider(data.requestId, false);
          findDriverForRider();
          break;

case 'toggle_availability':
  const driverId = data.driverId;
  const driver = await driversCollection.findOne({ _id: driverId });
  if (driver) {
    const newStatus = driver.status === 'available' ? 'busy' : 'available';
    await driversCollection.updateOne({ _id: driverId }, { $set: { status: newStatus } });
    broadcastDrivers();
  }
  break;
      }
    });
  });

  async function findDriverForRider() {
    if (ridersQueue.length === 0) return;
  
    let closestDriver = null;
    let minDistance = Number.MAX_VALUE;
    const riderRequest = ridersQueue[0];
  
    drivers.forEach((value, key) => {
      if (value.status === 'available') {
        const distance = calculateDistance(riderRequest.location, value.location);
        if (distance < minDistance) {
          minDistance = distance;
          closestDriver = key;
        }
      }
    });
  
    if (closestDriver) {
      drivers.get(closestDriver).socket.send(JSON.stringify({
        type: 'new_ride_request',
        requestId: riderRequest.requestId,
        location: riderRequest.location,
        destination: riderRequest.destination,
        driverId: closestDriver
      }));
      drivers.get(closestDriver).status = 'busy';
      riderRequest.driverId = closestDriver;
    } else {
      riderRequest.socket.send(JSON.stringify({ type: 'no_driver_available', requestId: riderRequest.requestId }));
    }
    broadcastDrivers();
  }

  async function notifyRider(requestId, accepted) {
    const requestIndex = ridersQueue.findIndex(request => request.requestId === requestId);
    if (requestIndex === -1) return;
    const riderRequest = ridersQueue.splice(requestIndex, 1)[0];

    if (accepted) {
      riderRequest.socket.send(JSON.stringify({ type: 'ride_accepted', requestId, driverId: riderRequest.driverId }));
      if (drivers.has(riderRequest.driverId)) {
        drivers.get(riderRequest.driverId).status = 'enroute';
        await driversCollection.updateOne(
          { _id: riderRequest.driverId },
          { $set: { status: 'enroute' } }
        );
      }
    } else {
      if (drivers.has(riderRequest.driverId)) {
        drivers.get(riderRequest.driverId).status = 'available';
        await driversCollection.updateOne(
          { _id: riderRequest.driverId },
          { $set: { status: 'available' } }
        );
      }
      findDriverForRider();
    }
    broadcastDrivers();
  }

  function calculateDistance(loc1, loc2) {
    return Math.sqrt((loc1.lat - loc2.lat) ** 2 + (loc1.long - loc2.long) ** 2);
  }

  async function broadcastDrivers() {
    const driversArray = await driversCollection.find().toArray();
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'drivers_update', drivers: driversArray }));
      }
    });
  }
  
});

server.listen(3000, () => {
  console.log('Server started on port 3000');
});