'use strict';
//External files and packages
const _ = require('underscore');
require('dotenv').config();


//Internal Files and packages
const Comments = require('./../models/comments');
const Split = require('./../models/split');
const User = require('./../models/user');
const commonFunctions = require('./../commonFunctions.js');
const response = require('./../responses.js');
// var FCM = require('fcm-node');
// var serverKey = 'AIzaSyD0C4rkVwDobNEDs-h-yJsnf2K5jX1x6HU';
// var fcm = new FCM(serverKey);
var mongoose =  require('mongoose')


module.exports = {
    add_comments,
    get_comments,
};

function add_comments(body, user) {
    return new Promise(function (resolve, reject) {
        var newBody = _.pick(body, 'split_id', 'user_id', 'comments', 'nested_comment_id');
        console.log(newBody);
        const newcomments = new Comments(newBody);
        newcomments.save(function (err, inserted) {
            if (err) {
                console.log(err)
                var value = {
                    "status": "Failure",
                    "message": "Internal DB Error",
                    "data": ""
                }
                return reject(value);
            }
            if (inserted) {

                        var value = {
                            "status": "Success",
                            "message": "Comment Added Successfully",
                            "data": inserted
                        }
                        return resolve(value);

            } else {
                return reject(commonFunctions.sendErrorResponse(response.INETRNAL_SERVER_ERROR));
            }

        });

    })
}

function get_comments(body, user) {
    return new Promise(function (resolve, reject) {
        var newBody = _.pick(body, 'split_id');
        Comments.find({
            split_id: newBody.split_id
        }, function (err, results) {
            if (err) {
                console.log(err)
                var value = {
                    "status": "Failure",
                    "message": "Internal DB Error",
                    "data": ""
                }
                return reject(value);
            }
            if (results) {

                var parentComments = _.filter(results, function (comment) { 
                    return comment.nested_comment_id =='';
                });

                
                if(parentComments.length > 0)
                {
                    _.each(parentComments, function(parentComment) { 
                        var childComments = []; 
                        childComments = _.filter(results, function (comment) {                             
                            return comment.nested_comment_id == parentComment._id;
                        });                        

                        parentComment['child_comment'] = childComments;
                        console.log(' each parent ', parentComment );
                        
                    });
                }
                var value = {
                    "status": "Success",
                    "message": "Comment Fetched Successfully",
                    "data": parentComments
                }
                
                return resolve(value);

            } else {
                return reject(commonFunctions.sendErrorResponse(response.INETRNAL_SERVER_ERROR));
            }

        }).populate("user_id",'name profile_pic').sort({"createdAt":-1})

    })
}