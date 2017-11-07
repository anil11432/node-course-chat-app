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
    jQuery.ajax({
        url: '/translate',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify({
            text: message.text,
            from: message.lang,
            to: jQuery('#lang').val(),
            id: message.id
        })
    }).done((res) => {
        console.log(res);
            var li = jQuery('<li></li>');
            li.text(`${res.text}`);
            jQuery('#messages').append(li);
            console.log(conn);
    });
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