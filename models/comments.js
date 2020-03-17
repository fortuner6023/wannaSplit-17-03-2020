const mongoose = require('mongoose');


const commentsSchema = new mongoose.Schema({
    split_id: { type: mongoose.Schema.Types.ObjectId , ref:'Splits' },
    user_id: { type: mongoose.Schema.Types.ObjectId , ref:'User' },
    comments: { type: String },
    nested_comment_id:{ type: String },
    child_comment : {type:Object},
}
,
{timestamps: true}
);



module.exports = mongoose.model('Comments', commentsSchema);



