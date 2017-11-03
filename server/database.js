const mongoose = require('mongoose');
    mongoose.Promise = global.Promise;


        var Message = mongoose.model('Messages', {
            from: {
                type: 'string',
                required: true
            },
            text: {
                type: 'string',
                required: true
            },
            time: {
                type: 'date',
                default: new Date()
            }
        })

module.exports = Message;