const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (socket) => {
  // Handle socket connection
});

console.log('Server is running on port 8080');