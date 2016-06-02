var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

var ufuncs = require('./userFuncs');

//get config objects
//var config = require('./config');
var db = require('./mysqlUtil');

//setup for file uploads
var fs = require('fs');
var multer = require('multer'); //node middleware primarily used for uploading files
var upload = multer({
	dest: 'upload' //establish the upload directory
});
var type = upload.single('file');
// ---- end multer setup

// Home route. We'll end up changing this later.
router.get('/', function (req, res) {
	res.send('Relax. We will put the home page here later.');
});

router.post('/authenticate', function (req, res) {

	ufuncs.authenticateUser(req.body.email, req.body.password).then(
		function (user) {
			res.send(user);
		},
		function (err) {
			res.send(err);
		});

});

router.post('/register', function (req, res) {
	var user = ufuncs.mapUser(req.body);
	ufuncs.saveUser(user).then(
		function(success){
			res.send(success);
		},
		function(err){
			res.send(err);
		});

});

router.post('/upload', type, function (req, res, next) {

	console.log(req.file);
	//multer automatically stores the file in the upload directory with a random file name!
	// res.json(req.file);
	var targetPath = 'public/images/user-uploads/' + req.file.originalname;
	// res.json(target_path);
	// Now copy the file to the images/user-uploads directory
	fs.readFile(req.file.path, function (error, data) {
		fs.writeFile(targetPath, data, function (error) {
			if (!error) {
				fs.unlink(req.file.path, function (err) {
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
