// config/passport.js
const User = require('./../models/user');
const commonFunctions = require('./../commonFunctions');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

passport.use('local', new LocalStrategy({

        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done) {

        var criteria = {
            email: email
        }
        console.log('critera', criteria)
        User.findOne(criteria, function(err, user) {
            if (err) {

                return done(err);

            }
            if (!user) {
                console.log('user not found');
                return done(null, false, {
                    "status": "Failure",
                    "message": "Username Or Password Is Incorrect",
                    "data": ""
                });
            }
            if (user.isValid === "true") {
                if (user.isLoggedIn == 0) {
                    bcrypt.compare(password, user.password, function(err, response) {
                        if (err) {
                            return done(null, false, {
                                "status": "Failure",
                                "message": "Username Or Password Is Incorrect",
                                "data": ""
                            });
                        } else {
                            if (response == false) {
                                return done(null, false, {
                                    "status": "Failure",
                                    "message": "Username Or Password Is Incorrect",
                                    "data": ""
                                });
                            } else {
                                console.log("User in Strategy :", user);
                                return done(null, user, null);
                            }
                        }
                    });
                } else if (user.isLoggedIn === 1) {
                    bcrypt.compare(password, user.password, (err, response) => {
                        if (err) {
                            return done(null, false, {
                                "status": "Failure",
                                "message": "Username Or Password Is Incorrect",
                                "data": ""
                            })
                        } else {
                            if (response == false) {
                                return done(null, false, {
                                    "status": "Failure",
                                    "message": "Username Or Password Is Incorrect",
                                    "data": ""
                                })
                            } else {
                                console.log("User in Strategy :", user);
                                return done(null, user, null);
                            }
                        }
                    })
                } else {
                    return done(null, false, { 'status': 'failure', 'message': 'Please Logout From Active Session', "data": "" });
                }
            } else {
                return done(null, false, { 'status': 'failure', 'message': 'Please Verify Email first', "data": "" });
            }
        });


    }));



var opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.TOKEN_SECRET;
opts.passReqToCallback = true;

passport.use('jwtUser', new JWTStrategy(opts, function(req, jwt_payload, done) {
    var tokenFromHeader = req.headers.authorization;
    var sessToken = tokenFromHeader.substr(7);

    if (jwt_payload.role === "User" || jwt_payload.role === "Admin") {
        var criteria = {
            _id: jwt_payload.id,
            sessionToken: sessToken
        }

        User.findOne(criteria, function(err, user) {
            if (err) {
                return done(null, false, { 'code': '401', 'status': 'failed', 'message': 'Invalid Session', 'type': 'Validation Error' });
            } else if (user) {
                return done(null, user, { 'code': '200', 'error': '' });
            } else {
                return done(null, false, { 'code': '401', 'status': 'failed', 'message': 'Invalid Session', 'type': 'Validation Error' });
            }
        })
    } else {
        return done(null, false, { 'code': '401', 'status': 'failed', 'message': 'Invalid username or password', 'type': 'Validation Error' });
    }
}));


var opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.TOKEN_SECRET;
opts.passReqToCallback = true;

passport.use('jwtAdmin', new JWTStrategy(opts, function(req, jwt_payload, done) {
    var tokenFromHeader = req.headers.authorization;
    var sessToken = tokenFromHeader.substr(7);
    if (jwt_payload.role === "Admin") {
        var criteria = {
            _id: jwt_payload.id
        }
        User.findOne(criteria, function(err, user) {
            if (err) {
                return done(null, false, { 'code': '401', 'status': 'failed', 'message': 'Invalid Token', 'type': 'Validation Error' });
            }
            if (user) {
                user.role = 'company'
                return done(null, user, { 'code': '200', 'error': '' });

            }
        })
    } else {
        return done(null, false, { 'code': '401', 'status': 'failed', 'message': 'Invalid username or password', 'type': 'Validation Error' });
    }

}));