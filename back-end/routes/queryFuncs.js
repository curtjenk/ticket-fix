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
        " INNER JOIN tenant on user.id = tenant.user_id " +
        " left join property on tenant.property_id = property.id " +
        " left join type_floorplan on property.floor_plan_code = type_floorplan.code " +
        " where user.email = ?";
    Q.fcall(db.con)
        .then(function(con) {
            con.query(queryString, [email], function(err, rows) {
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
            deferred.reject({
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
            deferred.reject({
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
        " INNER JOIN manager on user.id = manager.user_id " +
        " left join account on manager.account_id = account.id " +
        " where user.email = ?";
    Q.fcall(db.con)
        .then(function(con) {
            con.query(queryString, [email], function(err, rows) {
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
            deferred.reject({
                status: 'criticalerror',
                data: '',
                error: error
            });
        })
        .done();
    return deferred.promise;
};


exports.getAllManagers = function() {
    var deferred = Q.defer();
    var queryString = "select user.id as user_id, email, first_name, last_name, home_phone, mobile_phone, " +
        " account_name, account_address, account_city, account_state, account_zip, manager.id,  coalesce(theCount,0) AS property_count " +
        " from user " +
        " INNER JOIN manager on  manager.user_id = user.id" +
        " INNER JOIN account on manager.account_id = account.id " +
        " LEFT JOIN (select manager_id, count(*) as theCount from manager_has_property group by manager_id) a on a.manager_id = manager.id  ";

    // select user.id as user_id, email, first_name, last_name, home_phone, mobile_phone,
    //     account_address, account_city, account_state, account_zip
    // from user
    // INNER JOIN manager on user.id = manager.user_id
    // left join account on manager.account_id = account.id

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
            console.log('getAllManagers error occurred');
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
/*
select property.*
from user
  left join manager on user.id = manager.user_id
  left join manager_has_property on manager.id = manager_has_property.manager_id
  left join property on property.id = manager_has_property.property_id
where user.email =  'test2@ticketfixme.com'

*/
exports.getManagerProperties = function(email) {
    var deferred = Q.defer();
    var queryString = "select  property.*, manager.* " +
        " from user " +
        " INNER JOIN manager on user.id = manager.user_id " +
        " left join manager_has_property on manager.id = manager_has_property.manager_id  " +
        " left join property on property.id = manager_has_property.property_id " +
        " where user.email = ?  ORDER BY property.id desc";
    Q.fcall(db.con)
        .then(function(con) {
            con.query(queryString, [email], function(err, rows) {
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
            console.log('getManagerInfo error occurred');
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

exports.getAllManagerTickets = function(email) {
    var deferred = Q.defer();
    var queryString = "select ticket.id as ticket_id, property.*, ticket.*, type_status.code as ticket_status" +
        " from user " +
        " INNER JOIN manager on user.id = manager.user_id " +
        " INNER JOIN manager_has_property on manager.id = manager_has_property.manager_id " +
        " INNER JOIN property on property.id = manager_has_property.property_id " +
        " INNER JOIN ticket on ticket.property_id = property.id " +
        " INNER JOIN type_status on type_status.id = ticket.status_id " +
        " where user.email = ? ORDER BY ticket.client_datetime_string DESC";

    Q.fcall(db.con)
        .then(function(con) {
            con.query(queryString, [email], function(err, rows) {
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
            console.log('getAllManagerTickets error occurred');
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

exports.getAllTenantTickets = function(email) {
    var deferred = Q.defer();
    var queryString = "select ticket.id as ticket_id, property.*, ticket.*, type_status.code as ticket_status" +
        " from user " +
        " left join tenant on tenant.user_id = user.id " +
        " left join property on property.id = tenant.property_id " +
        " left join ticket on ticket.property_id = property.id " +
        " left join type_status on type_status.id = ticket.status_id " +
        " where user.email = ?" +
        " order by client_datetime_string DESC";

    Q.fcall(db.con)
        .then(function(con) {
            console.log('---------------- HERE -----1 ------');
            con.query(queryString, [email], function(err, rows) {
                con.release();
                if (err) {
                    deferred.reject({
                        status: 'error',
                        data: '',
                        error: err
                    });
                } else if (rows.length > 0) {
                    console.log('---------------- HERE ---- 2--------');
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
            console.log('getAllTenantTickets error occurred');
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

exports.getTicketsInContractorRegions = function(email) {
    var deferred = Q.defer();
    var queryString = "select tick.*" +
        " from user, contractor, " +
        "   (select property.zip, property.id as property_id, address1, address2, city, " +
        "       state, ticket.id as ticket_id, ticket.issue_description, ticket.client_datetime_string, type_status.code AS ticket_status," +
        "       manager.id as prop_manager_id, " +
        "       user.email AS manager_email, user.first_name AS manager_first_name, " +
        "       user.last_name AS manager_last_name, user.home_phone AS manager_phone " +
        "     from ticket " +
        "     inner join type_status on type_status.id = ticket.status_id " +
        "     inner join property on property.id = ticket.property_id " +
        "     inner join manager_has_property mhp on mhp.property_id = property.id " +
        "     inner join manager on manager.id = mhp.manager_id " +
        "     INNER join user on user.id = manager.user_id) tick " +
        "  where user.email = ? " +
        "  and contractor.user_id = user.id " +
        "  and (tick.zip = contractor.region_1_zip " +
        "   or tick.zip = contractor.region_2_zip " +
        "   or tick.zip = contractor.region_3_zip)";

    Q.fcall(db.con)
        .then(function(con) {
            console.log('------------- getTicketsInContractorRegions-----1 ------');
            con.query(queryString, [email], function(err, rows) {
                con.release();
                if (err) {
                    console.log(err);
                    deferred.reject({
                        status: 'error',
                        data: '',
                        error: err
                    });
                } else if (rows.length > 0) {
                    console.log('----------getTicketsInContractorRegions ---- 2--------');
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
            console.log('getTicketsInContractorRegions error occurred');
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

exports.getTicketInfo = function(ticket_id) {
    var deferred = Q.defer();
    var queryString = "SELECT ticket.*, type_floorplan.image AS floorplan_image FROM ticket, property, type_floorplan" +
        " where ticket.id = ? and ticket.property_id = property.id and type_floorplan.code = property.floor_plan_code";
    Q.fcall(db.con)
        .then(function(con) {
            console.log('---------------- getTicketInfo -----1 ------');
            con.query(queryString, [ticket_id], function(err, rows) {
                con.release();
                if (err) {
                    deferred.reject({
                        status: 'error',
                        data: '',
                        error: err
                    });
                } else if (rows.length > 0) {
                    console.log('---------------- getTicketInfo ---- 2--------');
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
            console.log('getTicketInfo error occurred');
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


exports.getAllContractors = function(email) {
    var deferred = Q.defer();
    var queryString = " select email, first_name, last_name, home_phone, mobile_phone, account_name " +
       " from contractor " +
       " left join user on user.id = contractor.user_id " +
       " left join account on account.id = contractor.account_id";


    Q.fcall(db.con)
        .then(function(con) {
            console.log('---------------- HERE -----1 ------');
            con.query(queryString, [email], function(err, rows) {
                con.release();
                if (err) {
                    deferred.reject({
                        status: 'error',
                        data: '',
                        error: err
                    });
                } else if (rows.length > 0) {
                    console.log('---------------- HERE ---- 2--------');
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
            console.log('getAllContractors error occurred');
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
