const _ = require('underscore');
//Internal Files and packages
const splits = require('./../models/split');
const User = require('./../models/user');
const response = require('./../responses.js');
var async = require('async');
const commonFunctions = require('./../commonFunctions.js');
let date = require("date-and-time");


module.exports = {
    add_splits,
    add_splits_v2,
    delete_splits,
    edit_splits,
    edit_splits_v2,
    fetch_splits,
    show_splits,
    add_likes,
    trending_split,
    nearby_splits,
    active_splits,
    completed_splits,
    favourites_splits,
    fetch_favourites_splits,
    search_splits
};


//create splits
function add_splits(body, user, callback) {
    async.waterfall([

        function splits(callback) {

            var newBody = _.pick(body, "title",
                "description",
                "radius",
                "tags",
                "time",
                "price",
                "splitters",
                "invite",
                "image");
            newBody.loc = { type: "Point", coordinates: [body.longitude, body.latitude] }
            newBody.user_id = user.id,
                newBody.tags = "#" + body.tags,
                newBody.is_active = 0
            var now = new Date();
            var expiry_date = date.addMinutes(now, body.time);
            newBody.expiry_date = expiry_date

            callback(null, newBody);

        },
        function addsplits(newBody, callback) {
            const newsplits = new splits(newBody);
            newsplits.save(function(err, inserted) {
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

function add_splits_v2(file, body, user, callback) {
    async.waterfall([

        function splits(callback) {

            var newBody = _.pick(body, "title",
                "description",
                "radius",
                "tags",
                "time",
                "price",
                "splitters",
                "invite");
            if (newBody.invite) {
                var invite = JSON.parse(newBody.invite)
                newBody.invite = invite
            }

            if (file != undefined) {
                var image = process.env.SERVER_URL + file.filename;
                newBody.image = image
            }

            newBody.loc = { type: "Point", coordinates: [body.longitude, body.latitude] }
            newBody.user_id = user.id,
                newBody.is_active = 0
            newBody.tags = "#" + body.tags
            var now = new Date();
            var expiry_date = date.addMinutes(now, body.time);
            newBody.expiry_date = expiry_date

            callback(null, newBody);

        },
        function addsplits(newBody, callback) {
            const newsplits = new splits(newBody);
            newsplits.save(function(err, inserted) {
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

//delete splits
function delete_splits(body, user) {

    return new Promise(function(resolve, reject) {

        splits.findOneAndRemove({ "_id": body.split_id }, function(err, data) {
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

// update splits
function edit_splits(body, user) {

    return new Promise(function(resolve, reject) {
        var newBody = _.pick(body, "title",
            "description",
            "radius",
            "tags",
            "time",
            "price",
            "splitters",
            "invite",
            "image",
            "is_active");
        if (body.longitude && body.latitude) {
            newBody.loc = { type: "Point", coordinates: [body.longitude, body.latitude] }
        }
        newBody.tags = "#" + body.tags
        var query = {
            _id: body.split_id
        };
        splits.findOneAndUpdate(query, {
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
// update splits
function edit_splits_v2(file, body, user) {

    return new Promise(function(resolve, reject) {
        var newBody = _.pick(body, "title",
            "description",
            "radius",
            "tags",
            "time",
            "price",
            "splitters",
            "invite",
            "is_active"
        );
        if (newBody.invite) {
            var invite = JSON.parse(newBody.invite)
            newBody.invite = invite
        }
        newBody.tags = "#" + body.tags

        if (file != undefined) {
            var image = process.env.SERVER_URL + file.filename;
            newBody.image = image
        }
        if (body.longitude && body.latitude) {
            newBody.loc = { type: "Point", coordinates: [body.longitude, body.latitude] }
        }
        var query = {
            _id: body.split_id
        };
        splits.findOneAndUpdate(query, {
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
//read a particular splits
function fetch_splits(body, user) {
    return new Promise(function(resolve, reject) {

        var query = {
            _id: body.split_id
        };
        console.log('query', query)
        splits.findOne(query, function(err, data) {
            if (err) {
                return reject(response.ERROR);
            }
            if (data) {

                var json_response = response.FETCH
                json_response.data = data

                return resolve(json_response);
            }
        }).populate('likes user_id');
    })
}

function show_splits(body, user) {

    return new Promise(function(resolve, reject) {

        splits.find({ is_active: 0 }, function(err, data) {
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

            }).populate('likes user_id')
            .sort({ "createdAt": -1 });

    })
}

function add_likes(body, user) {

    return new Promise(function(resolve, reject) {

        var queryOLD = {
            _id: body.split_id
        };
        var query = {
            $and: [{ _id: body.split_id },
                { likes: { $in: [body.likes] } }
            ]
        }

        splits.findOne(query).exec().then(data => {

            var latestData = [];
            if (data) {
                latestData = data.likes.filter(function(item) {
                    return item.toString() != body.likes;
                });
            }


            var param = {};
            if (data) {
                param["$set"] = { likes: latestData };
            } else {
                param["$addToSet"] = { likes: body.likes };
            }
            // $set: { likes: data ? latestData : body.likes }

            splits.findOneAndUpdate(queryOLD, param, { new: true, lean: true }, function(err, userDetails) {
                if (err) {
                    console.log(err)
                    return reject(response.ERROR);

                } else if (userDetails) {

                    userDetails.likes_count = userDetails.likes.length;
                    userDetails.is_liked = data ? false : true;

                    var json_response = response.UPDATED
                    json_response.data = data

                    return resolve(json_response);

                } else {
                    return reject(commonFunctions.sendErrorResponse(response.ERROR_FINDING_DATA));
                }

            })

        });


    })
}

function trending_split(body, user) {

    return new Promise(function(resolve, reject) {

        splits.find({}, function(err, data) {
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

            }).populate('likes user_id')
            .sort({ "likes": -1 })
            .limit(10);

    })
}

function nearby_splits(body) {

    return new Promise(function(resolve, reject) {


        if (body.latitude && body.longitude) {

            var query = {
                is_active: 0
                    // loc: {
                    //     $near: {
                    //         $geometry: {
                    //             type: "Point",
                    //             coordinates: [body.longitude, body.latitude]
                    //                 //the origin point.
                    //         },
                    //         $minDistance: 0, //in meter
                    //         $maxDistance: 5000 //in meter
                    //     }
                    // }
            }
        } else {
            var query = {}
        }


        splits.find(query)
            .populate('likes user_id')
            .sort({ "createdAt": -1 })
            .exec()
            .then(data => {

                if (data.length <= 0) {

                    return resolve(response.NO_DATA_FOUND);

                } else if (data.length >= 1) {

                    var json_response = response.FETCH
                    json_response.data = data
                    console.log("nearby split===>", data)
                    return resolve(json_response);

                } else {

                    return reject(response.ERROR);

                }

            })


    })

}

function active_splits(body, user) {

    return new Promise(function(resolve, reject) {


        splits.find({ is_active: 0 }, function(err, data) {
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

            }).populate('likes user_id')
            .sort({ "createdAt": -1 });

    })
}

function completed_splits(body, user) {

    return new Promise(function(resolve, reject) {


        splits.find({ is_active: 1 }, function(err, data) {
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

            }).populate('likes user_id')
            .sort({ "updatedAt": -1 });

    })
}

function favourites_splits(body, user) {

    return new Promise(function(resolve, reject) {

        var queryOLD = {
            _id: user.id
        };
        var query = {
            $and: [{ _id: user.id },
                { favourite_split: { $in: [body.favourite_split] } }
            ]
        }

        User.findOne(query).exec().then(data => {

            var latestData = [];
            if (data) {
                latestData = data.favourite_split.filter(function(item) {
                    return item.toString() != body.favourite_split;
                });
            }


            var param = {};
            if (data) {
                param["$set"] = { favourite_split: latestData };
            } else {
                param["$addToSet"] = { favourite_split: body.favourite_split };
            }
            // $set: { likes: data ? latestData : body.likes }

            User.findOneAndUpdate(queryOLD, param, { new: true, lean: true }, function(err, userDetails) {
                if (err) {
                    console.log(err)
                    return reject(response.ERROR);

                } else if (userDetails) {

                    userDetails.favourite_split_count = userDetails.favourite_split.length;
                    userDetails.is_favourite_split = data ? false : true;

                    var json_response = response.UPDATED
                    json_response.data = data

                    return resolve(json_response);

                } else {
                    return reject(commonFunctions.sendErrorResponse(response.ERROR_FINDING_DATA));
                }

            })

        });


    })
}

//read a particular splits
function fetch_favourites_splits(body, user) {
    return new Promise(function(resolve, reject) {

        var query = {
            _id: user._id
        };
        console.log('query', query)
        User.find(query, function(err, data) {
            if (err) {
                return reject(response.ERROR);
            }
            if (data) {

                var json_response = response.FETCH
                json_response.data = data

                return resolve(json_response);
            }
        }).populate({
            path: 'favourite_split',
            populate: {
                path: 'likes',
                options: { sort: { 'createdAt': -1 } }
            }
        });
    })
}



function search_splits(body, user) {

    return new Promise(function(resolve, reject) {

        var query = {
            title: body.title
        }
        splits.createIndex({ title: "text" }, (err, result) => {
            console.log(result)
            callback(result)
        })

        splits.find({
            title: {
                $regex: new RegExp(query)
            }
        }, {
            _id: 0,
            __v: 0
        }, (err, data) => {
            if (err) {
                res.json({ status: "error", error: err })
            }
            if (data) {
                res.json({ data: data })
            }
        }).limit(10)

        // splits.find(query, function(err, data) {
        //         if (err) {
        //             console.log(err)
        //             return reject(response.ERROR);
        //         } else if (data) {
        //             var json_response = response.FETCH
        //             json_response.data = data

        //             return resolve(json_response);

        //         } else {
        //             return reject(commonFunctions.sendErrorResponse(response.ERROR_FINDING_DATA));
        //         }

        //     }).populate('likes user_id')
        //     .sort({ "updatedAt": -1 });

    })
}