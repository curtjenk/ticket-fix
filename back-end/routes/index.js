var express = require('express');
var router = express.Router();
// var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

var User = require('./models/user');
var ufuncs = require('./userFuncs');

//get config objects
var config = require('./config');
var passport = require('./passport');

var db = require('./mysqlUtil');

//setup for file uploads
var fs = require('fs');
var multer = require('multer'); //node middleware primarily used for uploading files
var upload = multer({
	dest: 'upload' //establish the upload directory
});
var type = upload.single('file');
// ---- end multer setup

var ApiResponse = function (res) {
	res = res || {};
	this.api = res.api;
	this.success = res.success;
	this.message = res.message;
	this.token = res.token;
	this.data = res.data;
};

// Home route. We'll end up changing this later.
router.get('/', function (req, res) {
	res.send('Relax. We will put the home page here later.');
});

router.post('/login', function (req, res, next) {

	var apiRes = new ApiResponse({
		api: 'login'
	});
	ufuncs.authenticateUser(req.body.email, req.body.password).then(
		function (user) {
			console.log(user);
			apiRes.success = true;
			apiRes.data = {
				email: user.email,
				type_user_id: user.type_user_id,
				property_code: user.property_code
			};
      //Add IP Address to signature
			var token = jwt.sign({
				  ip: req.ip,
					email: user.email,
					property_code: user.property_code
				},
				config.secret, {
					expiresIn: '24h'
				}
			);
		  apiRes.token = token;
			console.log(apiRes);
			res.json(apiRes);
		},
		function (err) {
			console.log(error);
			apiRes.success = true;
			apiRes.message = "Authentication Failed.  Confirm Email and Password";
			apiRes.data = err;
			res.json(apiRes);
		});

});

router.post('/register', function (req, res) {
	var user = new User(req.body); //ufuncs.mapUser(req.body);
	ufuncs.saveUser(user).then(
		function (success) {
			res.json(success);
		},
		function (err) {
			res.json(err);
		});

});


router.post('/api/testtoken', function (req, res) {
		//console.log(req.body.token );
		res.json(req.body.token + " " + req.decoded);
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
