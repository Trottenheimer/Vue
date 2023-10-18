<script setup>
import { io } from 'socket.io-client';
import { ref } from 'vue';
import cookie from 'vue-cookie';

//components
import Chat from '@/components/Chat.vue'
import Header from '@/components/Header.vue'
import Login from "@/components/Login.vue"
import SideBar from '@/components/SideBar.vue'
import UserList from '@/components/UserList.vue'

const SERVER_URL = 'http://192.168.1.91:3000'
const socket = io(SERVER_URL, {
  transports: ['websocket'],
  upgrade: { maxHttpBufferSize: 10000000 },
  auth: {token: cookie.get('id')}
});

let conStatus = ref(false);
let authStatus = ref(cookie.get('id') ? true: false);

const logOut = () => {
  cookie.delete('id');
  socket.disconnect();
}

socket.on('connect', () => {
  conStatus.value = true;
  console.log(`Соединение с сервером произошло успешно.`);
  socket.on('non auth', () => conStatus.value = false);
  socket.on('disconnect', () => {
    conStatus.value = false;
    window.location.reload();
  })
})
const test = () => {
  console.log('test');
}
</script>

<template>
<div class="layout">
  <Header :conStatus="conStatus" @logOut="logOut"/>
  <div class="main">
    <div class="content" v-if="authStatus">
      <SideBar/>
      <Chat v-model:socket="socket"/>
      <UserList :socket="socket" @test="test"/>
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
}.content{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100%;
  width: 100%;
}
</style>