var Q = require('q');
var bcrypt = require('bcrypt');
var bcryptSaltRounds = 10;

var User = function (data) {
	data = data || {};
	this.id = data.id;
	this.email = data.email;
	this.username = data.username;
	this.password = data.password;
	this.type_user_id = data.type_user_id;
	this.property_code = data.property_code;
	this.first_name = data.first_name;
	this.last_name = data.last_name;
	this.home_phone = data.home_phone;
	this.mobile_phone = data.mobile_phone;
	if (data.create_time) {
		this.create_time = data.create_time;
	}
};
User.prototype.hashPassword = function () {
	console.log('hashpassword');
	var deferred = Q.defer();
	var promise = bcrypt.hash(this.password, bcryptSaltRounds, function (err, hash) {
		if (err) {
			deferred.reject(err);
		} else {
			this.password = hash;
			// console.log(this.password);
			deferred.resolve(hash);
		}
	});
	return deferred.promise;
};
User.prototype.passwordMatch = function (password) {
	console.log("trying to authenticate the user");
	console.log(this.password);
	console.log(password);
	var deferred = Q.defer();
	var promise = bcrypt.compare(password, this.password, function (err, res) {
		if (err) {
			deferred.reject(err);
		} else {
			console.log("passwords match = " + res);
			deferred.resolve(res);
		}
	});
	return deferred.promise;
};

module.exports = User;
