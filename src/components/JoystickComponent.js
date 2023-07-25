import React, { useRef, useEffect, useState } from 'react';
import { Joystick } from 'react-joystick-component';
import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:8080'; // Replace with your server URL

// Component to display individual attribute with styling
const DataDisplay = ({ label, value }) => (
  <div style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
    <span style={{ fontWeight: 'bold' }}>{label}:</span> {value}
  </div>
);

const JoystickComponent = () => {
  const socket = useRef(null);
  const [receivedData, setReceivedData] = useState({
    radial_distance: 0,
    direction: '',
    x: 0,
    y: 0
  });

  useEffect(() => {
    socket.current = io(URL, {
      transports: ['websocket', 'polling'],
    }); 

    // Listen for incoming data from the WebSocket server
    socket.current.on('joystickData', (data) => {
      // Update the state with received data
      setReceivedData(data);
    });

    return () => {
      // Clean up the socket connection when the component unmounts
      socket.current.disconnect();
    };
  }, []);

  const handleJoystickMove = (data) => {
    // console.log(data); check data attributes
    socket.current.emit('joystickData', {
      radial_distance: data.distance,
      direction: data.direction,
      x: data.x,
      y: data.y
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
      <div style={{ marginBottom: '20px' }}>
      <Joystick
        size={200}
        baseColor="#888"
        stickColor="#222"
        move={handleJoystickMove} // Use the move prop to handle joystick movement
        stop={() => handleJoystickMove({ x: 0, y: 0 })} // Use the stop prop to handle joystick stop
      />
      </div>
      <div>
        <h2>Received Data:</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <DataDisplay label="Radial Distance" value={receivedData.radial_distance} />
          <DataDisplay label="Direction" value={receivedData.direction} />
          <DataDisplay label="X" value={receivedData.x} />
          <DataDisplay label="Y" value={receivedData.y} />
        </div>
      </div>
    </div>
  );
};

export default JoystickComponent;
