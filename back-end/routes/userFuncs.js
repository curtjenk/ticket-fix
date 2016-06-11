var db = require('./mysqlUtil');
var User = require('./models/user');
var bcrypt = require('bcrypt');
var Q = require('q');

var getUser = function (email) {
	var deferred = Q.defer();
	Q.fcall(db.con)
		.then(function (con) {
			con.query("SELECT * FROM user WHERE email = ?", [email], function (err, rows) {
				con.release();
				if (err) {
					deferred.reject({
						status: 'error',
						error: err
					});
				} else if (rows.length > 0) {
					deferred.resolve({
						status: 'found',
						data: rows[0]
					});
				} else {
					deferred.resolve({
						status: 'notfound'
					});
				}
			});
		})
		.catch(function (error) {
			// console.log('getUser error occurred');
			// console.log(error);
			// console.log(' ------------------------ ');
			deferrred.reject({
				status: 'error',
				error: error
			});
		})
		.done();
	return deferred.promise;
};

var saveUser = function (user) {
	console.log('in saveUser');
	var deferred = Q.defer();
	getUser(user.email)
		.then(function (rtn) {
			if (rtn.status == 'notfound') {
				var x = user.hashPassword().then(function (hash) {
					user.password = hash;
				});
				return x; //return the promise to be evaluated later down the chain
			} else {
				return new Promise(function (resolve, reject){
					if (rtn.status == 'found') {
						reject({
							status: 'found',
							data: {},
							message: "User already exists"
						});
					} else {
						//rtn.status == 'error'
						reject({
							status: 'error',
							data: {},
							message: "sql error",
							error: rtn.error
						});
					}
				});
			}
		})
		.then(function () {
			return db.con();
		})
		.then(function (con) {
			// console.log(user);
			var query = con.query("INSERT INTO user SET ?", user, function (err, result) {
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
					console.log(err);
					deferred.reject({
						status: 'error',
						data: {},
						message: "sql error",
						error: err
					});
				}
			});
			// console.log(query.sql);
		})
		.fail(function (err) {
			console.log('--- save user REJECT ----');
			console.log(err);
			deferred.reject(err);
		})
		.done();
	return deferred.promise;
};

var authenticateUser = function (email, password) {
	var deferred = Q.defer();

	var promise = getUser(email).then(
		function (rtn) {
			if (rtn.status == 'found') {
				var user = new User(rtn.data); //mapUser(row);
				user.passwordMatch(password).then(function (res) {
					if (res) {
						// console.log("passwords match");
						deferred.resolve({
							status: 'ok',
							data: user,
							message: ''
						});
					} else {
						// console.log("passwords DO NOT match");
						deferred.resolve({
							status: 'nomatch',
							data: {},
							message: "passwords dont match"
						});
					}
				}, function (err) {
					deferred.reject({
						status: 'error',
						data: {},
						message: "BCrypt error",
						error: err
					});
				});
			} else {
				if (rtn.status == 'notfound') {
					deferred.resolve({
						status: 'notfound',
						data: {},
						message: "User Doesnt exist"
					});
				} else {
					//rtn.status == 'error'
					deferred.reject({
						status: 'error',
						data: {},
						message: "sql error",
						error: rtn.error
					});
				}

			}
		},
		function (err) {
			console.log(err);
			deferred.reject({
				status: 'error',
				data: {},
				message: "system error",
				error: err
			});
		});

	return deferred.promise;
};

exports.getUser = getUser;
exports.saveUser = saveUser;
exports.authenticateUser = authenticateUser;

// exports.authenticateUser = function (email, password) {
// 	var deferred = Q.defer();
//
// 	var promise = getUser(email).then(
// 		function (row) {
// 			if (row !== false) {
// 				var user = new User(row); //mapUser(row);
// 				user.passwordMatch(password).then(function (res) {
// 					if (res) {
// 						console.log("passwords match");
// 						deferred.resolve({status: 'ok', data: user, info: ''});
// 					} else {
// 						console.log("passwords DO NOT match");
// 						deferred.resolve({status: 'nomatch', data: {}, info: "passwords dont match"});
// 					}
// 				}, function (err) {
// 					deferred.reject({status: 'error', data: {}, info: "BCrypt error", error: err});
// 				});
// 			} else {
// 				deferred.resolve({status: 'nouser', data: {}, info: "User Doesnt exist"});
// 			}
// 		},
// 		function (err) {
// 			console.log(err);
// 			deferred.reject({status: 'error', data: {}, info: "system error", error: err});
// 		});
//
// 	return deferred.promise;
// };
