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
var account_id;
var manager_has_property_id;

var registerManagerProperty = function (email, property) {
	console.log("---------registerManagerProperty--------------");
	property.genKey();
	property.genCode();
	var finalDeferred = Q.defer();
	connection.beginTransaction()
		.then(function (con) {
			console.log("-Transaction started yes --------");
			return connection.query("SELECT manager.id FROM user LEFT JOIN manager on manager.user_id = user.id WHERE email = ?", email);
		})
		.then(function (rows) {
			user_id = rows[0].id;
			var queryString = "INSERT INTO property SET ? ON DUPLICATE KEY UPDATE isManaged = 1";
			return connection.query(queryString, [property]);
		})
		.then(function (res) {
			console.log("-UPSERT complete --------");
			property_id = res.insertId;
			var mhp = new ManagerHasProperty();
			mhp.property_id = property_id;
			mhp.manager_id = user_id;
			return connection.query('INSERT INTO manager_has_property SET ?', [mhp], function(err, result){
				if (err) {
					console.log(err);
					finalDeferred.reject({
						status: 'duplicate',
						message: 'error inserting manager_has_property.'
					});
				} else {
					finalDeferred.resolve({});
				}
			});
		})
		.then(function (res) {
			console.log("committing work!");
			connection.commit();
			finalDeferred.resolve({
				status: 'complete',
				data: {
					manager_id: user_id,
					property_id: property_id
				}
			});
		})
		.catch(function (e) {
			console.log(e);
			console.log("rollback");
			connection.rollback();
			finalDeferred.reject({
				status: 'rollback',
				message: e.message,
				data: e.data
			});
		})
		.done(function (d) {
			console.log("Done");
		});

	return finalDeferred.promise;
};
/*
	Q.fcall(db.con)
		.then(function (con) {
			//console.log(account);
			property.genKey();
			property.genCode();
			con.query("INSERT INTO property SET ?", [property], function (err, result) {
				con.release();
				if (!err) {
					deferred.resolve({
						status: 'complete',
						data: {
							id: result.insertId
						},
						message: ''
					});

				} else {
					console.log(property);
					console.log(err);
					deferred.reject({
						status: 'error',
						data: {},
						message: "sql error",
						error: err
					});
				}
			});
		})
		.catch(function (error) {
			console.log('saveproperty error occurred');
			console.log(error);
			console.log(' ------------------------ ');
			deferrred.reject(error);
		})
		.done();
	return deferred.promise;
};
*/

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
					status: 'found',
					message: 'User Already Exists'
				});
				return deferred.promise;
			}
			var x = user.hashPassword().then(function (hash) {
				user.password = hash;
			});
			return x; //return the promise to be evaluated later down the chain

		})
		.then(function (res) {
			return connection.query("INSERT INTO user SET ?", [user]);
		})
		.then(function (res) {
			user_id = res.insertId;
			console.log("insert id = " + user_id);
			return connection.query("INSERT INTO property SET ?", property);
		})
		.then(function (res) {
			var tenant = new Tenant({
				user_id: user_id,
				property_id: res.insertId
			});
			return connection.query("INSERT INTO tenant SET ?", [tenant]);
		})
		.then(function (res) {
			console.log("committing work!");
			connection.commit();
			finalDeferred.resolve({
				status: 'complete',
				data: {
					id: user_id
				}
			});
		})
		.catch(function (e) {
			console.log(e);
			console.log("rollback");
			connection.rollback();
			finalDeferred.reject({
				status: 'rollback',
				message: e.message,
				data: e.data
			});
		})
		.done(function (d) {
			console.log("Done");
		});


	return finalDeferred.promise;
};
//--------------------------------
var registermanager = function (user, account) {
	console.log("manager flow - new");
	account.genCode();
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
					status: 'found',
					message: 'User Already Exists'
				});
				return deferred.promise;
			}
			var x = user.hashPassword().then(function (hash) {
				user.password = hash;
			});
			return x; //return the promise to be evaluated later down the chain

		})
		.then(function (res) {
			return connection.query("INSERT INTO user SET ?", [user]);
		})
		.then(function (res) {
			user_id = res.insertId;
			console.log('insert account');
			return connection.query("INSERT INTO account SET ?", account);
		})
		.then(function (res) {
			account_id = res.insertId;
			console.log("Account insert id = " + account_id);
			console.log('Now insert manager');
			var manager = new Manager();
			manager.account_id = account_id;
			manager.user_id = user_id;
			return connection.query("INSERT INTO manager SET ?", manager);
		})
		.then(function (res) {
			console.log('----- after insert manager ---');
			console.log(res);
			console.log("committing work!");
			connection.commit();
			finalDeferred.resolve({
				status: 'complete',
				data: {
					id: user_id
				}
			});
		})
		.catch(function (e) {
			console.log(e);
			console.log("rollback");
			connection.rollback();
			finalDeferred.reject({
				status: e.status,
				message: e.message,
				data: e.data
			});
		})
		.done(function (d) {
			console.log("Done");
		});


	return finalDeferred.promise;
};
//--------------------------------
var registercontractor = function (user, account, contractor) {
	console.log("manager flow - new");
	account.genCode();
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
					status: 'found',
					message: 'User Already Exists'
				});
				return deferred.promise;
			}
			var x = user.hashPassword().then(function (hash) {
				user.password = hash;
			});
			return x; //return the promise to be evaluated later down the chain

		})
		.then(function (res) {
			return connection.query("INSERT INTO user SET ?", [user]);
		})
		.then(function (res) {
			user_id = res.insertId;
			console.log('insert account');
			return connection.query("INSERT INTO account SET ?", account);
		})
		.then(function (res) {
			account_id = res.insertId;
			console.log("Account insert id = " + account_id);
			console.log('Now insert contractor');
			contractor.user_id = user_id;
			contractor.account_id = account_id;
			return connection.query("INSERT INTO contractor SET ?", contractor);
		})
		.then(function (res) {
			console.log('----- after insert contractor ---');
			console.log(res);
			console.log("committing work!");
			connection.commit();
			finalDeferred.resolve({
				status: 'complete',
				data: {
					id: user_id
				}
			});
		})
		.catch(function (e) {
			console.log(e);
			console.log("rollback");
			connection.rollback();
			finalDeferred.reject({
				status: e.status,
				message: e.message,
				data: e.data
			});
		})
		.done(function (d) {
			console.log("Done");
		});


	return finalDeferred.promise;
};

exports.registertenant = registertenant;
exports.registermanager = registermanager;
exports.registercontractor = registercontractor;
exports.registerManagerProperty = registerManagerProperty;
