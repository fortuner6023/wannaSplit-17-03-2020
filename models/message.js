const mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    text: {type: String},
    sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    receiver: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    senderName: {type: String},
    receiverName: {type: String},
    roomid: {type: mongoose.Schema.Types.ObjectId, ref: 'Room'},
    userImage: {type: String, default: 'defaultPic.png'},
    image: {type: String},

    isRead: {type: Boolean, default: false},
    type:{type: String},
}
,
{timestamps: true}
);

module.exports = mongoose.model('Message', messageSchema);