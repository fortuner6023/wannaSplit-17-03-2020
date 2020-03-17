//External Files and Packages
var express = require('express');
const validator = require('express-joi-validation').createValidator({ passError: true })
var passport = require('passport');
//Internal Files and Packages
const splits = require('./../controllers/split');
const split = require('./../models/split');
const Joi = require('@hapi/joi');
const commonFunctions = require('../commonFunctions');
const response = require('./../responses.js');
var cron = require('node-cron');

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

var router = express.Router();

//cron to add split to complete split when is over

cron.schedule('*/1 * * * *', () => {
    console.log('we are in cron')
    var today = new Date();

    var conditions = { expiry_date: { $lt: today }, is_active: 0 },
        update = { is_active: 1 },
        options = { multi: true };

    split.update(conditions, update, options, function(err, data) {
        if (err) {
            console.log(err)
        } else {

            console.log("cron has executed successfully", data)

            // return res.status(200).send(data);
        }
    });
});

// this is wroking

router.post('/image', upload.single('image'), function(req, res, next) {

    var image = req.file.filename
    console.log(req.file.filename)
    var image = process.env.SERVER_URL + image;


    var json_response = response.IMAGE_ADDED
    json_response.data = image

    return res.status(200).send(json_response);



})


router.post('/add_splits', function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {
            console.log("Error 1");
            res.send(commonFunctions.sendErrorResponse(info));
        } else {
            if (info.code == 200) {
                splits.add_splits(req.body, user, function(err, data) {
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


router.post('/add_splits_v2', upload.single('image'), function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {
            console.log("Error 1");
            res.send(commonFunctions.sendErrorResponse(info));
        } else {
            if (info.code == 200) {
                console.log('req.file', req.file)
                console.log('req.body', req.body)
                splits.add_splits_v2(req.file, req.body, user, function(err, data) {
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




const deletesplitsSchemaValidator = Joi.object({
    split_id: Joi.string().required()
});

router.delete('/delete_splits', validator.fields(deletesplitsSchemaValidator, joiOptions), function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {

        if (err) {
            res.status(401).send(commonFunctions.sendErrorResponse(err));
        } else {
            if (info.code == 200) {
                splits.delete_splits(req.body, user).then(function(delete_splits) {
                    res.status(200).send(delete_splits);
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



const editsplitsSchemaValidator = Joi.object({
    split_id: Joi.string().required(),
    name: Joi.string().optional()
});

router.put('/edit_splits', validator.fields(editsplitsSchemaValidator, joiOptions), function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {
            res.status(401).send(commonFunctions.sendErrorResponse(err));
        } else {
            if (info.code == 200) {
                splits.edit_splits(req.body, user).then(function(edit_splits) {
                    res.status(200).send(edit_splits);
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

const editsplitsSchemaValidator_v2 = Joi.object({
    split_id: Joi.string().required(),
    name: Joi.string().optional()
});

router.put('/edit_splits_v2', validator.fields(editsplitsSchemaValidator_v2, joiOptions), upload.single('image'), function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {
            res.status(401).send(commonFunctions.sendErrorResponse(err));
        } else {
            if (info.code == 200) {
                splits.edit_splits_v2(req.file, req.body, user).then(function(edit_splits_v2) {
                    res.status(200).send(edit_splits_v2);
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

const fetchsplitsSchema = Joi.object({
    split_id: Joi.string().required()
});

router.post('/fetch_splits', validator.body(fetchsplitsSchema, joiOptions), function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {

            res.send(commonFunctions.sendErrorResponse(info));
        } else {
            if (info.code == 200) {
                splits.fetch_splits(req.body, user).then(function(fetch_splits) {
                    res.status(200).send(fetch_splits);
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


router.post('/show_splits', function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {
            res.status(401).send(commonFunctions.sendErrorResponse(err));
        } else {
            if (info.code == 200) {
                splits.show_splits(req.body, user).then(function(show_splits) {
                    res.status(200).send(show_splits);
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



const likesSchema = Joi.object({
    likes: Joi.string().required(),
    split_id: Joi.string().required(),
    // is_liked: Joi.boolean().required()
});

router.post('/add_likes', validator.body(likesSchema, joiOptions), function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {
            console.log("Error 1");
            res.send(commonFunctions.sendErrorResponse(info));
        } else {
            if (info.code == 200) {
                splits.add_likes(req.body, user).then(function(add_likes) {
                    res.status(200).send(add_likes);
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

router.post('/trending_splits', function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {
            res.status(401).send(commonFunctions.sendErrorResponse(err));
        } else {
            if (info.code == 200) {
                splits.trending_split(req.body, user).then(function(trending_split) {
                    res.status(200).send(trending_split);
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

router.post('/nearby_splits', function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {
            res.status(401).send(commonFunctions.sendErrorResponse(err));
        } else {
            if (info.code == 200) {
                splits.nearby_splits(req.body, user).then(function(nearby_splits) {
                    res.status(200).send(nearby_splits);
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

router.post('/active_splits', function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {
            res.status(401).send(commonFunctions.sendErrorResponse(err));
        } else {
            if (info.code == 200) {
                splits.active_splits(req.body, user).then(function(active_splits) {
                    res.status(200).send(active_splits);
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


router.post('/completed_splits', function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {
            res.status(401).send(commonFunctions.sendErrorResponse(err));
        } else {
            if (info.code == 200) {
                splits.completed_splits(req.body, user).then(function(completed_splits) {
                    res.status(200).send(completed_splits);
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


const favourites_splitSchema = Joi.object({
    favourite_split: Joi.string().required(),
});

router.post('/add_favourites_splits', validator.body(favourites_splitSchema, joiOptions), function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {
            console.log("Error 1");
            res.send(commonFunctions.sendErrorResponse(info));
        } else {
            if (info.code == 200) {
                splits.favourites_splits(req.body, user).then(function(favourites_splits) {
                    res.status(200).send(favourites_splits);
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

router.post('/fetch_favourites_splits', function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {
            console.log("Error 1");
            res.send(commonFunctions.sendErrorResponse(info));
        } else {
            if (info.code == 200) {
                splits.fetch_favourites_splits(req.body, user).then(function(fetch_favourites_splits) {
                    res.status(200).send(fetch_favourites_splits);
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


router.post('/search_splits', function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {
            res.status(401).send(commonFunctions.sendErrorResponse(err));
        } else {
            if (info.code == 200) {
                splits.search_splits(req.body, user).then(function(search_splits) {
                    res.status(200).send(search_splits);
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


router.get('/search', (req, res, next) => {
    var q = req.query.q;
    // split.find({
    //     $text: {
    //         $search: q
    //     }
    // }, {
    //     _id: 0,
    //     __v: 0
    // }, (err, data) => {
    //     if (err) {
    //         res.json({ status: error, error: err })
    //     }
    //     if (data) {
    //         res.json(data)
    //     }
    // })


    //?================================================================
    split.find({
        title: {
            $regex: new RegExp(q)
        }
    }, {
        _id: 0,
        __v: 0
    }, (err, data) => {
        if (err) {
            res.json({ status: error, error: err })
        }
        if (data) {
            res.json({ data: data })
        }
    }).limit(10)

})


module.exports = router