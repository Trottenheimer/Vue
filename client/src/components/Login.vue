<template>
  <div class="login">
      <span>до 32 символов</span>
      <div class="login__input">
        <input type="text" @keydown.enter="logIn" v-model="loginInput" autofocus>
        <button class="my__button" @click="logIn"><el-icon><Check/></el-icon></button>
      </div>
  </div>
</template>

<script setup>
import { ElNotification } from 'element-plus';
import { ref, watch } from 'vue';
import store from '@/store'
import cookie from 'vue-cookie';

const emit = defineEmits(['update:status'])
const props = defineProps({
    socket: {required: true}
})
const socket = props.socket;
const loginLimit = ref(32);

const loginInput = ref('');

watch([loginInput], async([loginVal]) => {
  if (loginVal.length >= loginLimit.value)
    loginInput.value = loginVal.substring(0, loginLimit.value)
})

const logIn = () => {
  loginInput.value = loginInput.value.trim();
  if (loginInput.value.length <= 32){
    socket.emit('login', loginInput.value, cb => {
      store.commit('SET_USERDATA', cb);
      console.log(store.state.user);
      emit('update:status', true);
    });
  }
  else{
    ElNotification({title: 'Ошибка', message: 'Слишком длинный ник', type: 'warning'});
  }
}
</script>

<style scoped lang="scss">
.login{
    display: flex;
    flex-direction: column;
    margin: auto;
    width: 50%;
    input{
      font-size: 24px;
    }
    &__input{
      display: flex;
      flex-direction: row;
      animation: pulse 5s infinite;
      button{
        font-weight: bold;
      }
    }
  }
</style>