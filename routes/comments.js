//External Files and Packages
var express = require('express');
const validator = require('express-joi-validation').createValidator({ passError: true })

var passport = require('passport');
//Internal Files and Packages
const Comments = require('./../controllers/comments');
const Joi = require('joi')
const commonFunctions = require('./../commonFunctions');


const joiOptions = {
    joi: {
        convert: true,
        allowUnknown: true
    }
};
var router = express.Router();

const commentSchema = Joi.object({
    split_id: Joi.string().required(),
    user_id: Joi.string().required(),
    comments: Joi.string().required(),
    nested_comment_id: Joi.string().optional().allow(null).allow(''),
});

router.post('/add_comments', validator.body(commentSchema, joiOptions),function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {
            console.log("Error 1");
            res.send(commonFunctions.sendErrorResponse(info));
        } else {
            if (info.code == 200) {
                Comments.add_comments(req.body, user).then(function(add_comments) {
                    res.status(200).send(add_comments);
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
                var value = {
                    "status": "Failure",
                    "message": "Invalid or No Token",
                    "data": "UnAuthorized Access"
                }
                res.status(400).send(value);
            }
        }
    })(req, res, next);
});

const fetchcommentSchema = Joi.object({
    split_id: Joi.string().required()
});

router.post('/get_comments',validator.body(fetchcommentSchema, joiOptions), function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {
            console.log("Error 1");
            res.send(commonFunctions.sendErrorResponse(info));
        } else {
            if (info.code == 200) {
                Comments.get_comments(req.body, user).then(function(get_comments) {
                    res.status(200).send(get_comments);
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
                var value = {
                    "status": "Failure",
                    "message": "Invalid or No Token",
                    "data": "UnAuthorized Access"
                }
                res.status(400).send(value);
            }
        }
    })(req, res, next);
});

module.exports = router;