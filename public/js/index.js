var socket = io();

var conn;

socket.on('connect', function() {
    console.log('connected to server');
    conn = Math.floor(Math.random() * 1000);
});

socket.on('disconnect', function() {
    console.log('disconnected from server');
}); 

socket.on('newMessage', function(message){
    console.log('new message', message);
    socket.emit('translate', {
        text: message.text,
        from: message.lang,
        to: jQuery('#lang').val(),
        id : conn
    });
    // var li = jQuery('<li></li>');
    // li.text(`${message.from}: ${message.text} : ${message.trans}`);
    // jQuery('#messages').append(li);
});

socket.on('translatedMessage', function(message) {
    console.log('translated message' + message.translated);
    console.log(message.conn);
    if (message.id == conn) {
        var li = jQuery('<li></li>');
        li.text(`${message.translated}`);
        jQuery('#messages').append(li);
        console.log(conn);
    }
    // else{
    //     var li = jQuery('<li></li>');
    //     li.text(`${message.original}`);
    //     jQuery('#messages').append(li);
    // } 
    ;
    
});

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();

    socket.emit('createMessage', {
        from : 'user',
        text: jQuery('[name=message]').val(),
        lang: jQuery('#lang').val(),
        id : conn
    }, function(){

    });
});


