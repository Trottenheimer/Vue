const statuse = document.getElementById('status');
const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');

const ws = new WebSocket('ws://192.168.1.91:4000');

let checkUsername = false;
let username;
while (checkUsername === false){
  username = prompt('Введите имя(1-64 симв)', '').replace(/\s/g, "_");;
  if (username.length >= 1 && username.length <= 64){
    checkUsername = true;
  }
}

function setStatus(value){
  statuse.innerHTML = value;
}
function printMessage(user, value){
  const li = document.createElement('li');

  li.innerHTML = user.bold() + value;
  messages.appendChild(li)
}

form.addEventListener('submit', event => {
  event.preventDefault();

  if (input.value.trim())
    ws.send(input.value.trim());
    ws.send('nicknames:' + username)
  input.value = '';
})

ws.onopen = () => setStatus('ONLINE');

ws.onclose = () => {
  setStatus('OFFLINE');
  alert('Вы были отключены по причине:')
}

ws.onmessage = response => response.data.text().then(function(text){
  console.log(response);
  printMessage(username + ":", text);
});