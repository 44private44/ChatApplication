const socket = io('http://localhost:8000');

const form = document.getElementById('sendContainer');
const messageInp = document.getElementById('messageInput');
const messageContainer = document.querySelector(".containerMessage");
var audio = new Audio('../images/ting.mp3');

const append = (message, position) => {
    const messageElement = document.createElement('div');
    // messageElement.innerText = message;
    messageElement.innerHTML = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') {
        audio.play();
    }
}

// ask a new user name for the add on chat and send to the server
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// new user join receive the event from the server 
socket.on('user-joined', data => {
    const user = `<strong>${data}</strong> joined the chat`;
    append(user, 'right');
    // append(`${data} joined the chat`, 'right'); // without bold 
});

// if the form get submitted send server the message    
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = messageInp.value;
    const user = `<strong>You: </strong> ${message}`;
    append(user, 'right');
    // append(`You: ${message}`, 'right');
    socket.emit('sendMessage', message);
    messageInp.value = '';
});

// if server send message that receive accept here 
socket.on('receive', data => {
    const user = `<strong>${data.name}: </strong> ${data.message}`;
    append(user, 'left');
    // append(`${data.name}: ${data.message}`, 'left');
});

// if user leave to the chat then appen to the container
socket.on('left', name => {
    const user = `<strong>${name}</strong> left the chat`;
    append(user, 'right');
    // append(`${name} left the chat`, 'right');
});

