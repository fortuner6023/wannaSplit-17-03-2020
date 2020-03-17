const _ = require('underscore');

require('dotenv').config();


//Internal Files and packages
const User = require('./../models/user');
let date = require("date-and-time");
const commonFunctions = require('./../commonFunctions.js');
const Message = require('./../models/message');
const Room = require('./../models/rooms');
const response = require('./../responses.js');
var nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;



var transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: true,
    //requireTLS: true,
    auth: {
        user: 'alohadev14@gmail.com',
        pass: 'Accessgranted'
    }
});


module.exports = {
    signup,
    verify_otp,
    send_otp,
    forgot_password,
    update_password,
    logout,
    profile,
    updateUser,
    updateUser_v2,
    signup_v2,
    fetch_chat,
    fetch_chatlist,
    remove_session
};


async function checkUniquId(uniqueId) {
    let idFound = await Order.findOne({ receipt: uniqueId });
    if (!idFound) return true;
    return false;
}

function createUniqueId(name) {
    var text = name
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456790abcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < 2; i++) {
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return text;
}



async function getReceiptNumber(name) {

    do {
        var value = createUniqueId(name)

        return value;
    } while (checkUniquId(createUniqueId))

}


//User Signup function
function signup_v2(file, body) {
    return new Promise(function(resolve, reject) {
        var otp_data = _.random(1000, 9999).toString();
        var username;
        var name = "ws_" + body.name
        console.log('name', name)
        var userName = getReceiptNumber(name)
        userName.then(function(result) {
            username = result
                // var otp_data = 1234;
            var now = new Date();
            var expiry_date = date.addMinutes(now, 30);
            var newBody = _.pick(body, 'name', 'role', 'email', 'password', 'confirm_password', 'device_token', 'mobile_number', 'gender', 'DOB');
            newBody.isValid = "false";
            newBody.otp = otp_data;
            newBody.expiry_date = expiry_date;
            newBody.username = username
            newBody.loc = { type: "Point", coordinates: [body.longitude, body.latitude] }
            if (file != undefined) {
                var image = process.env.SERVER_URL + file.filename;
                newBody.profile_pic = image
            }
            console.log('newBody', newBody);
            const newUser = new User(newBody);
            newUser.save(function(err, inserted) {
                if (err) {
                    return reject(response.ERROR);
                }
                if (inserted) {
                    //this is working code currently it is commented but it will come in to picture this code is to send emails

                    const mailOptions = {
                        from: 'alohadev14@gmail.com', // sender address
                        to: inserted.email, // list of receivers
                        subject: 'Verify Email Otp', // Subject line
                        html: "<p>Dear " + inserted.name + " your otp is " + otp_data + ",</p> Otp is valid for 30 minutes only.</p>"
                    };

                    transporter.sendMail(mailOptions).then(function(emailSent) {
                        console.log('email', emailSent)
                        var json_response = response.SIGNUP_SUCCESS
                        json_response.data = inserted.email,
                            json_response.otp = inserted.otp
                        return resolve(json_response);
                    }, function(error) {
                        console.log('error', error)
                        return reject(commonFunctions.sendErrorResponse(response.ERROR_SENDING_EMAIL));
                    }).catch(function(e) {
                        return reject(commonFunctions.sendErrorResponse(response.ERROR_SENDING_EMAIL));
                    });
                } else {

                    return reject(commonFunctions.sendErrorResponse(response.INETRNAL_SERVER_ERROR));
                }

            });
        })
    })
}

//User Signup function
function signup(body) {
    return new Promise(function(resolve, reject) {
        var otp_data = _.random(1000, 9999).toString();
        // var otp_data = 1234;
        var username;
        var name = "ws_" + body.name
        console.log('name', name)
        var userName = getReceiptNumber(name)
        userName.then(function(result) {
            username = result
            var now = new Date();
            var expiry_date = date.addMinutes(now, 30);
            var newBody = _.pick(body, 'name', 'role', 'email', 'password', 'confirm_password', 'device_token', 'mobile_number', 'gender', 'DOB');
            newBody.isValid = "false";
            newBody.otp = otp_data;
            newBody.expiry_date = expiry_date;
            newBody.username = username
            newBody.loc = { type: "Point", coordinates: [body.longitude, body.latitude] }
            console.log('newBody', newBody);
            const newUser = new User(newBody);
            newUser.save(function(err, inserted) {
                if (err) {
                    return reject(response.ERROR);
                }
                if (inserted) {
                    //this is working code currently it is commented but it will come in to picture this code is to send emails

                    const mailOptions = {
                        from: 'alohadev14@gmail.com', // sender address
                        to: inserted.email, // list of receivers
                        subject: 'Verify Email Otp', // Subject line
                        html: "<p>Dear " + inserted.name + " your otp is " + otp_data + ",</p> Otp is valid for 30 minutes only.</p>"
                    };

                    transporter.sendMail(mailOptions).then(function(emailSent) {
                        console.log('email', emailSent)
                        var json_response = response.SIGNUP_SUCCESS
                        json_response.data = inserted.email,
                            json_response.otp = inserted.otp
                        return resolve(json_response);
                    }, function(error) {
                        console.log('error', error)
                        return reject(commonFunctions.sendErrorResponse(response.ERROR_SENDING_EMAIL));
                    }).catch(function(e) {
                        return reject(commonFunctions.sendErrorResponse(response.ERROR_SENDING_EMAIL));
                    });
                } else {

                    return reject(commonFunctions.sendErrorResponse(response.INETRNAL_SERVER_ERROR));
                }

            });
        });
    })
}

function verify_otp(body) {
    return new Promise(function(resolve, reject) {
        var newBody = _.pick(body, 'email', 'otp', );
        var otp = newBody.otp
        var email = newBody.email
        User.findOne({ email: newBody.email }, (err, result) => {
            if (err) {
                return reject(response.ERROR);
            } else if (result) {

                var otp1 = result.otp;
                if (otp == otp1) {
                    var xdate = new Date(result.expiry_date);
                    console.log(xdate);
                    var cdate = new Date();
                    console.log(cdate);
                    if (xdate >= cdate) {
                        console.log("valid");
                        User.findOneAndUpdate({ email: email }, { $set: { otp: result.otp, isValid: true } }, { new: true })
                            .exec()
                            .then(function(result) {
                                if (result) {


                                    return resolve(response.VALID_OTP);
                                }
                            });
                    } else {
                        console.log("expired");

                        return reject(response.EXPIRED_OTP);
                    }
                } else {

                    return reject(response.OTP_NOT_MATCH);
                }

            } else {
                return reject(response.NOT_REGISTERED);
            }
        });

    });
}

// function verify_otp(body) {
//     return new Promise(function(resolve, reject) {
//         var newBody = _.pick(body, 'email', 'otp', 'password');
//         var otp = newBody.otp
//         var email = newBody.email
//         var password = newBody.password
//         User.findOne({ email: newBody.email }, (err, result) => {
//             if (err) {
//                 return reject(response.ERROR);
//             } else if (result) {

//                 var otp1 = result.otp;
//                 var password1 = result.password
//                 if (otp == otp1) {
//                     var xdate = new Date(result.expiry_date);
//                     console.log(xdate);
//                     var cdate = new Date();
//                     console.log(cdate);
//                     if (xdate >= cdate) {
//                         console.log("valid");
//                         User.findOneAndUpdate({ email: email }, { $set: { otp: result.otp, isValid: true } }, { new: true })
//                             .exec()
//                             .then(function(result) {
//                                 if (result) {

//                                     console.log('Result==>', result)
//                                     return resolve(response.VALID_OTP);
//                                 }
//                             });
//                     } else {
//                         console.log("expired");

//                         return reject(response.EXPIRED_OTP);
//                     }
//                 } else {

//                     return reject(response.OTP_NOT_MATCH);
//                 }

//             } else {
//                 return reject(response.NOT_REGISTERED);
//             }
//         });

//     });
// }





function send_otp(body) {
    return new Promise(function(resolve, reject) {
        var newBody = _.pick(body, 'email');

        var otp_data = _.random(1000, 9999).toString();
        // var otp_data = 1234;
        var now = new Date();
        var expiry_date = date.addMinutes(now, 30);
        User.findOne({ email: newBody.email }, (err, foundUser) => {
            if (err) {
                return reject(response.ERROR);
            } else if (foundUser) {


                User.findOneAndUpdate({ email: newBody.email }, { $set: { otp: otp_data, expiry_date: expiry_date } }, { new: true })
                    .exec()
                    .then(function(resetToken) {
                        //this is working code currently it is commented but it will come in to picture this code is to send emails
                        const mailOptions = {
                            from: 'alohadev14@gmail.com', // sender address
                            to: resetToken.email, // list of receivers
                            subject: 'Verify Email Otp', // Subject line
                            html: "<p>Dear " + resetToken.name + " your otp is " + otp_data + ",</p> Otp is valid for 30 minutes only.</p>"
                        };
                        transporter.sendMail(mailOptions).then(function(emailSent) {

                            var data = {
                                'otp': otp_data,
                                'email': foundUser.email
                            };
                            return resolve(commonFunctions.sendSuccessResponse(data));
                        }, function(error) {
                            return reject(commonFunctions.sendErrorResponse(response.ERROR_IN_MANDRILL));
                        }).catch(function(e) {
                            return reject(commonFunctions.sendErrorResponse(response.ERROR_IN_MANDRILL));
                        });
                        //ends

                    }, function(error) {
                        console.log('error', error)
                        return reject(response.ERROR_IN_PASSWORD_RESET_TOKEN);
                    }).catch(function(e) {
                        console.log('error', e)
                        return reject(response.ERROR_IN_PASSWORD_RESET_TOKEN);
                    });

            } else {
                return reject(response.NOT_REGISTERED);
            }
        });

    });
}

function forgot_password(body) {
    return new Promise(function(resolve, reject) {
        var newBody = _.pick(body, 'email');

        var otp_data = _.random(1000, 9999).toString();
        //var otp_data = 1234
        var now = new Date();
        var expiry_date = date.addMinutes(now, 30);
        User.findOne({ email: newBody.email }, (err, foundUser) => {
            if (err) {
                return reject(response.ERROR);
            } else if (foundUser) {


                User.findOneAndUpdate({ email: newBody.email }, { $set: { otp: otp_data, expiry_date: expiry_date } }, { new: true })
                    .exec()
                    .then(function(resetToken) {
                        //this is working code currently it is commented but it will come in to picture this code is to send emails
                        const mailOptions = {
                            from: 'alohadev14@gmail.com', // sender address
                            to: resetToken.email, // list of receivers
                            subject: 'Verify Email Otp', // Subject line
                            html: "<p>Dear " + resetToken.name + " your otp is " + otp_data + ",</p> Otp is valid for 30 minutes only.</p>"
                        };
                        transporter.sendMail(mailOptions).then(function(emailSent) {
                            // var data = {
                            //     'otp': otp_data,
                            //     'email': foundUser.email
                            // };
                            // return resolve(commonFunctions.sendSuccessResponse(data));

                            var json_response = response.OTP_SEND
                            json_response.data = otp_data

                            return resolve(json_response);

                        }, function(error) {
                            return reject(commonFunctions.sendErrorResponse(response.ERROR_IN_MANDRILL));
                        }).catch(function(e) {
                            return reject(commonFunctions.sendErrorResponse(response.ERROR_IN_MANDRILL));
                        });
                        //ends



                    }, function(error) {
                        return reject(response.ERROR_IN_PASSWORD_RESET_TOKEN);
                    }).catch(function(e) {
                        return reject(response.ERROR_IN_PASSWORD_RESET_TOKEN);
                    });

            } else {
                return reject(response.NOT_REGISTERED);
            }
        });

    });
}

function update_password(body) {
    return new Promise(function(resolve, reject) {
        var email = body.email;
        var new_password = body.new_password;
        var confirm_password = body.confirm_password;

        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            bcrypt.hash(body.new_password, salt, function(err, hash) {
                console.log("HASHX:", hash);
                if (new_password != confirm_password) {

                    return reject(response.PASSWORD_NOT_MATCH);
                } else {
                    User.findOne({ email: email })
                        .exec()
                        .then(function(data) {
                            User.findOneAndUpdate({ email: email }, { $set: { password: hash } }, { new: true })
                                .exec()
                                .then(function(result) {
                                    if (result) {
                                        return resolve(response.PASSWORD_CHANGED);
                                    } else {
                                        return reject(response.ERROR);
                                    }
                                })
                        });
                }

            })
        })

    });
}

function logout(user) {
    console.log('user', user)
    return new Promise(function(resolve, reject) {

        User.findByIdAndUpdate({ _id: user.id }, { $set: { sessionToken: "", device_token: "", isLoggedIn: 0 } }, { new: true })
            .exec()
            .then(function(result) {
                if (result) {

                    return resolve(response.LOGOUT);
                } else {
                    return reject(response.ERROR);
                }
            })


    });
}

function profile(user) {
    return new Promise(function(resolve, reject) {
        User.find({ "_id": user.id }, {
            "password": 0,

        }, function(err, user) {
            if (err) {
                return reject(response.ERROR);
            } else if (user) {
                var json_response = response.FETCH
                json_response.data = user

                return resolve(json_response);
            } else {
                return reject(commonFunctions.sendErrorResponse(response.ERROR_FINDING_DATA));
            }

        }).populate('university')
    })
}

function updateUser(body, user) {
    return new Promise(function(resolve, reject) {
        var newUser = _.pick(user, 'id', 'role');
        var query = {
            _id: newUser.id
        }
        var dataToSave = body
        if (body.longitude && body.latitude) {
            dataToSave.loc = { type: "Point", coordinates: [body.longitude, body.latitude] }
            delete dataToSave["longitude"];
            delete dataToSave["latitude"];
        }
        console.log('dataToSave', dataToSave)
        User.findOneAndUpdate(query, {
            $set: dataToSave
        }, { new: true, lean: true }, function(err, user) {
            if (err) {
                return reject(response.ERROR);
            } else if (user) {
                var user_array = []
                user_array.push(user)
                var json_response = response.UPDATED_USER
                json_response.data = user_array

                return resolve(json_response);
            } else {
                return reject(commonFunctions.sendErrorResponse(response.ERROR_FINDING_DATA));
            }
        });
    });
}

function updateUser_v2(file, body, user) {
    return new Promise(function(resolve, reject) {
        var newUser = _.pick(user, 'id', 'role');
        var query = {
            _id: newUser.id
        }
        var dataToSave = body
        if (file != undefined) {
            var image = process.env.SERVER_URL + file.filename;
            dataToSave.profile_pic = image
        }
        if (body.longitude && body.latitude) {
            dataToSave.loc = { type: "Point", coordinates: [body.longitude, body.latitude] }
            delete dataToSave["longitude"];
            delete dataToSave["latitude"];
        }
        console.log('dataToSave', dataToSave)
        User.findOneAndUpdate(query, {
            $set: dataToSave
        }, { new: true, lean: true }, function(err, user) {
            if (err) {
                return reject(response.ERROR);
            } else if (user) {
                var json_response = response.UPDATED
                json_response.data = user

                return resolve(json_response);
            } else {
                return reject(commonFunctions.sendErrorResponse(response.ERROR_FINDING_DATA));
            }
        });
    });
}

function fetch_chat(body, user) {

    return new Promise(function(resolve, reject) {

        var id = body.roomid
        var id0 = id.slice(0, 24);
        var id1 = id.slice(25, 49);
        var id2 = id1 + '.' + id0
        console.log(id2)
        Message.find({

                '$or': [{ 'roomid': body.roomid }, { 'roomid': id2 }]
            })
            .sort({ createdAt: -1 })
            .exec()
            .then(data => {

                if (data.length >= 1) {
                    var json_response = response.FETCH
                    json_response.data = data

                    return resolve(json_response);
                } else {
                    return reject(response.ERROR);
                }

            });




    })

}

function fetch_chatlist(body, user) {

    return new Promise(function(resolve, reject) {


        var userId = user.id;

        var finalResponse = [];
        console.log('userId', userId)
        Room.find({ $or: [{ user_id1: userId }, { user_id2: userId }] })
            .populate("user_id1 user_id2")
            .then(async data => {
                //console.log('data',data)
                if (data.length >= 1) {

                    console.log('data', data.length)
                    var i = 0;
                    for (var room_id of data) {

                        var responseObj = {};
                        await Message.findOne({ roomid: room_id._id }).sort({ createdAt: -1 }).then(async data1 => {
                            responseObj.roomId = room_id.room_id;
                            if (room_id.user_id1 != user.id)
                                responseObj.chatWith = room_id.user_id1
                            else {
                                responseObj.chatWith = room_id.user_id2
                            }

                            responseObj.recentMessage = data1;
                            finalResponse[i] = responseObj
                            i++

                        }).catch(err => {
                            console.log(err);
                        })

                    }
                    var json_response = response.FETCH
                    json_response.data = finalResponse

                    return resolve(json_response);





                } else {
                    return reject(response.ERROR);
                }
            })

    })

}

function remove_session(body) {
    console.log('body', body)
    return new Promise(function(resolve, reject) {

        User.findOneAndUpdate({ email: body.email }, { $set: { sessionToken: "", device_token: "", isLoggedIn: 0 } }, { new: true })
            .exec()
            .then(function(result) {
                if (result) {
                    //console.log('result',result)

                    User.findOneAndUpdate({ email: body.email }, { $set: { device_token: "" } }, { new: true }, function(err, data) {
                        if (err) {
                            var value = {
                                "status": "failure",
                                "message": "Something Went Wrong",
                                "data": ""
                            }
                            return reject(value);
                        }
                        if (data) {
                            var value = {
                                "status": "Success",
                                "message": "Logged Out Successfully",
                                "data": ""
                            }
                            return resolve(value);
                        }
                    })


                } else {
                    var value = {
                        "status": "failure",
                        "message": "Something Went Wrong",
                        "data": ""
                    }
                    return reject(value);
                }
            })


    });
}