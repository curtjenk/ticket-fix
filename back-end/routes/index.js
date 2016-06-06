var express = require('express');
var router = express.Router();
// var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

var User = require('./models/user');
var Account = require('./models/account');
var Manager = require('./models/manager').Manager;
var ManagerHasProperty = require('./models/manager').ManagerHasProperty;
var Contractor = require('./models/contractor');
var Property = require('./models/property');

var ufuncs = require('./userFuncs');
var admin = require('./adminFuncs');

//get config objects
var config = require('./config');
var passport = require('./passport');

//var db = require('./mysqlUtil');

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
			apiRes.success = false;
			apiRes.message = "Authentication Failed.  Confirm Email and Password";
			apiRes.data = err;
			res.json(apiRes);
		});

});

router.post('/register', function (req, res) {
	var user = new User(req.body.user); //ufuncs.mapUser(req.body);
	var apiRes = new ApiResponse({
		api: 'register'
	});
	ufuncs.saveUser(user).then(
		function (success) {
			apiRes.success = true;
			apiRes.data = {
				email: user.email,
				type_user_id: user.type_user_id,
				property_code: user.property_code
			};
			res.json(apiRes);
		},
		function (err) {
			apiRes.success = false;
			apiRes.message = "Registration Failed.";
			apiRes.data = err;

			res.json(apiRes);
		});

});

router.post('/api/testtoken', function (req, res) {
	//console.log(req.body.token );
	res.json(req.body.token + " " + req.decoded);
});

router.post('/api/saveaccount', function (req, res) {
	var account = new Account(req.body.account);
	var apiRes = new ApiResponse({
		api: 'saveaccount'
	});
	admin.saveaccount(account).then(function(success){
		apiRes.success = true;
		apiRes.data = {
			account_code: account.account_code,
		};
		res.json(apiRes);
	}, function(err){
		apiRes.success = false;
		apiRes.message = "Save Account Failed.";
		apiRes.data = err;
		res.json(apiRes);
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
