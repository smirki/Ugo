const WebSocket = require('ws');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const drivers = new Map(); // Store drivers as {id: socket, location, status}
const ridersQueue = []; // Queue of ride requests from riders
let requestIdCounter = 1; // Counter for generating unique request IDs

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case 'register_driver':
        drivers.set(data.id, { socket: ws, location: data.location, status: 'available' });
        ws.send(JSON.stringify({ type: 'driver_registered', id: data.id })); // Confirm registration
        break;
      case 'ride_request':
        const requestId = requestIdCounter++; // Generate a unique request ID
        ridersQueue.push({ ...data, requestId, socket: ws }); // Add requestId to the ride request
        findDriverForRider();
        break;
      case 'accept_ride':
        notifyRider(data.requestId, true);
        break;
      case 'decline_ride':
        notifyRider(data.requestId, false);
        findDriverForRider();
        break;
    }
  });
});

function findDriverForRider() {
  if (ridersQueue.length === 0) return;

  let closestDriver = null;
  let minDistance = Number.MAX_VALUE;
  const riderRequest = ridersQueue[0]; // Always try to serve the first rider in queue

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
      requestId: riderRequest.requestId, // Send requestId to the driver
      location: riderRequest.location,
      destination: riderRequest.destination,
      driverId: closestDriver // Include driver ID for confirmation
    }));
    drivers.get(closestDriver).status = 'busy'; // Mark driver as busy
    riderRequest.driverId = closestDriver; // Assign driver to rider request for later reference
  } else {
    riderRequest.socket.send(JSON.stringify({ type: 'no_driver_available', requestId: riderRequest.requestId }));
  }
}

function notifyRider(requestId, accepted) {
  const requestIndex = ridersQueue.findIndex(request => request.requestId === requestId);
  if (requestIndex === -1) return; // Request not found
  const riderRequest = ridersQueue.splice(requestIndex, 1)[0]; // Remove the rider request from the queue

  if (accepted) {
    // Notify the rider directly using the stored socket
    riderRequest.socket.send(JSON.stringify({ type: 'ride_accepted', requestId, driverId: riderRequest.driverId }));
    // Update the driver's status to 'enroute'
    if (drivers.has(riderRequest.driverId)) {
      drivers.get(riderRequest.driverId).status = 'enroute';
    }
  } else {
    // If declined, make the driver available again and try to find another driver
    if (drivers.has(riderRequest.driverId)) {
      drivers.get(riderRequest.driverId).status = 'available';
    }
    findDriverForRider();
  }
}


function calculateDistance(loc1, loc2) {
  // Dummy function for distance calculation
  return Math.sqrt((loc1.lat - loc2.lat) ** 2 + (loc1.long - loc2.long) ** 2);
}

server.listen(3000, () => {
  console.log('Server started on port 3000');
});
