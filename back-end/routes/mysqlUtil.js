var mysql = require('mysql');
var dbConfig = require('./config').Config;

// pool.getConnection(function(err, connection) {
//     if (err) {
//         connection.release();
//         console.log({ "code": 100, "status": "Error in connection database" });
//         process.exit();
//     }
//
//     console.log('connected as id ' + connection.threadId);
//
//     connection.query("select * from wp_posts", function(err, rows) {
//         connection.release();
//         if (!err) {
//             //console.log(rows);
//             for (i = 0; i < rows.length; i++) {
//                 console.log(rows[i].ID);
//             }
//
//         } else {
//             console.log(err);
//         }
//         process.exit();
//     });
//
//     connection.on('error', function(err) {
//         console.log({ "code": 100, "status": "Error in connection database" });
//         process.exit();
//     });
//
// });

var createConnectionPool = function() {
    return mysql.createPool({
        connectionLimit: dbConfig.mysql.pool.connectionLimit, //important
        host: dbConfig.mysql.host,
        user: dbConfig.mysql.username,
        password: dbConfig.mysql.password,
        database: dbConfig.mysql.database,
        debug: dbConfig.mysql.debug
    });
};

var getConnection = function(pool) {
    pool.getConnection(function(err, connection) {
        if (err) {
            connection.release();
        }

        console.log('connected as id ' + connection.threadId);
    });
};

//module.exports = mysqlUtil;
