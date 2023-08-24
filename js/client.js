const socket = io('http://localhost:8000');

const form = document.getElementById('sendContainer');
const messageInp = document.getElementById('messageInput');
const messageContainer = document.querySelector(".containerMessage");
var audio = new Audio('../images/ting.mp3');

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') {
        audio.play();
    }
}

const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

socket.on('user-joined', data => {
    append(` ${data} joined the chat`, 'right');
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = messageInp.value;
    append(`You: ${message}`, 'right');
    socket.emit('sendMessage', message);
    messageInp.value = '';
});

socket.on('receive', data => {
    append(` ${data.name}: ${data.message}`, 'left');
});

socket.on('left', name => {
    append(`${name} left the chat`, 'left');
});

