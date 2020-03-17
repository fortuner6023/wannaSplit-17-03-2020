const mongoose = require('mongoose');


const splitsSchema = new mongoose.Schema({

    title: { type: String },
    description: { type: String },
    loc: {
        type: { type: String },
        coordinates: [Number]
    },
    radius: { type: Number },
    tags: { type: Array },
    time: { type: Number },
    price: { type: Number },
    splitters: { type: Number },
    invite: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    user_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likes_count: { type: Number },
    is_favourite_split: { type: Boolean },
    is_completed_split: { type: Boolean },
    image: { type: String },
    is_active: { type: Number },
    expiry_date: { type: Date },
}, { timestamps: true });



module.exports = mongoose.model('Splits', splitsSchema);