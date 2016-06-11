var db = require('./mysqlUtil');
var util = require('./util');
var User = require('./models/account');
var Manager = require('./models/manager');
var Property = require('./models/property');
var ufuncs = require('./userFuncs');
var query = require('./queryFuncs');

var Q = require('q');

var registertenant = function(user, property) {

};

exports.registertenant = registertenant;
// exports.registermanager = registermanager;
// exports.registercontractor = registertenant;

exports.getproperty = function (key) {
	var deferred = Q.defer();
	Q.fcall(db.con)
		.then(function (con) {
			con.query("SELECT * FROM property WHERE prop_key = ?", [key], function (err, rows) {
				con.release();
				console.log(rows);
				if (err) {
					deferred.reject({
						status: 'error',
						data: '',
						error: err
					});
				} else if (rows.length > 0) {
					console.log('found');
					deferred.resolve({
						status: 'found',
						data: rows[0],
						error: ''
					});
				} else {
					deferred.resolve({
						status: 'notfound',
						data: '',
						error: ''
					});
				}
			});
		})
		.catch(function (error) {
			console.log('getproperty error occurred');
			console.log(error);
			console.log(' ------------------------ ');
			deferrred.reject({
				status: 'criticalerror',
				data: '',
				error: error
			});
		})
		.done();
	return deferred.promise;
};

exports.getAccountById = function (id) {
	var deferred = Q.defer();
	Q.fcall(db.con)
		.then(function (con) {
			con.query("SELECT * FROM account WHERE id = ?", [id], function (err, rows) {
				con.release();
				if (err) {
					deferred.reject(err);
				} else if (rows.length > 0) {
					deferred.resolve(rows[0]);
				} else {
					deferred.resolve(false);
				}
			});
		})
		.catch(function (error) {
			console.log('getAccountById error occurred');
			console.log(error);
			console.log(' ------------------------ ');
			deferrred.reject(error);
		})
		.done();
	return deferred.promise;
};

exports.getAccounts = function () {
	con.release();
	var deferred = Q.defer();
	Q.fcall(db.con)
		.then(function (con) {
			con.query("SELECT * FROM account", function (err, rows) {
				con.release();
				if (err) {
					deferred.reject(err);
				} else if (rows.length > 0) {
					deferred.resolve(rows);
				} else {
					deferred.resolve(false);
				}
			});
		})
		.catch(function (error) {
			console.log('getAccounts error occurred');
			console.log(error);
			console.log(' ------------------------ ');
			deferrred.reject(error);
		})
		.done();
	return deferred.promise;
};

var saveaccount  = function (account) {
	var deferred = Q.defer();
	Q.fcall(db.con)
		.then(function (con) {
			account.genCode();
			//console.log(account);
			con.query("INSERT INTO account SET ?", account, function (err, result) {
				con.release();
				if (!err) {
					deferred.resolve({
						id: result.insertId
					});
				} else {
					deferred.reject(err);
				}
			});
		})
		.catch(function (error) {
			console.log('getAccounts error occurred');
			console.log(error);
			console.log(' ------------------------ ');
			deferrred.reject(error);
		})
		.done();
	return deferred.promise;
};

var savemanager = function (manager) {
	var deferred = Q.defer();
	Q.fcall(db.con)
		.then(function (con) {
			//console.log(account);
			con.query("INSERT INTO manager SET ?", manager, function (err, result) {
				con.release();
				if (!err) {
					deferred.resolve({
						id: result.insertId
					});
				} else {
					deferred.reject(err);
				}
			});
		})
		.catch(function (error) {
			console.log('savemanager error occurred');
			console.log(error);
			console.log(' ------------------------ ');
			deferrred.reject(error);
		})
		.done();
	return deferred.promise;
};

var savetenant = function (tenant) {
	var deferred = Q.defer();
	Q.fcall(db.con)
		.then(function (con) {
			//console.log(account);
			con.query("INSERT INTO tenant SET ?", tenant, function (err, result) {
				con.release();
				if (!err) {
					deferred.resolve({
						id: result.insertId
					});
				} else {
					deferred.reject(err);
				}
			});
		})
		.catch(function (error) {
			console.log('savetenant error occurred');
			console.log(error);
			console.log(' ------------------------ ');
			deferrred.reject(error);
		})
		.done();
	return deferred.promise;
};

var saveproperty = function (property) {
	var deferred = Q.defer();
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

var savecontractor = function (contractor) {
	var deferred = Q.defer();
	Q.fcall(db.con)
		.then(function (con) {
			//console.log(account);
			con.query("INSERT INTO contractor SET ?", contractor, function (err, result) {
				con.release();
				if (!err) {
					deferred.resolve({
						id: result.insertId
					});
				} else {
					deferred.reject(err);
				}
			});
		})
		.catch(function (error) {
			console.log('savecontractor error occurred');
			console.log(error);
			console.log(' ------------------------ ');
			deferrred.reject(error);
		})
		.done();
	return deferred.promise;
};

exports.saveticket = function (ticket) {
	var deferred = Q.defer();
	Q.fcall(db.con)
		.then(function (con) {
			//console.log(account);
			con.query("INSERT INTO ticket SET ?", ticket, function (err, result) {
				con.release();
				if (!err) {
					deferred.resolve({
						id: result.insertId
					});
				} else {
					deferred.reject(err);
				}
			});
		})
		.catch(function (error) {
			console.log('saveticket error occurred');
			console.log(error);
			console.log(' ------------------------ ');
			deferrred.reject(error);
		})
		.done();
	return deferred.promise;
};
