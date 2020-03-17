const mongoose = require('mongoose');


const intrestsSchema = new mongoose.Schema({
    id: { type: Date, default: Date.now },
    label: { type: String }

}, { timestamps: true });



module.exports = mongoose.model('intrests', intrestsSchema);