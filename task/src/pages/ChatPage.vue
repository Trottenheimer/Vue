<template>
<div class="main">
    <div class="messenger">
        <div class="messenger__dialogs">
            <el-scrollbar class="scrollbar">
                <div v-for="item in 20" :key="item" class="dialog">
                    <div class="dialog__data">
                        <div class="dialog__name">Друг</div>
                        <div class="dialog__message">{{ item }}</div>
                    </div>
                    <div class="dialog__date">9:12</div>
                </div>
            </el-scrollbar>
        </div>
        <div class="messenger__chat">
            <el-scrollbar class="scrollbar">
                <div 
                    v-for="(message, index) in messages" :key="index" class="message"
                    :style="{justifyContent: thisUser.id === message.user_id ? 'flex-end' : ''}"
                    >
                    <div class="message__block" :style="{background: thisUser.id === message.user_id ? 'orange' : ''}">
                        <div class="message__text">{{message.text}}</div>
                        <div class="message__date">{{message.createdAt.slice(11,16)}}</div>
                    </div>
                </div>
            </el-scrollbar>
            <div class="chat__bar">
                <el-input v-model="inputMessage"></el-input>
                <el-button type="primary">Отправить</el-button>
            </div>
        </div>
    </div>
</div>
</template>

<script setup>
import { ref } from 'vue';
import {getData} from '@/components/globalFunctions'

const messages = ref([]);
const thisUser = ref({id: 1})
const inputMessage = ref('')

getData('http://localhost:3000/api/message', '').then(data =>{
    messages.value = data;
})
</script>

<style scoped lang="scss">
@import "@/assets/variables.scss";
.messenger{
    display: flex;
    width: 80%;
    margin: 20px auto;
    flex-direction: row;
    &__dialogs{
        display: flex;
        flex-direction: column;
        flex: 2;
        overflow: auto;
        background: #334;
        color: white;
    }
    &__chat{
        display: flex;
        flex-direction: column;
        flex: 8;
        overflow: auto;
        background: #223;
        border-left: 1px solid black;
        .chat__bar{
            display: flex;
            width: 100%;
            height: max-content;
            background: white;
            .el-button{
                border-radius: 0px;
            }
        }
    }
    .scrollbar{
        height: 100%;
        position: relative;
        .dialog{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            min-height: 60px;
            min-width: 10px;
            width: 100%;
            padding: 4px;
            border-bottom: 2px solid black;
            &__date{
                font-size: 12px;
            }
        }
        .dialog:hover{
            background: #445;
        }
        .message{
            display: flex;
            width: 100%;
            &__block{
                display: flex;
                flex-direction: column;
                border-radius: 4px;
                min-width: 40px;
                width: max-content;
                background: $success;
                margin: 10px;
                max-width: 50%;
            }
            &__date{
                display: flex;
                font-size: 12px;
                justify-content: flex-end;
                margin-right: 10px;
            }
            &__text{
                margin: 2px;
            }
        }
    }
}
.main{
    background: #445;
}
</style>