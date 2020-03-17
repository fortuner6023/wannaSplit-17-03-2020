const _ = require('underscore');
//Internal Files and packages
const circle = require('./../models/circle');
const User = require('./../models/user');
const response = require('./../responses.js');
var async = require('async');
const commonFunctions = require('./../commonFunctions.js');


module.exports = {
    add_circle,
    delete_circle,
    edit_circle,
    fetch_circle,
    show_circle,
    join_circle
};



async function checkUniquId(uniqueId) {
    let idFound = await Order.findOne({ receipt: uniqueId });
    if (!idFound) return true;
    return false;
}

function createUniqueId() {
    var text = "";
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (var i = 0; i < 6; i++) {
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return  text;
}



async function getReceiptNumber() {
    
        do {
            var value = createUniqueId()
            
            return value;
        } while (checkUniquId(createUniqueId))
    
}


  function add_circle(body, user, callback) {
    console.log(user)
    async.waterfall([

        function add_circle(callback) {
            var receipt ;
            var userName = getReceiptNumber()
            userName.then( function(result) {
                 receipt = result
             var newBody = _.pick(body, 'name'); 
              newBody.created_by = user.id
             newBody.invite_code = receipt
             const newcircle = new circle(newBody);
             newcircle.created_by = user.id
             newcircle.save(function (err, inserted) {
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
 
            });

        }

    ], function (err, result) {
        if (err) {
            console.log('err',err)
            callback(err)
        } else {
            console.log('result',result)
            callback(null, result)
        }
    }
    )
}


//delete circle
function delete_circle(body, user) {

    return new Promise(function (resolve, reject) {

        circle.findOneAndRemove({ "_id": body.circle_id }, function (err, data) {
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


// update circle
function edit_circle(body, user) {

    return new Promise(function (resolve, reject) {
        var newBody = _.pick(body, 'name');
        var query = {
            _id: body.circle_id
        };
        circle.findOneAndUpdate(query, {
            $set: newBody
        }, { new: true }, function (err, data) {
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


//read a particular circle
function fetch_circle(body, user) {
    return new Promise(function (resolve, reject) {

        var query = {
            _id: body.circle_id
        };
        console.log('query', query)
        circle.findOne(query, function (err, data) {
            if (err) {
                return reject(response.ERROR);
            }
            if (data) {

                var json_response = response.FETCH
                json_response.data = data

                return resolve(json_response);
            }
        }).populate("users")
    })
}


function show_circle(body, user) {

    return new Promise(function (resolve, reject) {

        console.log(user.id)
        circle.find({ $or:[{ "users":{$in:[user.id]}},{"created_by":user.id}] }, function (err, data) {
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

// update circle
function join_circle(body, user) {

    return new Promise(function (resolve, reject) {
        var newBody = _.pick(body, "circle_id",
            "invite_code"
            );
        var query = {
            invite_code: newBody.invite_code
        };
        circle.findOneAndUpdate(query, {
            $addToSet: { users: user.id }
        }, { new: true }, function (err, data) {
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
