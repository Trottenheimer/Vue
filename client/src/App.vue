<script setup>
import { io } from 'socket.io-client';
import { ref, watch } from 'vue';
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
let imageInput;

watch([messageInput, loginInput], async([msgVal, loginVal]) => {
  if (msgVal.length >= messageLimit.value){
    messageInput.value = msgVal.substring(0, messageLimit.value);
  }
  if (loginVal.length >= loginLimit.value)
    loginInput.value = loginVal.substring(0, loginLimit.value)
})
const logIn = () => {
  loginInput.value = loginInput.value.trim();
  if (loginInput.value.length >= 4 && loginInput.value.length <= 32 && loginInput.value !== ''){
    socket.emit('login', loginInput.value);
    logInStatus.value = true;
  }
  else{
    alert('Некорректно веден ник  ')
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
const selectImage = (event) => {
  const fileSize = (event.target.files[0].size / (1024 * 1024)).toFixed(2);
  if (fileSize > 10) {
    alert('Запрещено загружать файлы весом более 10 МБ');
  }
  else
    imageInput = event.target.files[0];
} 
const handlePaste = (event) => {
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
      break;
    }
  }
}
const sendImage = (file, text) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const imageType = e.target.result.split(';')[0].split(':')[1]
        if (!imageType.startsWith('image/')){
          alert('Можно загружать только изображения');
          return 0;
        }
    const dataUrl = reader.result;
    socket.emit('image', dataUrl, text);
    imageInput = '';
    const input = document.querySelector('input[type="file"]')
    input.value = '';
  };
  reader.readAsDataURL(file);
}
const viewImage = (image) => {
  dialogVisible.value = true;
  vImage.value = image
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
  socket.on('disconnect', () => {
    console.log('con close');
    conStatus.value = false;
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
<div class="main">
  <div class="header">
    <span class="header__title">VOBLA</span>
    <span class="header__status" :style="{color: conStatus ? 'green' : 'red'}">{{ conStatus ? 'онлайн' : 'отключен'}}</span>
  </div>
  <div class="chat" v-if="logInStatus">
    <div class="chat__window">
      <div class="message" v-for="(message, index) in messages" :key="index" :style="setMessageStyle(message.user, message.type)">
        <div class="message__block" :style="{backgroundColor: message.type == 'message' && message.user === loginInput ? '#3377ff' : ''}">
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
        <button @click="sendMessage">Отправить</button>
      </div>
      <input class="input__image" type="file" @change="selectImage" placeholder="картинка">
    </div>
  </div>

  <div class="login" v-else>
    <span>от 4 до 32 символов</span>
    <input type="text" @keydown.enter="logIn" v-model="loginInput">
    <button @click="logIn">Войти</button>
  </div>
</div>
<el-dialog class="dialog__image" v-model="dialogVisible">
  <div class="dialog__content">
    <img class="dialog__content__image" :src="vImage" alt="">
  </div>
</el-dialog>
</template>

<style scoped lang="scss">
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.main{
  display: flex;
  flex-direction: column;
  height: 90vh;
  max-height: 98vh;
  width: 100%;
}
.chat{
  display: flex;
  flex-direction: column;
  background: #353535;
  height: 100%;
  width: 100%;

  &__window{
    display: flex;
    flex-direction: column;
    background: #242424;
    overflow-y: scroll;
    overflow-x: hidden;
    height: 100%;
    max-height: 100%;
    width: 98%;
    margin: auto;
    padding: 10px;

    &__end{
      margin-top: 48px;
    }
  }
  &__bar{
    display: flex;
    flex-direction: column;
    margin-top: 100px;
    &__input{  
      display: flex;
      flex-direction: row;
      width: 100%;
    }
  }
}
.login{
  display: flex;
  flex-direction: column;
  margin: auto;
  width: 50%;
  button{
    margin: 20px auto;
    font-size: 24px;
    width: max-content;
  }
  input{
    animation-name: pulse;
    animation-duration: 2s;
    animation-iteration-count: infinite;
  }
}
input{
  width: 100%;
  min-height: 32px;
  overflow-wrap: break-word;
  border: green;
  color: white;
  font-weight: bold;
  font-size: 20px;
  border: 1px solid #242424;
  border-radius: 4px;

  &:focus{
    outline: none;
    border: 1px solid black;
  }
}
.input__image{
  width: 30%;
  border: 2px solid gray;
}
.header{
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  display: flex;
  font-size: 40px;
  background: #464646;
  &__title{
    will-change:auto;
    transition: 0.1s linear;
    width: 150px;
    height: 50px;
    &:hover{
      font-size: 44px;
      cursor: pointer;
      transition: 0.1s linear;
    }
  }
}.message{
  display: flex;
  justify-content: flex-start;
  width: 100%;
  height: max-content;
  margin: 4px;
  &__block{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    min-width: 60px;
    width: max-content;
    height: max-content;
    max-width: 800px;
    max-height: 800px;
    image-rendering: optimizeSpeed;
    border-radius: 12px;
    background: #363636;
    padding: 4px;
    .block__column{
      display: flex;
      flex-direction: column;
      width: max-content;
      height: max-content;
      margin: 0 10px 0 4px;
    }
    &__user{
      font-size: 12px;
      color: #cecece;
    }
    &__data{
      display: flex;
      font-size: 16px;
      width: max-content;
      max-width: 100%;
    }
    &__date{
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      width: 100%;
      font-size: 10px;
      color: lightgray;
      max-width: 30px;
    }
    &__image{
      width: auto;
      height: auto;
      margin: 10px;
      max-width: 360px;
      max-height: 360px;
    }
    &__announce{
      display: flex;
      justify-content: center;
      font-weight: bold;
      margin: 0 auto;
      border-bottom: 1px solid #464646;
      background: none;
      width: max-content;
      color: #696969;
    }
  }
}
.dialog__content{
  display: flex;
}
.dialog__image{
  display: flex;
  justify-content: center;;
  background: #242424;
}

@keyframes pulse {
  0%{
    filter: drop-shadow(0.1rem 0.1rem 0.1rem green);
  }
  50%{
    filter: drop-shadow(0.1rem 0.1rem 0.5rem green);
  }
  100%{
    filter: drop-shadow(0.1rem 0.1rem 0.1rem green);
  }
}
</style>