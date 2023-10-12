<script setup>
import { io } from 'socket.io-client';
import { ref} from 'vue';
import cookie from 'vue-cookie';

//components
import Chat from '@/components/Chat.vue'
import Header from '@/components/Header.vue'
import Login from "@/components/Login.vue"
import Side from '@/components/Side.vue'

const SERVER_URL = 'http://192.168.1.91:3000'
const socket = io(SERVER_URL, {
  transports: ['websocket'],
  upgrade: { maxHttpBufferSize: 10000000 }
});

let conStatus = ref(false);
let authStatus = ref(false);

const logOut = () => {
  cookie.delete('id');
  authStatus.value = false;
  socket.close();
}
socket.on('connect', () => {
  console.log(`connection to ${SERVER_URL} established.`);
  conStatus.value = true;
  if (cookie.get('id')){
    socket.emit('auth', cookie.get('id'))
    console.log('sent id: ', cookie.get('id'));
    authStatus.value = true;
    console.log('token acquired');
  }
  socket.on('auth', id => {
    cookie.set('id', id, '1d');
    console.log(id);
  })
  socket.on('disconnect', () => {
    conStatus.value = false;
    cookie.delete('id')
    console.log('connection lost');
    window.location.reload();
  })
})
</script>

<template>
<div class="layout">
  <Header :conStatus="conStatus" @logOut="logOut"/>
  <div class="main">
    <div class="content" v-if="authStatus">
      <Side/>
      <Chat v-model:socket="socket" @logOut="logOut" />
    </div>
    <Login v-else :socket="socket" v-model:status="authStatus"/>
  </div>
</div>
</template>

<style scoped lang="scss">
.layout{
  display: flex;
  flex-direction: column;
}
.main{
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  width: 100%;
  background: #242424;
  margin-top: 60px;
}

.content{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100%;
  width: 100%;
}
.side{
  height: 100%;
  width: 10%;
}
</style>