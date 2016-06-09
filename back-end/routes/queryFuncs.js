var db = require('./mysqlUtil');
var util = require('./util');
var Q = require('q');
/*
select email, first_name, last_name, home_phone, mobile_phone,
  code, address1, address2, city, state, zip
from user
left join tenant on user.id = tenant.user_id
left join property on tenant.property_id = property.id
where user.id = 95


*/
//Given a user's id query User, Tenant & Property and return all info except password
exports.getTenantInfo = function (id) {
	var deferred = Q.defer();
	var queryString = "select email, first_name, last_name, home_phone, mobile_phone, " +
	  	" code, address1, address2, city, state, zip " +
		" from user " +
		" left join tenant on user.id = tenant.user_id " +
		" left join property on tenant.property_id = property.id " +
		" where user.id = ?";
	Q.fcall(db.con)
		.then(function (con) {
			con.query(queryString, [id], function (err, rows) {
				if (err) {
					deferred.reject({status: 'error', data: '', error: err});
				} else if (rows.length > 0) {
						deferred.resolve({status: 'found', data: rows[0], error: ''});
				} else {
					deferred.resolve({status: 'notfound', data: '', error: ''});
				}
			});
		})
		.catch(function (error) {
			console.log('getTenantInfo error occurred');
			console.log(error);
			console.log(' ------------------------ ');
			deferrred.reject({status: 'criticalerror', data: '', error: error});
		})
		.done();
	return deferred.promise;
};
