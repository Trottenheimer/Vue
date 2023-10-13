<script setup>

const props = defineProps({
    users: {required: true}
})
const emit = defineEmits(['test'])
</script>
<template>
    <div class="userList">
        <button class="my__button" @click="emit('test')">обновить</button>
        <div class="user" v-for="user in props.users">
            <el-icon><UserFilled/></el-icon>{{user}}
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
        text-align: center;
    }
}
</style>