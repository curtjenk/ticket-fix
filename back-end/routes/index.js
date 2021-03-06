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
var Tenant = require('./models/tenant');
var Ticket = require('./models/ticket');
var SendMailOptions = require('./models/sendmailoptions');

var ufuncs = require('./userFuncs');
var admin = require('./adminFuncs');
var query = require('./queryFuncs');
var register = require('./register');

//get config objects
var config = require('./config');
var passport = require('./passport');
var mailer = require('./mailer');
//--- constants
const USER_TYPE_MANAGER = 4;
const USER_TYPE_CONTRACTOR = 1;
const USER_TYPE_TENANT = 3;
const USER_TYPE_STAFF = 5;
const USER_TYPE_NAMES = ['n/a', 'Contractor', 'Admin', 'Tenant', 'Manager', 'Staff'];
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
	this.info = res.info;
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
		function (succ) {
			//console.log(succ);
			if (succ.status == 'ok') {
				apiRes.success = true;
				apiRes.info = {
					email: succ.data.email,
					type_user_id: succ.data.type_user_id,
					first_name: succ.data.first_name,
					last_name: succ.data.last_name,
					home_phone: succ.data.home_phone,
					mobile_phone: succ.data.mobile_phone
				};
				//Add IP Address to signature
				var token = jwt.sign({
						ip: req.ip,
						email: succ.data.email
					},
					config.secret, {
						expiresIn: '24h'
					}
				);
				apiRes.token = token;
			} else {
				apiRes.success = false;
				apiRes.message = succ.message;
				apiRes.info = succ.error;
			}
			//console.log(apiRes);
			res.json(apiRes);
		},
		//{status: 'error', data: {}, info: "BCrypt error", error: err})
		function (err) {
			console.log(err);
			apiRes.success = false;
			apiRes.message = err.message;
			apiRes.info = err.error;
			res.json(apiRes);
		});

});
router.post('/register', function (req, res) {
	var user = new User(req.body.user); //ufuncs.mapUser(req.body);
	var contractor = new Contractor(req.body.contractor);
	var manager = new Manager(req.body.manager);
	var property = new Property(req.body.property);
	var account = new Account(req.body.account);
	// console.log(req.body);
	var apiRes = new ApiResponse({
		api: 'register'
	});
	ufuncs.saveUser(user).then(
		function (rtn) {
			// console.log('returned from save user');
			// console.log(rtn);
			if (rtn.status == 'complete') {
				apiRes.success = true;
				apiRes.info = {
					id: rtn.data.id,
					email: user.email,
					type_user_id: user.type_user_id
				};
			} else {
				//rtn.status === 'found'
				apiRes.success = false;
				apiRes.message = rtn.message;
			}
			// console.log(apiRes);
			res.json(apiRes);
		},
		function (err) {
			// console.log(err);
			// console.log(typeof err);
			apiRes.success = false;
			apiRes.message = "Registration Failed.";
			apiRes.info = err;
			console.log(apiRes);
			res.json(apiRes);
		}
	);
});

router.post('/register-new', function (req, res) {
	console.log(req.body);
	var user = new User(req.body.user); //ufuncs.mapUser(req.body);
	var contractor = new Contractor(req.body.contractor);
	var manager = new Manager(req.body.manager);
	var property = new Property(req.body.property);
	var account = new Account(req.body.account);
	var apiRes = new ApiResponse({
		api: 'register'
	});

	switch (user.type_user_id) {
	case USER_TYPE_TENANT:
		register.registertenant(user, property).then(
			function (suc) {
				console.log(suc);
				if (suc.status == 'complete') {
					apiRes.success = true;
					apiRes.info = {
						id: suc.data.id,
						email: user.email,
						type_user_id: user.type_user_id
					};
				} else {
					apiRes.success = false;
					apiRes.error = suc.status;
					apiRes.message = suc.message;
				}
				res.json(apiRes);
			},
			function (err) {
				console.log(err);
				apiRes.success = false;
				apiRes.error = err.status;
				apiRes.message = err.message;
				res.json(apiRes);
			});
		break;
	case USER_TYPE_MANAGER:
		register.registermanager(user, account).then(
			function (suc) {
				console.log(suc);
				if (suc.status == 'complete') {
					apiRes.success = true;
					apiRes.info = {
						id: suc.data.id,
						email: user.email,
						type_user_id: user.type_user_id
					};
				} else {
					apiRes.success = false;
					apiRes.error = suc.status;
					apiRes.message = suc.message;
				}
				res.json(apiRes);
			},
			function (err) {
				console.log(err);
				apiRes.success = false;
				apiRes.error = err.status;
				apiRes.message = err.message;
				res.json(apiRes);
			});
		break;
	case USER_TYPE_CONTRACTOR:
		register.registercontractor(user, account, contractor).then(
			function (suc) {
				console.log(suc);
				if (suc.status == 'complete') {
					apiRes.success = true;
					apiRes.info = {
						id: suc.data.id,
						email: user.email,
						type_user_id: user.type_user_id
					};
				} else {
					apiRes.success = false;
					apiRes.error = suc.status;
					apiRes.message = suc.message;
				}
				res.json(apiRes);
			},
			function (err) {
				console.log(err);
				apiRes.success = false;
				apiRes.error = err.status;
				apiRes.message = err.message;
				res.json(apiRes);
			});
		break;
	default:
		apiRes.success = false;
		apiRes.error = 'input';
		apiRes.message = 'User Type Missing In Request';
		res.json(apiRes);
	}
});

router.post('/saveaccount', function (req, res) {
	var account = new Account(req.body.account);
	var apiRes = new ApiResponse({
		api: 'saveaccount'
	});
	admin.saveaccount(account).then(function (success) {
		//returns the insertId
		console.log(success);
		apiRes.success = true;
		apiRes.info = {
			id: success.id,
			account_code: account.account_code
		};
		res.json(apiRes);
	}, function (err) {
		apiRes.success = false;
		apiRes.message = "Save Account Failed.";
		apiRes.info = err;
		res.json(apiRes);
	});
});

router.post('/savemanager', function (req, res) {
	var manager = new Manager(req.body.manager);
	var apiRes = new ApiResponse({
		api: 'savemanager'
	});
	admin.savemanager(manager).then(function (success) {
		//returns the insertId
		console.log(success);
		apiRes.success = true;
		apiRes.info = {
			id: success.id
		};
		res.json(apiRes);
	}, function (err) {
		apiRes.success = false;
		apiRes.message = "Save Manager Failed.";
		apiRes.info = err;
		res.json(apiRes);
	});
});

router.post('/savecontractor', function (req, res) {
	var contractor = new Contractor(req.body.contractor);
	console.log(contractor);
	var apiRes = new ApiResponse({
		api: 'savecontractor'
	});
	admin.savecontractor(contractor).then(function (success) {
		//returns the insertId
		console.log(success);
		apiRes.success = true;
		apiRes.info = {
			id: success.id
		};
		res.json(apiRes);
	}, function (err) {
		console.log(err);
		apiRes.success = false;
		apiRes.message = "Save contractor Failed.";
		apiRes.info = err;
		res.json(apiRes);
	});
});

router.get('/propertyexists', function (req, res) {
	var property = new Property(JSON.parse(req.query.property));
	property.genKey();
	console.log(property.key);
	var apiRes = new ApiResponse({
		api: 'propertyexists'
	});
	admin.getproperty(property.key).then(
		function (succ) {
			console.log(succ);
			apiRes.succ = true;
			apiRes.info = {
				id: succ.data.id,
				isManaged: succ.data.isManaged
			};

			res.json(apiRes);
		},
		function (err) {
			console.log(err);
			apiRes.succ = false;
			apiRes.message = "Get Property Failed.";
			apiRes.info = err;
			res.json(apiRes);
		});
});

router.post('/saveproperty', function (req, res) {
	var property = new Property(req.body.property);
	//console.log(property);
	var apiRes = new ApiResponse({
		api: 'saveproperty'
	});

	admin.saveproperty(property).then(function (success) {
		//returns the insertId
		console.log(success);
		apiRes.success = true;
		apiRes.info = {
			id: success.id
		};
		res.json(apiRes);
	}, function (err) {
		apiRes.success = false;
		apiRes.message = "Save property Failed.";
		apiRes.info = err;
		res.json(apiRes);
	});
});

router.post('/savetenant', function (req, res) {
	var tenant = new Tenant(req.body.tenant);
	var apiRes = new ApiResponse({
		api: 'savetenant'
	});
	admin.savetenant(tenant).then(function (success) {
		//returns the insertId
		console.log(success);
		apiRes.success = true;
		apiRes.info = {
			id: success.id
		};
		res.json(apiRes);
	}, function (err) {
		apiRes.success = false;
		apiRes.message = "Save tenant Failed.";
		apiRes.info = err;
		res.json(apiRes);
	});
});

router.post('/api/createticket', function (req, res) {
	console.log(req.body);
	var ticket = new Ticket(req.body.ticket);
	console.log(ticket);
	var apiRes = new ApiResponse({
		api: 'api/createticket'
	});
	admin.saveticket(ticket).then(function (succ) {
		//returns the insertId
		console.log(succ);
		apiRes.success = true;
		apiRes.info = {
			id: succ.id
		};
		res.json(apiRes);
	}, function (err) {
		apiRes.success = false;
		apiRes.message = "Save Ticket Failed.";
		apiRes.info = err;
		res.json(apiRes);
	});
});

router.get('/api/tenantinfo', function (req, res) {
	//req.query.id  should contain the user id
	//query User, Tenant & Property and return all info except password
	var email = req.query.email;
	var apiRes = new ApiResponse({
		api: 'api/tenantinfo'
	});
	query.getTenantInfo(email).then(function (succ) {
		console.log(succ);
		if (succ.status == 'found') {
			apiRes.success = true;
			apiRes.info = succ.data;
		} else {
			apiRes.success = false;
			apiRes.message = succ.status;
			apiRes.info = succ.error;
		}
		res.json(apiRes);
	}, function (err) {
		apiRes.success = false;
		apiRes.message = 'Get tenant info failed';
		apiRes.info = err;
		res.json(apiRes);
	});

});

router.get('/api/alltenantsinfo', function (req, res) {
	var apiRes = new ApiResponse({
		api: 'api/alltenantsinfo'
	});
	query.getAllTenants().then(function (succ) {
		console.log(succ);
		if (succ.status == 'found') {
			apiRes.success = true;
			apiRes.info = succ.data;
		} else {
			apiRes.success = false;
			apiRes.message = succ.status;
			apiRes.info = succ.error;
		}
		res.json(apiRes);
	}, function (err) {
		apiRes.success = false;
		apiRes.message = 'Getting all tenants info failed';
		apiRes.info = err;
		res.json(apiRes);
	});

});

router.get('/api/allmanagersinfo', function (req, res) {
	var apiRes = new ApiResponse({
		api: 'api/allmanagersinfo'
	});
	query.getAllManagers().then(function (succ) {
		console.log(succ);
		if (succ.status == 'found') {
			apiRes.success = true;
			apiRes.info = succ.data;
		} else {
			apiRes.success = false;
			apiRes.message = succ.status;
			apiRes.info = succ.error;
		}
		res.json(apiRes);
	}, function (err) {
		apiRes.success = false;
		apiRes.message = 'Getting all managers info failed';
		apiRes.info = err;
		res.json(apiRes);
	});

});

router.get('/api/managerinfo', function (req, res) {
	//req.query.id  should contain the user id
	//query User, Tenant & Property and return all info except password
	var email = req.query.email;
	var apiRes = new ApiResponse({
		api: 'api/managerinfo'
	});
	query.getManagerInfo(email).then(function (succ) {
		console.log(succ);
		if (succ.status == 'found') {
			apiRes.success = true;
			apiRes.info = succ.data;
		} else {
			apiRes.success = false;
			apiRes.message = succ.status;
			apiRes.info = succ.error;
		}
		res.json(apiRes);
	}, function (err) {
		apiRes.success = false;
		apiRes.message = 'Get manager info failed';
		apiRes.info = err;
		res.json(apiRes);
	});

});
//getManagerProperties
router.get('/api/allmanagerproperties', function (req, res) {
	var email = req.query.email;
	var apiRes = new ApiResponse({
		api: 'api/allmanagerproperties'
	});
	query.getManagerProperties(email).then(function (succ) {
		console.log(succ);
		if (succ.status == 'found') {
			apiRes.success = true;
			apiRes.info = succ.data;
		} else {
			apiRes.success = false;
			apiRes.message = succ.status;
			apiRes.info = succ.error;
		}
		res.json(apiRes);
	}, function (err) {
		apiRes.success = false;
		apiRes.message = 'Get all manager properties failed';
		apiRes.info = err;
		res.json(apiRes);
	});

});
//getAllManagerTickets
router.get('/api/allmanagertickets', function (req, res) {
	//req.query.id  should contain the user id
	//query User, Tenant & Property and return all info except password
	var email = req.query.email;
	var apiRes = new ApiResponse({
		api: 'api/allmanagertickets'
	});
	query.getAllManagerTickets(email).then(function (succ) {
		//console.log(succ);
		if (succ.status == 'found') {
			apiRes.success = true;
			apiRes.info = succ.data;
		} else {
			apiRes.success = false;
			apiRes.message = succ.status;
			apiRes.info = succ.error;
		}
		res.json(apiRes);
	}, function (err) {
		apiRes.success = false;
		apiRes.message = 'Get all manager tickets failed';
		apiRes.info = err;
		res.json(apiRes);
	});

});

router.get('/api/alltenanttickets', function (req, res) {
	//req.query.id  should contain the user id
	//query User, Tenant & Property and return all info except password
	var email = req.query.email;
	var apiRes = new ApiResponse({
		api: 'api/alltenanttickets'
	});
	query.getAllTenantTickets(email).then(function (succ) {
		//console.log(succ);
		if (succ.status == 'found') {
			apiRes.success = true;
			apiRes.info = succ.data;
		} else {
			apiRes.success = false;
			apiRes.message = succ.status;
			apiRes.info = succ.error;
		}
		res.json(apiRes);
	}, function (err) {
		apiRes.success = false;
		apiRes.message = 'Get all tenant tickets failed';
		apiRes.info = err;
		res.json(apiRes);
	});

});


router.post('/api/savemanagerproperty', function (req, res) {
	console.log(req.body);
	var property = new Property(req.body.property);
	var mgrEmail = req.body.email;
	var apiRes = new ApiResponse({
		api: 'api/savemanagerproperty'
	});
	register.registerManagerProperty(mgrEmail, property).then(function (succ) {
		console.log(succ);
		apiRes.success = true;
		apiRes.info = succ.data;
		res.json(apiRes);
	}, function (err) {
		apiRes.success = false;
		apiRes.message = 'Save Manger property failed';
		apiRes.info = err;
		res.json(apiRes);
	});

});

router.post('/api/update/ticketstatus', function (req, res) {
	console.log(req.body);
	var ticket_id = req.body.ticket_id;
	var status_id = req.body.status_id;
	var apiRes = new ApiResponse({
		api: 'api/update/ticketstatus'
	});
	admin.updateTicketStatus(ticket_id, status_id).then(function (succ) {
		console.log(succ);
		apiRes.success = true;
		apiRes.info = succ.data;
		res.json(apiRes);
	}, function (err) {
		apiRes.success = false;
		apiRes.message = 'Update Ticket Status failed';
		apiRes.info = err;
		res.json(apiRes);
	});

});

router.get('/api/ticketinfo', function (req, res) {
	console.log(req.query);
	var ticket_id = req.query.ticket_id;
	var apiRes = new ApiResponse({
		api: 'api/ticketinfo'
	});
	query.getTicketInfo(ticket_id).then(function (succ) {
		console.log(succ);
		apiRes.success = true;
		apiRes.info = succ.data;
		res.json(apiRes);
	}, function (err) {
		apiRes.success = false;
		apiRes.message = 'Get Ticket Info for id = ' + ticket_id + ' failed';
		apiRes.info = err;
		res.json(apiRes);
	});
});

router.get('/api/contractor/tickets', function (req, res) {
	console.log(req.query);
	var contEmail = req.query.email;
	var apiRes = new ApiResponse({
		api: 'api/contractor/tickets'
	});
	query.getTicketsInContractorRegions(contEmail).then(function (succ) {
		console.log(succ);
		apiRes.success = true;
		apiRes.info = succ.data;
		res.json(apiRes);
	}, function (err) {
		apiRes.success = false;
		apiRes.message = 'Get Potential Jobs for Contractor ' + contEmail + ' failed';
		apiRes.info = err;
		res.json(apiRes);
	});

});

router.get('/api/allcontractorsinfo', function (req, res) {
	var apiRes = new ApiResponse({
		api: 'api/allcontractorsinfo'
	});
	query.getAllContractors().then(function (succ) {
		console.log(succ);
		if (succ.status == 'found') {
			apiRes.success = true;
			apiRes.info = succ.data;
		} else {
			apiRes.success = false;
			apiRes.message = succ.status;
			apiRes.info = succ.error;
		}
		res.json(apiRes);
	}, function (err) {
		apiRes.success = false;
		apiRes.message = 'Getting all contractor info failed';
		apiRes.info = err;
		res.json(apiRes);
	});

});

router.get('/api/admin/ticketsperday', function (req, res) {
	console.log(req.query);
	var apiRes = new ApiResponse({
		api: '/api/admin/ticketsperday'
	});
	admin.getTicketsPerDay().then(function (succ) {
		console.log(succ);
		apiRes.success = true;
		apiRes.info = succ.data;
		res.json(apiRes);
	}, function (err) {
		apiRes.success = false;
		apiRes.message = 'Get Summary of tickets per day failed';
		apiRes.info = err;
		res.json(apiRes);
	});

});
//----------------

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
// router.post('/api/testtoken', function (req, res) {
// 	//console.log(req.body.token );
// 	res.json(req.body.token + " " + req.decoded);
// });
router.post('/api/sendmail', function (req, res) {
	var smo = req.body.sendMailOptions;

	var apiRes = new ApiResponse({
		api: 'api/sendmail'
	});
	console.log(req.body);
	mailer.sendMail(smo.from,
			smo.to,
			smo.subject,
			smo.text,
			smo.html)
		.then(function (succ) {
			console.log(succ);
			apiRes.success = true;
			apiRes.message = succ;
			res.json(apiRes);
		}, function (err) {
			console.log(err);
			apiRes.success = false;
			apiRes.message = err.message;
			apiRes.info = err.error;
			res.json(apiRes);
		});
});

router.post('/sendmailcontactus', function (req, res) {
	var smo = req.body.sendMailOptions;

	var apiRes = new ApiResponse({
		api: '/sendmailcontactus'
	});
	console.log(req.body);
	mailer.sendMail(smo.from,
			smo.to,
			smo.subject,
			smo.text,
			smo.html)
		.then(function (succ) {
			console.log(succ);
			apiRes.success = true;
			apiRes.message = succ;
			res.json(apiRes);
		}, function (err) {
			console.log(err);
			apiRes.success = false;
			apiRes.message = err.message;
			apiRes.info = err.error;
			res.json(apiRes);
		});
});

module.exports = router;
