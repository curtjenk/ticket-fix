var db = require('./mysqlUtil');
var util = require('./util');
var User = require('./models/account');
var Manager = require('./models/manager');
var Property = require('./models/property');
var Q = require('q');

exports.getAccountById = function (id) {
	var deferred = Q.defer();
	Q.fcall(db.con)
		.then(function (con) {
			con.query("SELECT * FROM account WHERE id = ?", [id], function (err, rows) {
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
	var deferred = Q.defer();
	Q.fcall(db.con)
		.then(function (con) {
			con.query("SELECT * FROM account", function (err, rows) {
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
//	var query = con.query("INSERT INTO user SET ?", user, function (err, result)
exports.saveaccount = function (account) {
	var deferred = Q.defer();
	Q.fcall(db.con)
		.then(function (con) {
			account.genCode();
			//console.log(account);
			con.query("INSERT INTO account SET ?", account, function (err, result) {
				if (!err) {
					deferred.resolve({id: result.insertId});
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

exports.savemanager = function (manager) {
	var deferred = Q.defer();
	Q.fcall(db.con)
		.then(function (con) {
			//console.log(account);
			con.query("INSERT INTO manager SET ?", manager, function (err, result) {
				con.release();
				if (!err) {
					deferred.resolve({id: result.insertId});
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

exports.savetenant = function (tenant) {
	var deferred = Q.defer();
	Q.fcall(db.con)
		.then(function (con) {
			//console.log(account);
			con.query("INSERT INTO tenant SET ?", tenant, function (err, result) {
				con.release();
				if (!err) {
					deferred.resolve({id: result.insertId});
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

exports.saveproperty = function (property) {
	var deferred = Q.defer();
	Q.fcall(db.con)
		.then(function (con) {
			//console.log(account);
			property.genCode();
			con.query("INSERT INTO property SET ?", property, function (err, result) {
				con.release();
				if (!err) {
					deferred.resolve({id: result.insertId});
				} else {
					deferred.reject(err);
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

exports.savecontractor = function (contractor) {
	var deferred = Q.defer();
	Q.fcall(db.con)
		.then(function (con) {
			//console.log(account);
			con.query("INSERT INTO contractor SET ?", contractor, function (err, result) {
				con.release();
				if (!err) {
					deferred.resolve({id: result.insertId});
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
					deferred.resolve({id: result.insertId});
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
