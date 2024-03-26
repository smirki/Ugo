const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

mongoose.connect('mongodb+srv://manavmaj2001:pEUHcpVLkrUys5VP@ugocluser.qv3ihnu.mongodb.net/UgoCluser?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

const rideSchema = new mongoose.Schema({
  riderId: String,
  driverId: String,
  status: String,
});

const Ride = mongoose.model('Ride', rideSchema);

const activeDriverSchema = new mongoose.Schema({
  driverId: String,
  available: Boolean,
});

const riderSchema = new mongoose.Schema({
  riderId: String,
});

const ActiveDriver = mongoose.model('ActiveDriver', activeDriverSchema);
const Rider = mongoose.model('Rider', riderSchema);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  console.log(`New client connected with ID: ${socket.id} on ${new Date().toISOString()}`);

  socket.on('register', async (data) => {
    console.log(`Register event received from ${socket.id}:`, data);
    try {
      if (data.type === 'driver') {
        await ActiveDriver.create({ driverId: socket.id, available: false });
      } else if (data.type === 'rider') {
        await Rider.create({ riderId: socket.id });
      }
      const drivers = await ActiveDriver.find();
      const riders = await Rider.find();
      io.emit('update', { drivers, riders });
    } catch (error) {
      console.error('Error registering user:', error);
    }
  });

  socket.on('setAvailability', async (available) => {
    try {
      await ActiveDriver.findOneAndUpdate({ driverId: socket.id }, { available });
      const drivers = await ActiveDriver.find();
      io.emit('update', { drivers });
    } catch (error) {
      console.error('Error setting driver availability:', error);
    }
  });

  socket.on('requestRide', async (data) => {
    try {
      const ride = await Ride.create({
        riderId: data.userId,
        status: 'pending',
      });
      io.emit('rideRequested', ride);
    } catch (error) {
      console.error('Error requesting ride:', error);
    }
  });

  socket.on('rideResponse', async (data) => {
    try {
      if (data.accepted) {
        await ActiveDriver.findOneAndUpdate({ driverId: socket.id }, { available: false });
        io.to(data.riderId).emit('rideAccepted', { driverId: socket.id });
      } else {
        const nextDriver = await findNextAvailableDriver(socket.id);
        if (nextDriver) {
          io.to(nextDriver.driverId).emit('rideRequested', { riderId: data.riderId });
        } else {
          io.to(data.riderId).emit('rideDeclined');
        }
      }
      const drivers = await ActiveDriver.find();
      const riders = await Rider.find();
      io.emit('update', { drivers, riders });
    } catch (error) {
      console.error('Error responding to ride request:', error);
    }
  });

  socket.on('disconnect', async () => {
    console.log(`Client with ID: ${socket.id} disconnected on ${new Date().toISOString()}`);
    console.log('Client disconnected:', socket.id);
    try {
      await ActiveDriver.findOneAndDelete({ driverId: socket.id });
      await Rider.findOneAndDelete({ riderId: socket.id });
      const drivers = await ActiveDriver.find();
      const riders = await Rider.find();
      
      io.emit('update', { drivers, riders });
    } catch (error) {
      console.error('Error removing user on disconnect:', error);
    }
  });
  socket.on('requestRide', async (data) => {
    try {
      const ride = await Ride.create({
        riderId: data.userId,
        status: 'pending',
      });
      io.emit('rideRequested', ride);
    } catch (error) {
      console.error('Error requesting ride:', error);
    }
  });
  socket.on('rideRequested', async (data) => {
    try {
      const availableDriver = await ActiveDriver.findOne({ available: true });
      if (availableDriver) {
        io.to(availableDriver.driverId).emit('rideRequested', { riderId: data.userId });
      } else {
        io.to(data.userId).emit('rideDeclined');
      }
    } catch (error) {
      console.error('Error requesting ride:', error);
    }
  });

  

  socket.on('completeRide', async () => {
    try {
      await ActiveDriver.findOneAndUpdate({ driverId: socket.id }, { available: true });
      io.emit('update', { drivers: await ActiveDriver.find() });
    } catch (error) {
      console.error('Error completing ride:', error);
    }
  });
  socket.on('rideAccepted', async (data) => {
    try {
      const ride = await Ride.findByIdAndUpdate(data.rideId, {
        driverId: data.driverId,
        status: 'accepted',
      });
      io.to(ride.riderId).emit('rideAccepted', ride);
    } catch (error) {
      console.error('Error accepting ride:', error);
    }
  });

  socket.on('completeRide', async (data) => {
    try {
      const ride = await Ride.findByIdAndUpdate(data.rideId, {
        status: 'completed',
      });
      io.to(ride.riderId).emit('rideCompleted', ride);
    } catch (error) {
      console.error('Error completing ride:', error);
    }
  });
});



async function findNextAvailableDriver(currentDriverId) {
  try {
    const drivers = await ActiveDriver.find({ available: true });
    const currentIndex = drivers.findIndex((driver) => driver.driverId === currentDriverId);
    return drivers[currentIndex + 1] || null;
  } catch (error) {
    console.error('Error finding next available driver:', error);
    return null;
  }
}

app.get('/rides', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, app.config['SECRET_KEY']);
    const userId = decoded.user;

    const rides = await Ride.find({ riderId: userId });
    res.json({ rides });
  } catch (error) {
    console.error('Error fetching rides:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});