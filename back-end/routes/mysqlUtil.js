var Q = require('q');
var mysql = require('mysql');
var dbConfig = require('./config');
// console.log(dbConfig.mysql.username);
// console.log(dbConfig.mysql.database);
var pool = mysql.createPool({
	connectionLimit: dbConfig.mysql.pool.connectionLimit, //important
	host: dbConfig.mysql.host,
	user: dbConfig.mysql.username,
	password: dbConfig.mysql.password,
	database: dbConfig.mysql.database,
	debug: dbConfig.mysql.debug
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
// var getUser = function (email) {
//   // console.log(email);
//   var deferred = Q.defer();
// 	Q.fcall(con)
// 		.then(function (con) {
// 			//deferred.resolve(userQuery(con, email));
//       con.query("SELECT * FROM user WHERE email = ?", [email], function (err, rows) {
//     		if (err) {
//     			deferred.reject(err);
//     		} else {
//     			deferred.resolve(rows);
//     		}
//     	});
// 		})
// 		.catch(function (error) {
//       console.log(error);
//       deferrred.reject(error);
//     })
// 		.done();
//
// 	return deferred.promise;
// };

exports.pool = pool;
exports.con = con;
//exports.getUser = getUser;
