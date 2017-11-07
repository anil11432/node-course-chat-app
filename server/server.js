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

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

mongoose.connect('mongodb://anil:admin@ds151355.mlab.com:51355/multi-language-chat-app');

app.use(express.static(publicPath));

app.use(bodyParser.json());

app.post('/translate', (req, res) => {
    console.log(req.body);

    console.log(`to be translate from ${req.body.from} to ${req.body.to}`);
    translate(req.body.text, {from: req.body.from, to: req.body.to}).then(trans => {
        // console.log(res.text);
        // //=> Ik spreek Nederlands! 
        // console.log(res.from.text.autoCorrected);
        // //=> true 
        // console.log(res.from.text.value);
        // //=> I [speak] Dutch! 
        // console.log(res.from.text.didYouMean);
        //=> false
        // io.emit('translatedMessage',{
        //     original: message.text,
        //     translated: res.text,
        //     from: message.from,
        //     to: message.to,
        //     id : message.id
        // });
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





        // translate(message.text, {from: 'en', to: 'ca'}).then(res => {
        //     console.log(res.text);
        //     //=> Ik spreek Nederlands! 
        //     console.log(res.from.text.autoCorrected);
        //     //=> true 
        //     console.log(res.from.text.value);
        //     //=> I [speak] Dutch! 
        //     console.log(res.from.text.didYouMean);
        //     //=> false
        //     io.emit('newMessage',{
        //         from: message.from,
        //         trans: res.text,  
        //         createdon: new Date().getTime(),
        //         text: message.text
        //     }); 
        // }).catch(err => {
        //     console.error(err);
        // });


        // callback('this is from the server');

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