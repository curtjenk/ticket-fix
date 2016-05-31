var express = require('express');
var router = express.Router();
//get config objects
var dbConfig = require('./config').dbConfig;
var testconfig = require('./config').test;
testconfig.sayHello();

//setup connection pool
var mysql      = require('mysql');

var pool      =    mysql.createPool({
    connectionLimit : dbConfig.mysql.pool.connectionLimit, //important
    host     : dbConfig.mysql.host,
    user     : dbConfig.mysql.username,
    password : dbConfig.mysql.password,
    database : dbConfig.mysql.database,
    debug    : dbConfig.mysql.debug
});
//setup for file uploads
var fs = require('fs');
var multer = require('multer'); //node middleware primarily used for uploading files
var upload = multer({
    dest: 'upload' //establish the upload directory
});
var type = upload.single('file');

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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



module.exports = router;
