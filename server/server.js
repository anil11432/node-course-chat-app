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

    socket.on('disconnect', (socket) =>{
        console.log('disconnected from the client');
    });
});

server.listen(port, () => {
    console.log(`server is up on port ${port}`);
});