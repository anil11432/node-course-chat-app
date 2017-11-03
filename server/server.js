const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
    mongoose.Promise = global.Promise;
const publicPath = path.join(__dirname, '../public');

const port = process.env.PORT || 27017;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

mongoose.connect('mongodb://localhost:27017/chat-app');

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

    socket.on('createMessage', (message, callback) =>{
        console.log('this is from client', message);

        var msg = require('./database.js');

        let messageContent = new msg({
            from: message.from,
            text: message.text
        });

        messageContent.save().then((doc) => {
            console.log('saved data',doc);
        }, (e) =>{
            console.log('unable to save  data');
        });


        io.emit('newMessage',{
            from: message.from,
            text: message.text,  
            createdon: new Date().getTime()
        });

        callback('this is from the server');

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