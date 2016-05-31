var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

//get config objects
var Config = require('./config').Config;

//Custom utility library for MySql
var mysqlUtil      = require('./mysqlUtil');

//Passport middleware for JWT
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var passportOpts = {};


//setup for file uploads
var fs = require('fs');
var multer = require('multer'); //node middleware primarily used for uploading files
var upload = multer({
    dest: 'upload' //establish the upload directory
});
var type = upload.single('file');
// ---- end multer setup

// Home route. We'll end up changing this later.
router.get('/', function(req, res) {
  res.send('Relax. We will put the home page here later.');
});

router.post('/upload', type, function(req, res, next) {

    console.log(req.file);
    //multer automatically stores the file in the upload directory with a random file name!
    // res.json(req.file);
    var targetPath = 'public/images/user-uploads/' + req.file.originalname;
    // res.json(target_path);
    // Now copy the file to the images/user-uploads directory
    fs.readFile(req.file.path, function(error, data) {
        fs.writeFile(targetPath, data, function(error) {
            if (!error) {
                fs.unlink(req.file.path, function(err) {
                    if (err) {
                        console.log("Error deleting temp upload file = " + req.file.path);
                    }
                });
            }
            if (error) {

                res.json("Error copying the file: " + error);
            } else {
                res.json('Success');
            }
        });
    });

});



module.exports = router;
