
// require('dotenv').config();
// const jwt = require('jsonwebtoken');
const _ = require('underscore');
const User = require('./models/user');

var commonFunctions = {};

commonFunctions.sendErrorResponse = function (body) {
  var message = {};
  message = body;
  return message;
}

commonFunctions.sendSuccessResponse = function (body) {
  var message = {};
  message.success = body;
  return message
}

commonFunctions.addTokenToDb = function (data) {
  return new Promise(function (resolve, reject) {
    var query = { email: data.email };
    
    var update = {

      "sessionToken":data.token,
      "device_token":data.device_token,
      "lastlogin":new Date().toISOString(),
      "isLoggedIn":1

    }

    User.findOneAndUpdate(query, { $set: update }, { new: true }, function (err, updatedToken) {
      if (err) {
        console.log(err);
        return reject(err);
      } else if (updatedToken) {
        return resolve(updatedToken)
      } else {
        return resolve('rejected');
      }
    })

  });
}

module.exports = commonFunctions;
