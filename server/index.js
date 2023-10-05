require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const models = require('./models/models');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const path = require('path');
const Server = require('socket.io');

const PORT = process.env.PORT || 3000;
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors:{origin: 'http://192.168.1.91:5173'},
  maxHttpBufferSize: 10000000
})

let messages = [];

app
    .use(cors())
    .use(express.json())
    .use('/api', router)
    .use(express.static(path.resolve(__dirname)))

    .use(errorHandler);


app.get('/', (req, res) => {
    res.status(200).json({message: 'Server on'})
});

io.on('connection', (socket) => {
  console.log(`${socket.id} user connected.`);
  socket.emit('history', messages);

  socket.on('login', data => {
    socket.username = data;
    var address = socket.handshake.address;
    console.log(`user '${data}' has authorized. IP: ${address}`);
    let announce = {data: `Пользователь ${socket.username} присоединился к чату`, type: 'announce'};
    messages.push(announce);
    io.emit('message', announce);
  })
  socket.on('message', data => {
    let date = String(new Date()).slice(16,21);
    let message = {user: socket.username, data: data, date: date, type: 'message'};
    messages.push(message);
    io.emit('message', message);
  })
  socket.on('image', (image, text) => {
    let date = String(new Date()).slice(16,21);
    let message = {user: socket.username, data: text, image: image, date: date, type: 'image'}
    messages.push(message);
    io.emit('message', message)
  })

  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected.`);
    let announce = {data: `Пользователь ${socket.username} вышел из чата`, type: 'announce'};
    messages.push(announce);
    io.emit('message', announce);
  })
})
const start = async() => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        http.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (error) {
        console.log(error);
    }
}

start();