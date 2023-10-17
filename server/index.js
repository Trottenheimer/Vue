require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const models = require('./models/models');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const path = require('path');
const Server = require('socket.io');
const { setTimeout } = require('timers/promises');

const PORT = process.env.PORT || 3000;
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors:{origin: 'http://192.168.1.91:5173'},
  maxHttpBufferSize: 10000000
})

let messages = [];
let users = [];
let connections = [];
const sessions = new Map()

app
    .use(cors())
    .use(express.json())
    .use('/api', router)
    .use(express.static(path.resolve(__dirname)))

    .use(errorHandler);


app.get('/', (req, res) => {
    res.status(200).json({message: 'Server on'})
});

io.on('connection', socket => {
  connections.push(socket);
  console.log(`${socket.id} подключился. IP: ${socket.handshake.address}`);
  console.log(socket.handshake.auth.token);

  socket.on('history', () => {
    socket.emit('history', messages);
  })
  socket.on('login', (login, cb) => {
    const user = {id: socket.id, name: login, ip: socket.handshake.address}
    users.push(user);
    socket.username = user.name;
    socket.id = user.id;
    return cb(user);
  })
  socket.on('message', data => {
    let date = String(new Date()).slice(16,21);
    let message = {user: socket.username, data: data, date: date, id: socket.id, type: 'message'};
    messages.push(message);
    io.emit('message', message);
  })
  socket.on('image', (image, text) => {
    let date = String(new Date()).slice(16,21);
    let message = {user: socket.username, data: text, image: image, date: date, id: socket.id, type: 'image'}
    messages.push(message);
    io.emit('message', message)
  })
  socket.on('disconnect', () => {
    connections.splice(connections.indexOf(socket), 1);
    console.log(`${socket.id} отключился.`);
  })
})

const start = async() => {
    try {
        //await sequelize.authenticate();
        //await sequelize.sync();
        http.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (error) {
        console.log(error);
    }
}
start();