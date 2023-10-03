require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const models = require('./models/models');
const cors = require('cors');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const path = require('path');
const WebSocket = require('ws');

const PORT = process.env.PORT || 3000;
const server = new WebSocket.Server({ port: 4000 });

const app = express();
app
    .use(cors())
    .use(express.json())
    .use('/api', router)
    .use(express.static(path.resolve(__dirname)))

    .use(errorHandler);

app.get('/', (req, res) => {
    res.status(200).json({message: 'Server on'})
});

const start = async() => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (error) {
        console.log(error);
    }
}

const startWebSocket = async() => {
    console.log('websocket started on 4000 port');
    let username = [];
    server.on('connection', ws => {
        console.log('client connected.');
        ws.on('message', message => {
          if (message === 'exit') {
            console.log('client disconnected');
            ws.close();
          }
          else if (~message.indexOf("nicknames:")) {
            if (username.map(user => { return user === message})){
                username.push(message);
                console.log('NICK:', username);
            }
            else
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
}
start();
startWebSocket();