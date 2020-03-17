//External Files and Packages
var express = require('express');
const validator = require('express-joi-validation').createValidator({ passError: true })
var passport = require('passport');
//Internal Files and Packages
const intrests = require('./../controllers/intrests');
const Joi = require('@hapi/joi');
const commonFunctions = require('../commonFunctions');
const response = require('./../responses.js');

const joiOptions = {
    joi: {
        convert: true,
        allowUnknown: true
    }
};

var router = express.Router();


const intrestsSchema = Joi.object({
    label: Joi.string().required(),
});

router.post('/add_intrests', validator.body(intrestsSchema, joiOptions), function(req, res, next) {
    passport.authenticate('jwtAdmin', function(err, user, info) {
        if (err) {
            console.log("Error 1");
            res.send(commonFunctions.sendErrorResponse(info));
        } else {
            if (info.code == 200) {
                intrests.add_intrests(req.body, user, function(err, data) {
                    if (err) {
                        res.status(400).send(err);
                    }
                    if (data) {
                        res.status(200).send(data);
                    }

                }, function(err) {
                    console.log('error 3');
                    console.log(err);
                    res.status(400).send(err);
                })
            } else {
                console.log("++++++++++++++++++++++Invalid Or No Token++++++++++++++++++++++");
                res.status(400).send(response.INVALID_TOKEN);
            }
        }
    })(req, res, next);
});


const deleteIntrestsSchemaValidator = Joi.object({
    intrest_id: Joi.string().required()
});

router.delete('/delete_intrests', validator.fields(deleteIntrestsSchemaValidator, joiOptions), function(req, res, next) {
    passport.authenticate('jwtAdmin', function(err, user, info) {

        if (err) {
            res.status(401).send(commonFunctions.sendErrorResponse(err));
        } else {
            if (info.code == 200) {
                intrests.delete_intrests(req.body, user).then(function(delete_intrests) {
                    res.status(200).send(delete_intrests);
                }, function(err) {
                    console.log(err);
                    res.status(400).send(err);
                }).catch(function(e) {
                    res.status(400).send(e);
                });
            } else {
                console.log("++++++++++++++++++++++Invalid Or No Token++++++++++++++++++++++");
                res.status(400).send(response.INVALID_TOKEN);
            }
        }
    })(req, res, next);
});



const editIntrestsSchemaValidator = Joi.object({
    intrest_id: Joi.string().required(),
    label: Joi.string().optional()
});

router.put('/edit_intrests', validator.fields(editIntrestsSchemaValidator, joiOptions), function(req, res, next) {
    passport.authenticate('jwtAdmin', function(err, user, info) {
        if (err) {
            res.status(401).send(commonFunctions.sendErrorResponse(err));
        } else {
            if (info.code == 200) {
                intrests.edit_intrests(req.body, user).then(function(edit_intrests) {
                    res.status(200).send(edit_intrests);
                }, function(err) {
                    console.log(err);
                    res.status(400).send(err);
                }).catch(function(e) {
                    res.status(400).send(e);
                });
            } else {
                console.log("++++++++++++++++++++++Invalid Or No Token++++++++++++++++++++++");
                res.status(400).send(response.INVALID_TOKEN);
            }
        }
    })(req, res, next);
});



const fetchIntrestsSchema = Joi.object({
    intrest_id: Joi.string().required()
});

router.post('/fetch_intrests', validator.body(fetchIntrestsSchema, joiOptions), function(req, res, next) {
    passport.authenticate('jwtAdmin', function(err, user, info) {
        if (err) {

            res.send(commonFunctions.sendErrorResponse(info));
        } else {
            if (info.code == 200) {
                intrests.fetch_intrests(req.body, user).then(function(fetch_intrests) {
                    res.status(200).send(fetch_intrests);
                }, function(err) {
                    console.log('error 3');
                    console.log(err);
                    res.status(400).send(err);
                }).catch(function(e) {
                    console.log('error 2');
                    res.status(400).send(e);
                });
            } else {
                console.log("++++++++++++++++++++++Invalid Or No Token++++++++++++++++++++++");
                res.status(400).send(response.INVALID_TOKEN);
            }
        }
    })(req, res, next);
});


router.post('/show_intrests', function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {
            res.status(401).send(commonFunctions.sendErrorResponse(err));
        } else {
            if (info.code == 200) {
                intrests.show_intrests(req.body, user).then(function(show_intrests) {
                    res.status(200).send(show_intrests);
                }, function(err) {
                    console.log(err);
                    res.status(400).send(err);
                }).catch(function(e) {
                    res.status(400).send(e);
                });
            } else {
                console.log("++++++++++++++++++++++Invalid Or No Token++++++++++++++++++++++");
                res.status(400).send(response.INVALID_TOKEN);
            }
        }
    })(req, res, next);
});






module.exports = router;