const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
const server = http.createServer(app);
const io = socketIO(server);

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('A client connected');

  // Handle joystick data received from the React app
  socket.on('joystickData', (data) => {
    console.log('Joystick data received:', data);
    // Send data back to the client (echo)
    socket.emit('joystickData', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
