var mysql = require('promise-mysql');
var config = require('./config');
var Q = require('q');

var User = require('./models/user');
var Account = require('./models/account');
var Manager = require('./models/manager').Manager;
var ManagerHasProperty = require('./models/manager').ManagerHasProperty;
var Contractor = require('./models/contractor');
var Property = require('./models/property');
var Tenant = require('./models/tenant');

var connection;
mysql.createConnection({
	host: config.mysql.host,
	user: config.mysql.username,
	password: config.mysql.password,
	database: config.mysql.database,
	debug: config.mysql.debug
}).then(function (conn) {
	connection = conn;
});

var user_id;
var property_id;
var registertenant = function (user, property) {
	console.log("tenant flow - new");
	property.genKey();
	property.genCode();
	var finalDeferred = Q.defer();
	connection.beginTransaction()
		.then(function (con) {
			console.log("yes");
			return connection.query("SELECT * FROM user WHERE email = ?", user.email);
		})
		.then(function (res) {
			console.log(res.length + " rows found");
			if (res.length > 0) {
				var deferred = Q.defer();
				deferred.reject({
					status: 'error',
					message: 'User Already Exists'
				});
				return deferred.promise;
			}
			return connection.query("INSERT INTO user SET ?", [user]);
		})
		.then(function (res) {
			user_id = res.insertId;
			console.log("insert id = " + user_id);
			return connection.query("INSERT INTO property SET ?", property);
		})
		.then(function(res){
			var tenant = new Tenant({
				user_id: user_id,
				property_id: res.insertId
			});
			return connection.query("INSERT INTO tenant SET ?", [tenant]);
		})
		.then(function(res){
			console.log("committing work!");
			connection.commit();
			finalDeferred.resolve({
				status: 'complete'
			});
		})
		.catch(function (e) {
			console.log("error occurred. rollback");
			connection.rollback();
			finalDeferred.resolve({
				status: 'error',
				message: e.message.toString()
			});
		})
		.done(function (d) {
			console.log("Done");
		});


		return finalDeferred.promise;
};

exports.registertenant = registertenant;
