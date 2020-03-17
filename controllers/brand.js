const _ = require('underscore');
//Internal Files and packages
const brands = require('./../models/brand');
const User = require('./../models/user');
const response = require('./../responses.js');
var async = require('async');
const commonFunctions = require('./../commonFunctions.js');


module.exports = {
    add_brands,
    delete_brands,
    edit_brands,
    fetch_brands,
    show_brands
};




//create brands
function add_brands(file, body, user, callback) {
    async.waterfall([

        function brands(callback) {

            var newBody = _.pick(body, 'name');
            if (file != undefined) {
                var image = process.env.SERVER_URL + file.filename;
                newBody.image = image
            }
            callback(null, newBody);

        },
        function addbrands(newBody, callback) {
            const newbrands = new brands(newBody);
            newbrands.save(function(err, inserted) {
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


//delete brands
function delete_brands(body, user) {

    return new Promise(function(resolve, reject) {

        brands.findOneAndRemove({ "_id": body.brand_id }, function(err, data) {
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


// update brands
function edit_brands(file, body, user) {

    return new Promise(function(resolve, reject) {
        var newBody = _.pick(body, 'name');
        if (file != undefined) {
            var image = process.env.SERVER_URL + file.filename;
            newBody.image = image
        }
        var query = {
            _id: body.brand_id
        };
        brands.findOneAndUpdate(query, {
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


//read a particular brands
function fetch_brands(body, user) {
    return new Promise(function(resolve, reject) {

        var query = {
            _id: body.brand_id
        };
        console.log('query', query)
        brands.findOne(query, function(err, data) {
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


function show_brands(body, user) {

    return new Promise(function(resolve, reject) {

        brands.find({}, function(err, data) {
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