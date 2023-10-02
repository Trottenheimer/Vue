<template>
<div class="main">
    <div class="messenger">
        <div class="messenger__dialogs">
            <el-scrollbar class="scrollbar">
                <div v-for="(dialog, index) in dialogs" :key="index" class="dialog" @click="selectDialog(dialog.id)">
                    <div class="dialog__data">
                        <div class="dialog__name">{{ dialog.name }}</div>
                        <div class="dialog__user" v-if="dialog.username">{{ dialog.username }}</div>
                        <div class="dialog__message" v-if="dialog.lastMessage">{{ dialog.lastMessage.text }}</div>
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
                    <div class="message__block" :style="{background: thisUser.id === message.user_id ? '#306BCC' : ''}">
                        <div class="message__user" :style="{color: thisUser.id === message.user_id ? 'white' : ''}">{{message.username}}</div>
                        <div class="message__text">{{message.text}}</div>
                        <div class="message__date">{{message.createdAt.slice(11,16)}}</div>
                    </div>
                </div>
            </el-scrollbar>
            <div class="chat__bar">
                <el-input v-model="inputMessage" @keyup.enter="sendMessage"></el-input>
                <el-button type="primary" @click="sendMessage">Отправить</el-button>
            </div>
        </div>
    </div>
</div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getData, postData } from '@/components/globalFunctions'
import { ElLoading } from 'element-plus';

const messages = ref([]);
const dialogs = ref([]);
const thisUser = ref({id: 1});
const inputMessage = ref('');
const selectedChat = ref();

const prepareComponent = async () => {
        let loading = ElLoading.service({
        lock: true, text: 'Загрузка',
        background: 'rgba(0, 0, 0, 0.7)'
    });
    const promises = [
        getData('http://localhost:3000/api/chat', '').then(data =>{
            dialogs.value = data;
            dialogs.value.forEach(dialog => {
                getData('http://localhost:3000/api/user/', dialog.lastMessage.user_id).then(data => {
                    if (data && data.login)
                        dialog.username = data.login;
                })
            });
        })
    ]
    Promise.all(promises).then(() => {
        
        loading.close();
    }).catch(e => {
        console.error(e);
    })
};
const selectDialog = async(chatId) => {
    getData('http://localhost:3000/api/message/', chatId).then(data => {
        messages.value = data;
        messages.value.forEach(msg => {
            getData('http://localhost:3000/api/user/', msg.user_id).then(data => {
                if (data && data.login) 
                    msg.username = data.login;
            });
        });
    });
    selectedChat.value = chatId;
};
const sendMessage = async() => {
    postData('http://localhost:3000/api/message/create', '',
        {"user": thisUser.value.id, "chat": selectedChat.value, "text": inputMessage.value})
        .then(res => {
            console.log(res);
        selectDialog(selectedChat.value)
    });
}
onMounted(() => {
    prepareComponent();
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
        background: #111;
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
                border-radius: 8px;
                min-width: 120px;
                width: max-content;
                background: #445;
                margin: 10px;
                max-width: 50%;
                padding: 0.2em;
            }
            &__date{
                display: flex;
                font-size: 12px;
                justify-content: flex-end;
                color: lightgray;
            }
            &__text{
                color: white;
            }
            &__user{
                font-size: 14px;
                color: $main;
            }
        }
    }
}
.main{
    background: #223;
}
</style>