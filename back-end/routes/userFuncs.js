var db = require('./mysqlUtil');
var User = require('./models/user');
var bcrypt = require('bcrypt');
var Q = require('q');

var getUser = function (email, authOrReg) {
	var deferred = Q.defer();
	Q.fcall(db.con)
		.then(function (con) {
			//deferred.resolve(userQuery(con, email));
			con.query("SELECT * FROM user WHERE email = ?", [email], function (err, rows) {
				if (err) {
					deferred.reject(err);
				} else if (rows.length > 0) {
					// console.log(rows[0]);
					if (authOrReg === 'register') {
						deferred.reject("user-already-exists");
					} else {
						deferred.resolve(rows[0]);
					}
				} else {
					deferred.resolve(false);
				}
			});
		})
		.catch(function (error) {
			console.log('getUser error occurred');
			console.log(error);
			console.log(' ------------------------ ');
			deferrred.reject(error);
		})
		.done();
	return deferred.promise;
};

exports.getUser = getUser;

exports.saveUser = function (user) {
	var deferred = Q.defer();
	getUser(user.email, 'register')
		.then(function (blah) {
			var x = user.hashPassword().then(function (hash) {
				user.password = hash;
			});
			return x; //return the promise to be evaluated later down the chain
		})
		.then(function () {
			return db.con();
		})
		.then(function (con) {
			console.log(user);
			var query = con.query("INSERT INTO user SET ?", user, function (err, result) {
				// console.log(err);
				// console.log(result);
				if (!err) {
					deferred.resolve({id: result.insertId});
				} else {
					deferred.reject(err);
				}
			});
			// console.log(query.sql);
		})
		.fail(function (err) {
			// console.log('--- save user REJECT ----');
			// console.log(err);
			deferred.reject(err);
		})
		.done();
	return deferred.promise;
};

exports.authenticateUser = function (email, password) {
	var deferred = Q.defer();

	var promise = getUser(email).then(
		function (row) {
			// console.log(row);
			if (row !== false) {
				var user = new User(row); //mapUser(row);
				user.passwordMatch(password).then(function (res) {
					if (res) {
						//console.log("passwords match");
						deferred.resolve(user);
					} else {
						//console.log("passwords DO NOT match");
						deferred.reject("Invalid Email and Password combination");
					}
				}, function (err) {
					deferred.reject(err);
				});
			} else {
				deferred.reject("User unknown");
			}
		},
		function (err) {
			console.log(err);
			deferred.reject(err);
		});

	return deferred.promise;
};
