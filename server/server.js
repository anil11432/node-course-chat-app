const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');

const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket) =>{
    console.log('connected to the client');

    socket.emit('newMessage',{
        from: 'admin',
        text: 'welcome to chat',
        createdat: new Date().getTime()
    });

    socket.broadcast.emit('newMessage', {
        from: 'admin',
        text: 'new user joined',
        createdat: new Date().getTime()
    });

    socket.on('createMessage', (message) =>{
        console.log('this is from client', message);

        io.emit('newMessage',{
            from: message.from,
            text: message.text,  
            createdon: new Date().getTime()
        });

        // socket.broadcast.emit('newMessage',{
        //     from: message.from,
        //     text: message.text,  
        //     createdon: new Date().getTime()
        // });
    });

    socket.on('disconnect', (socket) =>{
        console.log('disconnected from the client'); 
    });
});


server.listen(port, () => {
    console.log(`server is up on port ${port}`);
});