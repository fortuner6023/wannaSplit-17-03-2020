const mongoose = require('mongoose');


const roomsSchema = new mongoose.Schema({

    user_id1: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    user_id2:{type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    
}
,
{timestamps: true}
);



module.exports = mongoose.model('Room', roomsSchema);