const mongoose = require('mongoose') ;

const messageSchema = new mongoose.Schema({

    sender:{
        type:String,
        required:true
    },
    receiver:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

const messageModel = mongoose.model('message',messageSchema) ;

module.exports = messageModel ;