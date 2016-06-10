var Q = require('q');
var mysql = require('mysql');
var config = require('./config');
// console.log(config.mysql.username);
// console.log(config.mysql.database);
var pool = mysql.createPool({
	connectionLimit: config.mysql.pool.connectionLimit, //important
	host: config.mysql.host,
	user: config.mysql.username,
	password: config.mysql.password,
	database: config.mysql.database,
	debug: config.mysql.debug
});

var con = function () {
	var deferred = Q.defer();
	var promise = pool.getConnection(function (err, connection) {
		//console.log('called');
		if (err) {
			deferred.reject(undefined);
		} else {
			deferred.resolve(connection);
		}
	});
	return deferred.promise;
};

exports.pool = pool;
exports.con = con;
