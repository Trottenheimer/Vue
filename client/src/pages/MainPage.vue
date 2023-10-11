<script setup>
import { io } from 'socket.io-client';
import { ref, watch} from 'vue';
import cookie from 'vue-cookie'
import {ElNotification} from 'element-plus'
const SERVER_URL = 'http://192.168.1.91:3000'
const socket = io(SERVER_URL, {
  transports: ['websocket'],
  upgrade: { maxHttpBufferSize: 10000000 }
});

const messageLimit = ref(512);
const loginLimit = ref(32);
const chatEnd = ref(null);

let conStatus = ref(false);
let messageInput = ref('');
let messages = ref([]);
let logInStatus = ref(false);
let loginInput = ref('');
let dialogVisible = ref(false);
let vImage = ref();
let imageText = ref('');
let imageInput;

watch([messageInput, loginInput], async([msgVal, loginVal]) => {
  if (msgVal.length >= messageLimit.value){
    messageInput.value = msgVal.substring(0, messageLimit.value);
  }
  if (loginVal.length >= loginLimit.value)
    loginInput.value = loginVal.substring(0, loginLimit.value)
})
function convertImageToBase64(image) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(image);
  });
}
const logIn = () => {
  loginInput.value = loginInput.value.trim();
  if (loginInput.value.length >= 4 && loginInput.value.length <= 32 && loginInput.value !== ''){
    socket.emit('login', loginInput.value);
    logInStatus.value = true;
  }
  else{
    ElNotification({title: 'Ошибка', message: 'Введи ник нормально', type: 'error'});
  }
}
const sendMessage = () => {
  messageInput.value = messageInput.value.trim(); 
  if (imageInput)
    sendImage(imageInput, messageInput.value);
  else if (messageInput.value !== ' ' && messageInput.value !== '')
    socket.emit('message', messageInput.value);
  
  messageInput.value = ''
}
const handlePaste = async (event) => {
  const items = (event.clipboardData || event.originalEvent.clipboardData).items;
  for (const item of items) {
    if (item.type.indexOf("image") === 0) {
      const file = item.getAsFile();
      const fileSize = (file.size / (1024 * 1024)).toFixed(2);
      if (fileSize > 10){
        alert('Запрещено загружать файлы весом более 10 МБ');
      }
      else
        imageInput = file;
        let imageInput64 = await convertImageToBase64(imageInput);
        viewImage(imageInput64);
      break;
    }
  }
}
const selectImage = async (event) => {
  const fileSize = (event.target.files[0].size / (1024 * 1024)).toFixed(2);
  if (fileSize > 10) {
    alert('Запрещено загружать файлы весом более 10 МБ');
  }
  else
    imageInput = event.target.files[0];
    let imageInput64 = await convertImageToBase64(imageInput);
    viewImage(imageInput64);
}
const sendImage = (file, text) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const imageType = e.target.result.split(';')[0].split(':')[1]
        if (!imageType.startsWith('image/')){
          alert('Можно загружать только изображения');
          return 0;
        }
    let dataUrl = reader.result;
    socket.emit('image', dataUrl, text);
    imageInput = '';
    let input = document.querySelector('input[type="file"]')
    input.value = '';
  };
  reader.readAsDataURL(file);
  dialogVisible.value = false;
}
const viewImage = (image) => {
  vImage.value = image
  dialogVisible.value = true;
}
const scrollDown = () => {
  chatEnd.value?.scrollIntoView({behavior: 'smooth'});
}
const setMessageStyle = (user, type) => {
  if (user === loginInput.value)
    return {justifyContent: 'flex-end'}
  else if (type === 'announce')
    return {justifyContent: 'center'}
  else
    return '';
}

socket.on('connect', () => {
  console.log(`connection to ${SERVER_URL} established.`);
  conStatus.value = true;
  cookie.set('token', 'token');
  console.log(cookie.get('token'));
  socket.on('disconnect', () => {
    console.log('con close');
    conStatus.value = false;
    cookie.delete('token')
    window.location.reload();
  })
})
socket.on('message', message => {
  messages.value.push(message);
  console.log(message);
  scrollDown();
})
socket.on('history', messageHistory => {
  messages.value = [...messageHistory]
  chatEnd.value?.scrollIntoView({behavior: 'smooth'});
})
</script>
<template>
<div class="header">
    <span class="header__title">
        VOBLA
    </span>
<span class="header__status" :style="{color: conStatus ? 'green' : 'red'}">{{ conStatus ? 'онлайн' : 'отключен'}}</span>
</div>
<div class="chat" v-if="logInStatus">
<div class="chat__window">
    <div class="message" v-for="(message, index) in messages" :key="index" :style="setMessageStyle(message.user, message.type)">
    <div class="message__block" :style="{backgroundColor: message.user === loginInput ? '#227abb' : ''}">
        <template v-if="message.type === 'message' || message.type === 'image'">
        <div class="block__column">
            <span class="message__block__user">{{ message.user }}</span>
            <span class="message__block__data">{{ message.data }}</span>
            <template v-if="message.image">
            <img @click="viewImage(message.image)" class="message__block__image" :src="message.image" alt="image">
            </template>
        </div>
        <span class="message__block__date">{{message.date}}</span>
        </template>
        <template v-else-if="message.type === 'announce'">
        <div class="message__block__announce" style="margin: 0 auto">{{message.data}}</div>
        </template>
    </div>
    </div>
    <div class="chat__window__end" ref="chatEnd"/>
</div>

<div class="chat__bar">
    {{ messageInput.length }}/{{messageLimit}}
    <div class="chat__bar__input">
    <input type="text" @keydown.enter="sendMessage" @paste="handlePaste" v-model="messageInput">
    <el-icon class="icon__addImage" :size="24" @click="this.$refs.fileInput.click()"><Paperclip/></el-icon>
    <button class="my__button" @click="sendMessage">
        <el-icon :size="24">
        <Promotion/>
        </el-icon>
    </button>
    </div>
    <input class="input__image" type="file" @change="selectImage" ref="fileInput" placeholder="картинка">
    <div v-if="imageInput">
    <img src="" alt="">
    </div>
</div>

</div>

<div class="login" v-else>
<span>от 4 до 32 символов</span>
<input type="text" @keydown.enter="logIn" v-model="loginInput">
<button @click="logIn">Войти</button>
</div>



<el-dialog class="dialog__image" v-model="dialogVisible"
    @keyup.enter="sendImage(imageInput, imageText)" @closed="imageText = ''; imageInput = '';"
    >
    <div class="dialog__content">
    <img class="dialog__content__image" :src="vImage" alt="">
    </div>
    <div class="dialog__desc">
    <span>Подпись</span>
    <input class="dialog__desc__input" type="text" v-model="imageText">
    </div>
    <div class="control__panel">
    <button class="my__button" @click="dialogVisible = false;">Отмена</button>
    <button class="my__button" @click="sendImage(imageInput, imageText)">Отправить</button>
    </div>
</el-dialog>
</template>