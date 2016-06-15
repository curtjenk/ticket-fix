var db = require('./mysqlUtil');
var util = require('./util');
var User = require('./models/user');
var Account = require('./models/account');
var Manager = require('./models/manager').Manager;
var ManagerHasProperty = require('./models/manager').ManagerHasProperty;
var Contractor = require('./models/contractor');
var Property = require('./models/property');
var Tenant = require('./models/tenant');
var Ticket = require('./models/ticket');

var ufuncs = require('./userFuncs');
var query = require('./queryFuncs');

var Q = require('q');

exports.getTicketsPerDay = function() {
	var deferred = Q.defer();
	var queryString ="SELECT DATE(date_create) DateOnly, count(*) AS num" +
		"   FROM ticket where date_create is not null group by DateOnly";
	Q.fcall(db.con)
		.then(function(con) {
			console.log('------------- getTicketsPerDay-----1 ------');
			con.query(queryString, function(err, rows) {
				con.release();
				if (err) {
					console.log(err);
					deferred.reject({
						status: 'error',
						data: '',
						error: err
					});
				} else if (rows.length > 0) {
					console.log('----------getTicketsPerDay ---- 2--------');
					console.log(rows.length);
					deferred.resolve({
						status: 'found',
						data: rows,
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
		.catch(function(error) {
			console.log('getTicketsPerDay error occurred');
			console.log(error);
			console.log(' ------------------------ ');
			deferred.reject({
				status: 'criticalerror',
				data: '',
				error: error
			});
		})
		.done();
	return deferred.promise;
};

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

var saveaccount = function (account) {
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
	console.log(ticket.details_json);
	ticket.details_json = JSON.stringify(ticket.details_json);
	ticket.markers_json = JSON.stringify(ticket.markers_json);

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
					console.log(err);
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

/**
 * You first need to create a formatting function to pad numbers to two digits…
 **/
function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}

/**
 * …and then create the method to output the date string as desired.
 * Some people hate using prototypes this way, but if you are going
 * to apply this to more than one Date object, having it as a prototype
 * makes sense.
 **/
Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};
