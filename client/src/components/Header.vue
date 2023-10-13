<script setup>
const emit = defineEmits(['logOut'])
const props = defineProps({
    conStatus: Boolean
})
</script>
<template>
<div class="header">
    <img class="header__icon" src="src/assets/favicon.jfif" alt="img">
    <div>
        
        <span class="header__status" :style="{color: props.conStatus ? 'green' : 'red'}">{{ conStatus ? '' : 'Не в сети'}}</span>
    </div>
    <div>
        <el-dropdown>
        <el-button type="primary" style="height: 40px; margin-top: 10px; width: 40px; background: none; border: 2px solid white; font-size: 24px; box-shadow: 0px 0px 10px 1px aliceblue;">
            <el-icon><More/></el-icon>
        </el-button>
        <template #dropdown>
            <el-dropdown-menu>
            <el-dropdown-item @click="console.log('Доработка')">Сменить картинку</el-dropdown-item>
            <el-dropdown-item @click="emit('logOut')" divided>Выйти</el-dropdown-item>
            </el-dropdown-menu>
        </template>
        </el-dropdown>
    </div>
</div>
</template>
<style scoped lang="scss">
.header{
    position: fixed;
    display: flex;
    justify-content: space-between;
    font-size: 40px;
    background: #39f;
    width: 100%;
    padding: 0 20px;
    height: 60px;
    &__title{
        color: white;
        text-align: center;
        align-items: center;
        width: 150px;
        height: 100%;
        border-radius: 10px;
        -webkit-text-stroke: 1px black;
    }
    &__status{
        font-size: 40px;
        animation: pulse 1s infinite;
    }
    &__icon{
        height: 52px;
        margin-top: 4px;
        border-radius: 32px;
        box-shadow: 4px 4px 2px 0px darkslategrey;
    }
}
</style>