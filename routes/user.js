var express = require('express');
var router = express.Router();
const Joi = require('@hapi/joi')
const User = require('./../controllers/user');
const User1 = require('./../models/user');
const validator = require('express-joi-validation').createValidator({ passError: true })
const passport = require('passport');
const jwt = require('jsonwebtoken');
const response = require('./../responses.js');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname)
    }
});
var upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 10 } });

const joiOptions = {
    joi: {
        convert: true,
        allowUnknown: true
    }
};

const commonFunctions = require('./../commonFunctions.js');


var checkDuplicateEmail = function(req, res, next) {
    var query = {
        email: req.body.email
    }
    console.log("Query", query);
    User1.findOne(query, function(err, user) {
        if (err) {
            return commonFunctions.sendErrorResponse(err);
        } else if (user) {
            console.log("In services");
            res.status(400).send(commonFunctions.sendErrorResponse(response.EMAIL_ALREADY_EXISTS));
        } else {
            next();
        }
    });
}


const signupSchema = Joi.object({
    email: Joi.string().required().lowercase().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/).label('Email'),
    password: Joi.string().required(),
    name: Joi.string().optional(),
    role: Joi.string().required(),
    deviceToken: Joi.string().optional(),
    mobile_number: Joi.number().optional(),
    longitude: Joi.number().optional(),
    latitude: Joi.number().optional(),
    gender: Joi.string().optional(),
    DOB: Joi.string().optional(),
});

router.post('/signup', validator.body(signupSchema, joiOptions), checkDuplicateEmail, function(req, res) {

    User.signup(req.body).then(function(signup) {
        res.status(200).send(signup)
    }, function(err) {
        res.status(500).send(commonFunctions.sendErrorResponse(response.INTERNAL_SERVER_ERROR));
    }).catch(function(e) {
        res.status(400).send(response.SOMETHING_WENT_WRONG);

    });
});


// const signupSchema_v2 = Joi.object({
//     email: Joi.string().required().lowercase().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/).label('Email'),
//     password: Joi.string().required(),
//     name: Joi.string().optional(),
//     role: Joi.string().required(),
//     deviceToken: Joi.string().optional(),
//     mobile_number:Joi.number().optional(),
//     longitude:Joi.number().optional(),
//     latitude:Joi.number().optional(),
//     gender:Joi.string().optional(),
//     DOB:Joi.string().optional(),
//     image:Joi.any().optional()
//   });

router.post('/signup_v2', upload.single('image'), checkDuplicateEmail, function(req, res) {
    console.log('req.file', req.file)
    User.signup_v2(req.file, req.body).then(function(signup_v2) {
        res.status(200).send(signup_v2)
    }, function(err) {
        res.status(500).send(commonFunctions.sendErrorResponse(response.INTERNAL_SERVER_ERROR));
    }).catch(function(e) {
        res.status(400).send(response.SOMETHING_WENT_WRONG);

    });
});

//Login For Testing
router.post('/login', function(req, res, next) {
    console.log('In route');
    passport.authenticate('local', function(err, user, info) {
        console.log('after passport');
        console.log("user : ", user);
        console.log("info", info);
        if (info) {

            return res.status(401).send(info);
        }
        jwt.sign({ 'email': user.email, 'role': user.role, 'id': user._id }, process.env.TOKEN_SECRET, { algorithm: 'HS256' }, function(err, token) {
            if (err) {

                return res.status(400).send(err);
            } else if (user) {

                var data = {
                    "token": token,
                    "email": user.email,
                    "device_token": req.body.device_token
                }
                commonFunctions.addTokenToDb(data).then(function(result) {
                    if (result) {

                        var json_response = response.LOGIN_SUCCESS
                        json_response.data = result

                        return res.status(200).send(json_response);

                    } else {
                        return res.status(500).send(info.response);
                    }

                }, function(error) {
                    return reject(error);
                }).catch(function(e) {
                    return reject(e);
                });
            } else {

                return res.status(401).send(response.INCORRECT_USERNAME_PASSWORD);
            }
        });
    })(req, res, next);
});

const verify_otp = Joi.object({
    email: Joi.string().required().lowercase().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/).label('Email'),
    otp: Joi.number().required()
});

router.post('/verify_otp', validator.body(verify_otp, joiOptions), function(req, res) {


    User.verify_otp(req.body).then(function(verify_otp) {
        res.status(200).send(verify_otp)
    }, function(err) {
        res.status(500).send(err);
    }).catch(function(e) {
        res.status(400).send(response.SOMETHING_WENT_WRONG);
    });
});

const send_otpSchema = Joi.object({
    email: Joi.string().required().lowercase().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/).label('Email')
});

router.post('/send_otp', validator.body(send_otpSchema, joiOptions), function(req, res) {

    User.send_otp(req.body).then(function(send_otp) {
        res.status(200).send(send_otp)
    }, function(err) {
        res.status(500).send(commonFunctions.sendErrorResponse(response.INTERNAL_SERVER_ERROR));
    }).catch(function(e) {
        res.status(400).send(response.SOMETHING_WENT_WRONG);
    });
});


const forgot_password = Joi.object({
    email: Joi.string().required().lowercase().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/).label('Email')
});

router.post('/forgot_password', validator.body(forgot_password, joiOptions), function(req, res) {
    User.forgot_password(req.body).then(function(forgot_password) {
        res.status(200).send(forgot_password)
    }, function(err) {
        res.status(500).send(err);
    }).catch(function(e) {
        res.status(400).send(response.SOMETHING_WENT_WRONG);
    });
});

const update_password = Joi.object({
    email: Joi.string().required().lowercase().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/).label('Email'),
    new_password: Joi.string().required(),
    confirm_password: Joi.string().required()
});

router.post('/update_password', validator.body(update_password, joiOptions), function(req, res) {
    //console.log(req.body)
    User.update_password(req.body).then(function(update_password) {
        res.status(200).send(update_password)
    }, function(err) {
        res.status(500).send(response.INTERNAL_SERVER_ERROR);
    }).catch(function(e) {
        res.status(400).send(response.SOMETHING_WENT_WRONG);
    });
});

router.post('/image', upload.single('image'), function(req, res, next) {

    console.log('In route:', req.file);
    passport.authenticate('jwtUser', function(err, user, info) {
        console.log("user : ", user);
        console.log("info", info);
        if (err) {
            console.log('we are in error');
            return err
        } else if (info.code == 200) {
            var image = req.file.filename
            console.log('we are in user', image);


            var data = {
                profile_pic: process.env.SERVER_URL + image

            }
            var query = {
                _id: user._id
            };
            var projection = {

                password: 0
            }
            User1.findOneAndUpdate(query, {
                $set: data
            }, { "fields": { "profile_pic": 1 }, new: true }, function(err, details) {
                if (err) {

                    return res.status(500).send(response.ERROR);
                } else if (details) {

                    var json_response = response.UPDATED
                    json_response.data = details

                    return res.status(200).send(json_response);

                } else {
                    return res.status(200).send(response.ERROR_FINDING_DATA);
                }

            });
        } else {
            res.status(400).send(response.INVALID_TOKEN);
        }

    })(req, res, next);
})

router.post('/logout', function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {
            res.send(commonFunctions.sendErrorResponse(info));
        } else {
            if (info.code == 200) {
                User.logout(user).then(function(logout) {
                    res.status(200).send(logout);
                }, function(err) {
                    res.status(400).send(err);
                }).catch(function(e) {
                    res.status(400).send(e);
                });
            } else {
                res.status(400).send(response.INVALID_TOKEN);
            }
        }
    })(req, res, next);
});

router.post('/profile', function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {
            res.send(commonFunctions.sendErrorResponse(info));
        } else {
            if (info.code == 200) {
                User.profile(user).then(function(profile) {
                    res.status(200).send(profile);
                }, function(err) {
                    res.status(400).send(err);
                }).catch(function(e) {
                    res.status(400).send(e);
                });
            } else {

                res.status(400).send(response.INVALID_TOKEN);
            }
        }
    })(req, res, next);
});

router.put('/updateUser', function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {

            res.send(commonFunctions.sendErrorResponse(info));
        } else {
            if (info.code == 200) {
                User.updateUser(req.body, user).then(function(updateUser) {
                    res.status(200).send(updateUser);
                }, function(err) {

                    res.status(400).send(err);
                }).catch(function(e) {

                    res.status(400).send(e);
                });
            } else {

                res.status(400).send(response.INVALID_TOKEN);
            }
        }
    })(req, res, next);
});

router.put('/updateUser_v2', upload.single('image'), function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {

            res.send(commonFunctions.sendErrorResponse(info));
        } else {
            if (info.code == 200) {
                console.log('req.file', req.file)
                console.log('req.body', req.body)
                User.updateUser_v2(req.file, req.body, user).then(function(updateUser_v2) {
                    res.status(200).send(updateUser_v2);
                }, function(err) {

                    res.status(400).send(err);
                }).catch(function(e) {

                    res.status(400).send(e);
                });
            } else {

                res.status(400).send(response.INVALID_TOKEN);
            }
        }
    })(req, res, next);
});

//Login For Testing
router.post('/social_login', function(req, res, next) {


    User1.find({ socialId: req.body.id })
        .exec()
        .then(function(data) {

            if (data.length < 1) {


                var user = new User1({

                    socialId: req.body.id,
                    type: req.body.type,
                    name: req.body.name,
                    email: req.body.email,
                    loginType: req.body.provider,
                    profile_pic: req.body.photoUrl,
                    authToken: req.body.authToken,
                    isValid: "true",
                    role: req.body.role,
                    deviceToken: req.body.deviceToken

                });

                user.loc = { type: "Point", coordinates: [req.body.longitude, req.body.latitude] }
                user
                    .save()
                    /** after save result is consoled */
                    .then(result => {
                        jwt.sign({ 'email': result.email, 'role': result.role, 'id': result._id }, process.env.TOKEN_SECRET, { algorithm: 'HS256' }, function(err, token) {
                            if (err) {
                                return res.status(400).send(err);
                            } else if (result) {

                                var data = {
                                    "token": token,
                                    "email": result.email,
                                    "device_token": req.body.device_token
                                }
                                commonFunctions.addTokenToDb(data).then(function(result) {
                                    if (result) {
                                        var json_response = response.LOGIN_SUCCESS
                                        json_response.data = result


                                        return res.status(200).send(json_response);

                                    } else {
                                        return res.status(500).send(info.response);
                                    }

                                }, function(error) {
                                    return res.status(400).send(error);
                                }).catch(function(e) {
                                    return res.status(400).send(e);
                                });
                            } else {

                                return res.status(401).send(response.SOMETHING_WENT_WRONG);
                            }
                        });
                    });
            } else {
                jwt.sign({ 'email': data[0].email, 'role': data[0].role, 'id': data[0]._id }, process.env.TOKEN_SECRET, { algorithm: 'HS256' }, function(err, token) {
                    if (err) {

                        return res.status(400).send(err);
                    } else if (data) {

                        var userData = {
                            "token": token,
                            "email": data[0].email,
                            "device_token": req.body.device_token
                        }

                        commonFunctions.addTokenToDb(userData).then(function(result) {
                            if (result) {
                                var json_response = response.LOGIN_SUCCESS
                                json_response.data = result
                                return res.status(200).send(json_response);
                                //return res.status(info.code).send(result);
                            } else {
                                return res.status(500).send(info.response);
                            }

                        }, function(error) {
                            return res.status(400).send(error);
                        }).catch(function(e) {
                            return res.status(400).send(e);
                        });
                    } else {
                        return res.status(401).send(response.SOMETHING_WENT_WRONG);
                    }
                });

            }
        })
        .catch(function(e) {
            return res.status(400).send(e);
        });

});

router.post('/fetch_chat', function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {

            res.send(commonFunctions.sendErrorResponse(info));
        } else {
            if (info.code == 200) {
                User.fetch_chat(req.body, user).then(function(fetch_chat) {
                    res.status(200).send(fetch_chat);
                }, function(err) {

                    res.status(400).send(err);
                }).catch(function(e) {

                    res.status(400).send(e);
                });
            } else {

                res.status(400).send(response.INVALID_TOKEN);
            }
        }
    })(req, res, next);
});

router.post('/fetch_chatlist', function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {

            res.send(commonFunctions.sendErrorResponse(info));

        } else {

            if (info.code == 200) {

                User.fetch_chatlist(req.body, user).then(function(fetch_chatlist) {
                    res.status(200).send(fetch_chatlist);

                }, function(err) {

                    res.status(400).send(err);

                }).catch(function(e) {

                    res.status(400).send(e);

                });

            } else {

                res.status(400).send(response.INVALID_TOKEN);

            }

        }
    })(req, res, next);
});

const removeSession = Joi.object({
    email: Joi.string().required()
});

router.post('/remove_session', validator.body(removeSession, joiOptions), function(req, res, next) {

    User.remove_session(req.body).then(function(remove_session) {
        res.status(200).send(remove_session);
    }, function(err) {
        console.log('error 3');
        console.log(err);
        res.status(400).send(err);
    }).catch(function(e) {
        console.log('error 2');
        res.status(400).send(e);
    });

});

module.exports = router;