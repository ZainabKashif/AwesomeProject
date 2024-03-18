const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    sender_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LawyerProfile'
    },
    receiver_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LawyerProfile'
    },
    message:{
        type: String,
        required: true
    },
    timeStamp: {
        type: Date,
        default: Date.now
    },
},
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;