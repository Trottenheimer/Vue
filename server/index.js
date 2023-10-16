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

const findSocketById = (sid) => {
  const index = users.findIndex(user => user.id == sid);
  console.log(users.length, ' количество сокетов');
  console.log(index === -1
    ? `сокет не найден... Создание...`
    : `${index} порядковый номер сокета в массиве`);
  return index;
}

io.on('connection', (socket) => {
  console.log(`${socket.id} connected. IP: ${socket.handshake.address}`);

  socket.on('login', data => {
    socket.username = data;
    console.log(`user '${data}' has authorized. IP: ${socket.handshake.address}`);
  })
  socket.on('auth', (id, cb) => {
    let sid = findSocketById(id);
    console.log(sid);
    if (sid !== -1){
      socket.id = users[sid].id
      console.log('Обнаружен предыдущий сокет');
    } else{
      users.push(socket);
      console.log('Создан новый сокет');
    }
    return cb(socket.id)
  })
  socket.on('history', () => {
    socket.emit('history', messages);
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
  socket.on('disconnect', ()=> {
    console.log(`${socket.id} disconnected.`);
    if (socket.username){
      let announce = {data: `Пользователь ${socket.username} покинул чат`, type: 'announce'};
      messages.push(announce);
      io.emit('message', announce);
    }
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