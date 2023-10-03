const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 3000 });

server.on('connection', ws => {
  console.log('client connected.');
  server.clients.forEach(client => {
    client.send('123')
  })
  ws.on('message', message => {
    if (message === 'exit') {
      console.log('client disconnected');
      ws.close();
    }
    else{
      server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN){
          client.send(message);
        }
      });
    };
  });
});