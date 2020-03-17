const _ = require('underscore');

require('dotenv').config();


//Internal Files and packages
const User = require('./../models/user');
let date = require("date-and-time");
const commonFunctions = require('./../commonFunctions.js');
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
    updateUser
};

//User Signup function
function signup(body) {
    return new Promise(function (resolve, reject) {
        var otp_data = _.random(1000, 9999).toString();
        // var otp_data = 1234;
        var now = new Date();
        var expiry_date = date.addMinutes(now, 30);
        var newBody = _.pick(body, 'name', 'role', 'email', 'password', 'confirm_password', 'device_token', 'mobile_number');
        newBody.isValid = "false";
        newBody.otp = otp_data;
        newBody.expiry_date = expiry_date;
        newBody.loc = { type: "Point", coordinates: [ body.longitude, body.latitude ] }
        console.log('newBody', newBody);
        const newUser = new User(newBody);
        newUser.save(function (err, inserted) {
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

                transporter.sendMail(mailOptions).then(function (emailSent) {
                    console.log('email',emailSent)
                    var json_response = response.SIGNUP_SUCCESS
                    json_response.data = inserted.email,
                    json_response.otp = inserted.otp
                    return resolve(json_response);
                }, function (error) {
                    console.log('error',error)
                    return reject(commonFunctions.sendErrorResponse(response.ERROR_SENDING_EMAIL));
                }).catch(function (e) {
                    return reject(commonFunctions.sendErrorResponse(response.ERROR_SENDING_EMAIL));
                });
            } else {
               
                return reject(commonFunctions.sendErrorResponse(response.INETRNAL_SERVER_ERROR));
            }
            
        });
    })
}

function verify_otp(body) {
    return new Promise(function (resolve, reject) {
        var newBody = _.pick(body, 'email', 'otp');
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
                        User.findOneAndUpdate(
                            { email: email },
                            { $set: { otp: result.otp, isValid: true } },
                            { new: true }
                        )
                            .exec()
                            .then(function (result) {
                                if (result) {

                                    
                                    return resolve(response.VALID_OTP);
                                }
                            });
                    } else {
                        console.log("expired");
                        
                        return reject(response.EXPIRED_OTP);
                    }
                } else {
                   
                    return reject( response.OTP_NOT_MATCH);
                }

            } else {
                return reject(response.NOT_REGISTERED);
            }
        });

    });
}

function send_otp(body) {
    return new Promise(function (resolve, reject) {
        var newBody = _.pick(body, 'email');

        var otp_data = _.random(1000, 9999).toString();
        // var otp_data = 1234;
        var now = new Date();
        var expiry_date = date.addMinutes(now, 30);
        User.findOne({ email: newBody.email }, (err, foundUser) => {
            if (err) {
                return reject(response.ERROR);
            } else if (foundUser) {


                User.findOneAndUpdate(
                    { email: newBody.email },
                    { $set: { otp: otp_data, expiry_date: expiry_date } },
                    { new: true }
                )
                    .exec()
                    .then(function (resetToken) {
    //this is working code currently it is commented but it will come in to picture this code is to send emails
                        const mailOptions = {
                            from: 'alohadev14@gmail.com', // sender address
                            to: resetToken.email, // list of receivers
                            subject: 'Verify Email Otp', // Subject line
                            html: "<p>Dear " + resetToken.name + " your otp is " + otp_data + ",</p> Otp is valid for 30 minutes only.</p>"
                        };
                        transporter.sendMail(mailOptions).then(function (emailSent) {

                            var data = {
                                'otp': otp_data,
                                'email': foundUser.email
                            };
                            return resolve(commonFunctions.sendSuccessResponse(data));
                        }, function (error) {
                            return reject(commonFunctions.sendErrorResponse(response.ERROR_IN_MANDRILL));
                        }).catch(function (e) {
                            return reject(commonFunctions.sendErrorResponse(response.ERROR_IN_MANDRILL));
                        });
                        //ends

                    }, function (error) {
                        console.log('erororororor',error)
                        return reject(response.ERROR_IN_PASSWORD_RESET_TOKEN);
                    }).catch(function (e) {
                        console.log('erororororor',e)
                        return reject(response.ERROR_IN_PASSWORD_RESET_TOKEN);
                    });

            } else {
                return reject(response.NOT_REGISTERED);
            }
        });

    });
}

function forgot_password(body) {
    return new Promise(function (resolve, reject) {
        var newBody = _.pick(body, 'email');

        var otp_data = _.random(1000, 9999).toString();
        //var otp_data = 1234
        var now = new Date();
        var expiry_date = date.addMinutes(now, 30);
        User.findOne({ email: newBody.email }, (err, foundUser) => {
            if (err) {
                return reject(response.ERROR);
            } else if (foundUser) {


                User.findOneAndUpdate(
                    { email: newBody.email },
                    { $set: { otp: otp_data, expiry_date: expiry_date } },
                    { new: true }
                )
                    .exec()
                    .then(function (resetToken) {
                            //this is working code currently it is commented but it will come in to picture this code is to send emails
                        const mailOptions = {
                            from: 'alohadev14@gmail.com', // sender address
                            to: resetToken.email, // list of receivers
                            subject: 'Verify Email Otp', // Subject line
                            html: "<p>Dear " + resetToken.name + " your otp is " + otp_data + ",</p> Otp is valid for 30 minutes only.</p>"
                        };
                        transporter.sendMail(mailOptions).then(function (emailSent) {
                            // var data = {
                            //     'otp': otp_data,
                            //     'email': foundUser.email
                            // };
                            // return resolve(commonFunctions.sendSuccessResponse(data));
                            
                            var json_response = response.OTP_SEND
                            json_response.data = otp_data
            
                            return resolve(json_response);
                            
                        }, function (error) {
                            return reject(commonFunctions.sendErrorResponse(response.ERROR_IN_MANDRILL));
                        }).catch(function (e) {
                            return reject(commonFunctions.sendErrorResponse(response.ERROR_IN_MANDRILL));
                        });
                        //ends



                    }, function (error) {
                        return reject(response.ERROR_IN_PASSWORD_RESET_TOKEN);
                    }).catch(function (e) {
                        return reject(response.ERROR_IN_PASSWORD_RESET_TOKEN);
                    });
                    
            } else {
                return reject(response.NOT_REGISTERED);
            }
        });

    });
}

function update_password(body) {
    return new Promise(function (resolve, reject) {
        var email = body.email;
        var new_password = body.new_password;
        var confirm_password = body.confirm_password;

        bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
            bcrypt.hash(body.new_password, salt, function (err, hash) {
                console.log("HASHX:", hash);
                if (new_password != confirm_password) {
                   
                    return reject(response.PASSWORD_NOT_MATCH);
                } else {
                    User.findOne({ email: email })
                        .exec()
                        .then(function (data) {
                            User.findOneAndUpdate(
                                { email: email },
                                { $set: { password: hash } },
                                { new: true }
                            )
                                .exec()
                                .then(function (result) {
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
    console.log('user',user)
    return new Promise(function (resolve, reject) {

        User.findByIdAndUpdate(
            { _id: user.id },
            { $set: { sessionToken: "", device_token: "" , isLoggedIn : 0 } },
            { new: true }
        )
            .exec()
            .then(function (result) {
                if (result) {
                   
                    return resolve(response.LOGOUT);
                } else {
                    return reject(response.ERROR);
                }
            })


    });
}

function profile(user) {
    return new Promise(function (resolve, reject) {
        User.findOne({ "_id": user.id },
            {
                "password": 0,

            }, function (err, user) {
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
    return new Promise(function (resolve, reject) {
        var newUser = _.pick(user, 'id', 'role');
        var query = {
            _id : newUser.id
        }
        var dataToSave = body
        if(body.longitude && body.latitude){
            dataToSave.loc = { type: "Point", coordinates: [ body.longitude, body.latitude ] }
            delete dataToSave["longitude"];
            delete dataToSave["latitude"];
        }
        console.log('dataToSave',dataToSave)
        User.findOneAndUpdate(query, {
            $set: dataToSave
        }, { new: true , lean:true }, function (err, user) {
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