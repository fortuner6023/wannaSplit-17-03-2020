const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;


const addressSchema = new mongoose.Schema({
    streetNumber: { type: String },
    streetName: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String }
});


const userSchema = new mongoose.Schema({
    name: { type: String },
    email: {
        type: String,
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, `Please fill valid email address`],
    },
    password: { type: String },
    role: { type: String, enum: ['User', 'Admin'] },
    isValid: { type: String },
    sessionToken: { type: String },
    lastlogin: { type: String },
    address: addressSchema,
    device_token: { type: String },
    mobile_number: { type: Number },
    otp: { type: Number },
    expiry_date: { type: String },
    profile_pic: { type: String, default: "" },
    rating: { type: Number },
    isLoggedIn: { type: Number, default: 0 },
    loc: {
        type: { type: String },
        coordinates: [Number]
    },

    gender: { type: String },
    DOB: { type: String },
    blood_group: { type: String },
    marital_status: { type: String },
    height: { type: String },
    weight: { type: String },
    emergency_contact: { type: String },
    socialId: { type: String },
    type: { type: String },
    loginType: { type: String },
    authToken: { type: String },
    intrests: { type: Array },
    favourite_split: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Splits' }],
    favourite_split_count: { type: Number },
    is_liked: { type: Boolean },
    gender: { type: String },
    DOB: { type: String },
    about_me: { type: String },
    username: { type: String },
}, { strict: false }, { timestamps: true });


userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model('User', userSchema);