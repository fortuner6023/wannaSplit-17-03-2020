const _ = require('underscore');
//Internal Files and packages
const intrests = require('./../models/intrests');
const User = require('./../models/user');
const response = require('./../responses.js');
var async = require('async');
// let date = require("date-and-time");
const commonFunctions = require('./../commonFunctions.js');


module.exports = {
    add_intrests,
    delete_intrests,
    edit_intrests,
    fetch_intrests,
    show_intrests
};


//create intrests
function add_intrests(body, user, callback) {
    async.waterfall([

        function intrests(callback) {

            var newBody = _.pick(body, 'label');
            callback(null, newBody);
        },
        function addintrests(newBody, callback) {
            const newintrests = new intrests(newBody);
            newintrests.save(function(err, inserted) {
                if (err) {
                    console.log(err)
                    callback(null, response.ERROR);
                }
                if (inserted) {

                    var json_response = response.ADDED
                    json_response.data = inserted

                    callback(null, json_response);
                }

            });

        },

    ], function(err, result) {
        if (err) {
            callback(err)
        } else {
            callback(null, result)
        }
    })
}


//delete intrests
function delete_intrests(body, user) {

    return new Promise(function(resolve, reject) {

        intrests.findOneAndRemove({ "_id": body.intrest_id }, function(err, data) {
            if (err) {

                return reject(response.ERROR);

            } else if (data) {

                var json_response = response.DELETE
                return resolve(json_response);

            } else {

                return reject(response.NO_DATA_FOUND);

            }
        });
    });
}


// update intrests
function edit_intrests(body, user) {

    return new Promise(function(resolve, reject) {
        var newBody = _.pick(body, 'label');
        var query = {
            _id: body.intrest_id
        };
        intrests.findOneAndUpdate(query, {
            $set: newBody
        }, { new: true }, function(err, data) {
            if (err) {
                console.log(err)
                return reject(response.ERROR);

            } else if (data) {
                var json_response = response.UPDATED
                json_response.data = data
                return resolve(json_response);
            } else {
                return reject(commonFunctions.sendErrorResponse(response.ERROR_FINDING_DATA));
            }

        })
    })
}


//read a particular intrests
function fetch_intrests(body, user) {
    return new Promise(function(resolve, reject) {

        var query = {
            _id: body.intrest_id
        };
        console.log('query', query)
        intrests.findOne(query, function(err, data) {
            if (err) {
                return reject(response.ERROR);
            }
            if (data) {

                var json_response = response.FETCH
                json_response.data = data

                return resolve(json_response);
            }
        });
    })
}


function show_intrests(body, user) {

    return new Promise(function(resolve, reject) {

        intrests.find({}, function(err, data) {
            if (err) {
                console.log(err)
                return reject(response.ERROR);
            } else if (data) {


                var json_response = response.FETCH
                json_response.data = data

                return resolve(json_response);

            } else {
                return reject(commonFunctions.sendErrorResponse(response.ERROR_FINDING_DATA));
            }

        })

    })
}