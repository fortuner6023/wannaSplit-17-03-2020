//External Files and Packages
var express = require('express');
const validator = require('express-joi-validation').createValidator({ passError: true })
var passport = require('passport');
//Internal Files and Packages
const brands = require('./../controllers/brand');
const Joi = require('@hapi/joi');
const commonFunctions = require('../commonFunctions');
const response = require('./../responses.js');
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



const brandsSchema = Joi.object({

    name: Joi.string().optional()
});
router.post('/add_brands', validator.body(brandsSchema, joiOptions), upload.single('image'), function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {
            console.log("Error 1");
            res.send(commonFunctions.sendErrorResponse(info));
        } else {
            if (info.code == 200) {
                brands.add_brands(req.file, req.body, user, function(err, data) {
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


const deletebrandsSchemaValidator = Joi.object({
    brand_id: Joi.string().required()
});

router.delete('/delete_brands', validator.fields(deletebrandsSchemaValidator, joiOptions), function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {

        if (err) {
            res.status(401).send(commonFunctions.sendErrorResponse(err));
        } else {
            if (info.code == 200) {
                brands.delete_brands(req.body, user).then(function(delete_brands) {
                    res.status(200).send(delete_brands);
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



const editbrandsSchemaValidator = Joi.object({
    brand_id: Joi.string().required(),
    name: Joi.string().optional()
});

router.put('/edit_brands', validator.fields(editbrandsSchemaValidator, joiOptions), upload.single('image'), function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {
            res.status(401).send(commonFunctions.sendErrorResponse(err));
        } else {
            if (info.code == 200) {
                brands.edit_brands(req.file, req.body, user).then(function(edit_brands) {
                    res.status(200).send(edit_brands);
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



const fetchbrandsSchema = Joi.object({
    brand_id: Joi.string().required()
});

router.post('/fetch_brands', validator.body(fetchbrandsSchema, joiOptions), function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {

            res.send(commonFunctions.sendErrorResponse(info));
        } else {
            if (info.code == 200) {
                brands.fetch_brands(req.body, user).then(function(fetch_brands) {
                    res.status(200).send(fetch_brands);
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


router.post('/show_brands', function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {
            res.status(401).send(commonFunctions.sendErrorResponse(err));
        } else {
            if (info.code == 200) {
                brands.show_brands(req.body, user).then(function(show_brands) {
                    res.status(200).send(show_brands);
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