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
//Given a user's email query User, Tenant & Property and return all info except password
exports.getTenantInfo = function(email) {
    var deferred = Q.defer();
    var queryString = "select user.id as user_id, email, first_name, last_name, home_phone, mobile_phone, " +
        " tenant.property_id as property_id, property.code, address1, address2, city, state, zip, floor_plan_code, image " +
        " from user " +
        " left join tenant on user.id = tenant.user_id " +
        " left join property on tenant.property_id = property.id " +
        " left join type_floorplan on property.floor_plan_code = type_floorplan.code " +
        " where user.email = ?";
    Q.fcall(db.con)
        .then(function(con) {
            con.query(queryString, [email], function(err, rows) {
                if (err) {
                    deferred.reject({
                        status: 'error',
                        data: '',
                        error: err
                    });
                } else if (rows.length > 0) {
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
        .catch(function(error) {
            console.log('getTenantInfo error occurred');
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
exports.getAllTenants = function() {
    var deferred = Q.defer();
    var queryString = "select email, first_name, last_name, home_phone, mobile_phone, " +
        " code, address1, address2, city, state, zip " +
        " from tenant " +
        " left join user on user.id = tenant.user_id " +
        " left join property on tenant.property_id = property.id ";
    Q.fcall(db.con)
        .then(function(con) {
            con.query(queryString, function(err, rows) {
                con.release();
                if (err) {
                    deferred.reject({
                        status: 'error',
                        data: '',
                        error: err
                    });
                } else if (rows.length > 0) {
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
            console.log('getAllTenants error occurred');
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
// ----------- Manager focused queries below
/*
select email, first_name, last_name, home_phone, mobile_phone,
  account_address, account_city, account_state, account_zip
from user
left join manager on user.id = manager.user_id
left join account on manager.account_id = account.id
where user.email = 'curtis-manager2@me.com'
*/
exports.getManagerInfo = function(email) {
    var deferred = Q.defer();
    var queryString = "select user.id as user_id, email, first_name, last_name, home_phone, mobile_phone, " +
        " account_address, account_city, account_state, account_zip " +
        " from user " +
        " left join manager on user.id = manager.user_id " +
        " left join account on manager.account_id = account.id " +
        " where user.email = ?";
    Q.fcall(db.con)
        .then(function(con) {
            con.query(queryString, [email], function(err, rows) {
                if (err) {
                    deferred.reject({
                        status: 'error',
                        data: '',
                        error: err
                    });
                } else if (rows.length > 0) {
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
        .catch(function(error) {
            console.log('getManagerInfo error occurred');
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

exports.getManagerProperties = function(email) {
    var deferred = Q.defer();
    var queryString = "select user.id as user_id, email, first_name, last_name, home_phone, mobile_phone, " +
        " account_address, account_city, account_state, account_zip " +
        " from user " +
        " left join manager on user.id = manager.user_id " +
        " left join account on manager.account_id = account.id " +
        " where user.email = ?";
    Q.fcall(db.con)
        .then(function(con) {
            con.query(queryString, [email], function(err, rows) {
                if (err) {
                    deferred.reject({
                        status: 'error',
                        data: '',
                        error: err
                    });
                } else if (rows.length > 0) {
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
        .catch(function(error) {
            console.log('getManagerInfo error occurred');
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

exports.getAllManagerTickets = function(email) {
    var deferred = Q.defer();
    var queryString = "select property.*, ticket.* " +
        " from user " +
        " left join manager on user.id = manager.user_id " +
        " left join manager_has_property on manager.id = manager_has_property.manager_id " +
        " left join property on property.id = manager_has_property.property_id " +
        " left join ticket on ticket.property_id = property.id " +
        " where user.email = ?";

    Q.fcall(db.con)
        .then(function(con) {
            con.query(queryString, [email], function(err, rows) {
                if (err) {
                    deferred.reject({
                        status: 'error',
                        data: '',
                        error: err
                    });
                } else if (rows.length > 0) {
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
        .catch(function(error) {
            console.log('getAllManagerTickets error occurred');
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
