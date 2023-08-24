const io = require('socket.io')(8000, {
    cors: {
        origin: 'http://127.0.0.1:5500', // or '*' to allow all origins
        methods: ['GET', 'POST'],
    },
});

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
        // io.emit('user-joined', name); // if we want to display the user also joined 
    });

    socket.on('sendMessage', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });

});
