<script setup>
import { onMounted, ref } from 'vue';
import store from '@/store'
const emit = defineEmits(['test']);
const props = defineProps({
    socket: {required: true}
});
const socket = props.socket;

const users = ref([]);

const requestUsers = async() => {
  socket.emit('allUsers', cb => {
    if (cb.length > 0 && cb[0] !== null)
        users.value = cb;
  })
}
onMounted(() => {
    requestUsers()  
})
socket.on('user', data => {
    const index = users.value.findIndex(user => user.id === data.id)
    if (index > -1)
        users.value[index].name = data.name
    else
        users.value.push(data)
})
</script>
<template>
    <div class="userList" v-if="users.length > 0">
        <div class="user" v-for="user in users">
            <button class="my__button" :style="{color: user.name === store.state.user.name ? '#39f' : ''}">
                <el-icon size="20" class="user__icon"><UserFilled/></el-icon>
                <span class="user__name">{{user.name}}</span>
            </button>
        </div>
    </div>
</template>
<style scoped lang="scss">
.userList{
    display: flex;
    flex-direction: column;
    width: 10%;
    height: 100%;
    .user{
        display: flex;
        flex-direction: row;
        margin: 2px;
    }
}
</style>