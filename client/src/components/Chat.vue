<script setup>
import { ref, watch, nextTick, onMounted } from 'vue';
import cookie from 'vue-cookie';

const emit = defineEmits(['logOut']);
const props = defineProps({
    socket: {required: true},
    conStatus: Boolean
});
const socket = props.socket;
const messageLimit = ref(512);
const messageList = ref(null);

let messages = ref([]);
let dialogVisible = ref(false);
let vImage = ref(null);
let messageInput = ref('');
let imageText = ref('');
let imageInput = null;
let editMode = ref(false);
let bgNumber = 0;

watch(messageInput, async(msgVal) => {
    if (msgVal.length >= messageLimit.value){
    messageInput.value = msgVal.substring(0, messageLimit.value);
  }
})
const sendMessage = () => {
  messageInput.value = messageInput.value.trim(); 
  if (imageInput)
    sendImage(imageInput, messageInput.value);
  else if (messageInput.value !== ' ' && messageInput.value !== '')
    socket.emit('message', messageInput.value);
  messageInput.value = '';
}
function convertImageToBase64(image) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(image);
  });
}
const handlePaste = async (event) => {
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
        let imageInput64 = await convertImageToBase64(imageInput);
        viewImage(imageInput64);
        editMode.value = true;
      break;
    }
  }
}
const selectImage = async (event) => {
  const fileSize = (event.target.files[0].size / (1024 * 1024)).toFixed(2);
  if (fileSize > 10) {
    alert('Запрещено загружать файлы весом более 10 МБ');
  }
  else
    imageInput = event.target.files[0];
    let imageInput64 = await convertImageToBase64(imageInput);
    viewImage(imageInput64);
    editMode.value = true;
}
const sendImage = (file, text) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const imageType = e.target.result.split(';')[0].split(':')[1]
        if (!imageType.startsWith('image/')){
          alert('Можно загружать только изображения');
          return 0;
        }
    let dataUrl = reader.result;
    socket.emit('image', dataUrl, text);
    imageInput = '';
    let input = document.querySelector('input[type="file"]')
    input.value = '';
  };
  reader.readAsDataURL(file);
  dialogVisible.value = false;
}
const viewImage = (image) => {
  vImage.value = image
  dialogVisible.value = true;
}
const scrollDown = () => {
  const msgList = messageList.value;
  if (msgList?.scrollHeight)
    msgList.scrollTop = msgList.scrollHeight;
}
const setMessageStyle = (id, type) => {
  if (id === cookie.get('id'))
    return {justifyContent: 'flex-end'}
  else if (type === 'announce')
    return {justifyContent: 'center'}
  else
    return '';
}
const changeBackground = () => {
  bgNumber++;
  if (bgNumber === 2)
    bgNumber = 0;
}
const backgroundImage = () => {
  let bgStyle = `background-image: url('src/assets/backgrounds/bg${bgNumber}.png')`;
  console.log(bgStyle);
  return bgStyle;
}
const requestHistory = async () => {
  socket.emit('history', cb => {
    console.log(cb);
  });
}
socket.on('message', message => {
  if (!cookie.get('id'))
    socket.emit('logOut');
  messages.value.push(message);
  console.log(message);
  nextTick(() => {
    scrollDown();
  })
})
socket.on('history', messageHistory => {
  messages.value = messageHistory;
  nextTick(() => {
    scrollDown();
  })
})
onMounted(() => {
  requestHistory();
})
</script>

<template>
  <div style="height: 100%; width: 90%">
      <div class="chat">
          <div class="chat__window" ref="messageList">
              <div class="message" v-for="(message, index) in messages" :key="index" :style="setMessageStyle(message.id, message.type)">
              <div class="message__block" :style="{backgroundColor: message.id === cookie.get('id') ? '#227abb' : ''}">
                  <template v-if="message.type === 'message' || message.type === 'image'">
                  <div class="block__column">
                      <span class="message__block__user">{{ message.user }}</span>
                      <span class="message__block__data">{{ message.data }}</span>
                      <template v-if="message.image">
                      <img @click="viewImage(message.image)" class="message__block__image" :src="message.image" alt="image">
                      </template>
                  </div>
                  <template v-if="message.type === 'image'">
                      <span class="message__block__date__hidden">{{message.date}}</span>
                  </template>
                  <template v-else>
                      <span class="message__block__date">{{message.date}}</span>
                  </template>
                  </template>
                  <template v-else-if="message.type === 'announce'">
                  <div class="message__block__announce" style="margin: 0 auto">{{message.data}}</div>
                  </template>
              </div>
              </div>
          </div>
          <div class="chat__bar">
              {{ messageInput.length }}/{{messageLimit}}
              <div class="chat__bar__input">
              <input type="text" @keydown.enter="sendMessage" @paste="handlePaste" v-model="messageInput">
              <button class="my__button" @click="this.$refs.fileInput.click()">
                <el-icon :size="24" style="color: lightgray">
                  <Paperclip/>
                </el-icon>
              </button>
              <button class="my__button" @click="sendMessage">
                  <el-icon :size="24">
                    <Promotion/>
                  </el-icon>
              </button>
              </div>
              <input class="input__image" type="file" @change="selectImage" ref="fileInput" placeholder="картинка">
              <div v-if="imageInput">
              </div>
          </div>
      </div>
  </div>


  <el-dialog class="dialog__image" v-model="dialogVisible"
    @keyup.enter="sendImage(imageInput, imageText)" @closed="imageText = ''; imageInput = ''; editMode = false;"
    >
    <div class="dialog__content">
      <img class="dialog__content__image" :src="vImage" alt="">
    </div>
    <template v-if="editMode">
      <div class="dialog__desc">
        <span>Подпись</span>
        <input class="dialog__desc__input" type="text" v-model="imageText"/>
      </div>
      <div class="control__panel">
        <button class="my__button" @click="dialogVisible = false;">Отмена</button>
        <button class="my__button" @click="sendImage(imageInput, imageText)">Отправить</button>
      </div>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss">
.chat{
  display: flex;
  flex-direction: column;
  background: #353535;
  height: 100%;
  width: 10
  0%;
  padding: 0 10px;
  &__window{
    display: flex;
    flex-direction: column;
    background: #222;
    //background-image: url('@/assets/backgrounds/bg0.png');
    overflow-y: scroll;
    overflow-x: hidden;
    height: 100%;
    max-height: 100%;
    width: 100%;
    padding: 8px;
    transition: scroll-behavior 0.5s ease-in-out; 
  }
  &__bar{
    display: flex;
    flex-direction: column;
    &__input{
      display: flex;
      flex-direction: row;
      width: 100%;
    }
  }
}
.input__image{
  width: 30%;
  border: 2px solid gray;
  display: none;
}
.message{
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
    max-width: 80%;
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
      max-width: 100%;
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
      word-break: break-all;
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
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background-color: #39f;;
  border-radius: 4px;
}
</style>