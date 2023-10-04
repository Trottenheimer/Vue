<script setup>
import { io } from 'socket.io-client';
import { ref, watch } from 'vue';
const SERVER_URL = 'http://192.168.1.91:3000'
const socket = io(SERVER_URL);

const messageLimit = ref(512);
const chatEnd = ref(null);

let conStatus = ref(false);
let messageInput = ref('');
let messages = ref([]);
let logInStatus = ref(false);
let loginInput = ref('');

watch(messageInput, async(val) => {
  if (val.length >= messageLimit.value){
    messageInput.value = val.substring(0, messageLimit.value);
  }
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
  if (messageInput.value !== ' ' && messageInput.value !== '')
    socket.emit('message', messageInput.value);
  messageInput.value = '';
}
const scrollDown = () => {
  chatEnd.value?.scrollIntoView({behavior: 'smooth'})
}

socket.on('connect', () => {
  console.log(`connection to ${SERVER_URL} established.`);
  conStatus.value = true;
  socket.on('disconnect', () => {
    console.log('con close');
    conStatus.value = false;
  })
})
socket.on('message', message => {
  messages.value.push(message);
  scrollDown();
})
socket.on('history', messageHistory => {
  messages.value = [...messageHistory]
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
      <div class="message" v-for="(message, index) in messages" :key="index" :style="{justifyContent: loginInput == message.user ? 'flex-end': ''}">
        <div class="message__block">
          <template v-if="message.type === 'message'">

            <template v-if="message.user === loginInput">
              <span class="message__block__user">Вы</span>
            </template>
            <template v-else>
              <span class="message__block__user">{{ message.user }}</span>
            </template>
            <span class="message__block__data">{{ message.data }}</span>
            <span class="message__block__date">{{message.date}}</span>
          </template>

          <template v-else-if="message.type === 'announce'">
            <div class="message__block__announce">{{message.data}}</div>
          </template>
        </div>
      </div>
      <div class="chat__window__end" ref="chatEnd"/>
    </div>

    <div class="chat__bar">
      {{ messageInput.length }}/{{messageLimit}}
      <div class="chat__bar__input">
        <input type="text" @keydown.enter="sendMessage" v-model="messageInput">
      <button @click="sendMessage">Отправить</button>
      </div>
    </div>
  </div>

  <div class="login" v-else>
    <span>от 4 до 32 символов</span>
    <input type="text" @keydown.enter="logIn" v-model="loginInput">
    <button @click="logIn">Войти</button>
  </div>
</div>
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
    height: 100%;
    max-height: 100%;
    width: 98%;
    margin: auto;
    padding: 10px;

    &__end{
      margin-top: 20px;
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

  animation-name: pulse;
  animation-duration: 2s;
  animation-iteration-count: infinite;

  &:focus{
    outline: none;
    border: 1px solid black;
  }
}
.header{
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
}
.message{
  display: flex;
  justify-content: flex-start;
  width: 100%;
  margin: 4px;
  &__block{
    display: flex;
    flex-direction: column;
    min-width: 60px;
    width: max-content;
    height: max-content;
    background: #343434;
    &__user{
      font-size: 12px;
      color: #FAFAFA;
    }
    &__data{
      display: flex;
      font-size: 16px;
      margin-left: 4px;
      margin-top: 2px;
    }
    &__date{
      font-size: 10px;
      text-align: end;
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