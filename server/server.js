const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
    mongoose.Promise = global.Promise;
const publicPath = path.join(__dirname, '../public');

const translate = require('google-translate-api');

const port = process.env.PORT || 27017;
const mongo_uri = process.env.MONGO_URI || 'mongodb://localhost:27017/messages';

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

mongoose.connect(mongo_uri);

app.use(express.static(publicPath));

app.use(bodyParser.json());

app.post('/translate', (req, res) => {
    console.log(req.body);

    console.log(`to be translate from ${req.body.from} to ${req.body.to}`);
    translate(req.body.text, {from: req.body.from, to: req.body.to}).then(trans => {
        res.send(trans);
    }).catch(err => {
        console.error(err);
    });

});



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
            text: message.text,
            lang: message.lang,
        });

        messageContent.save().then((doc) => {
            console.log('saved data',doc);
        }, (e) =>{
            console.log('unable to save  data');
        });

        io.emit('newMessage',{
            from: message.from,
            lang: message.lang,  
            createdon: new Date().getTime(),
            text: message.text,
            id : message.id
        });
    });

    

    socket.on('disconnect', (socket) =>{
        console.log('disconnected from the client'); 
    });
});


server.listen(port, () => {
    console.log(`server is up on port ${port}`);
});