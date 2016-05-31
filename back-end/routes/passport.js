var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var config = require('./config').Config;
var mysql = require('mysql');
var bcrypt = require('bcrypt');
//var mysqlUtil = require('./mysqlUtil');

var db = {
  authenticate: function(email, password, cb) {
    var con = mysql.createConnection({
      host: "digitalcrafts.clvgcq4efcg3.us-west-2.rds.amazonaws.com",
      database: "ticketfix",
      user: "cjenk",
      passsword: "cjenk001"
    });
    con.connect();
    con.query('select password from user where email= ?', [email], function(err, rows, fields) {
       if (!err && rows.length == 1) {
         //now compare the password.

       }
    });
    con.end();
    // database dummy - find user and verify password
    if (username === 'devils name' && password === '666') {
      cb(null, {
        id: 666,
        firstname: 'devils',
        lastname: 'name',
        email: 'devil@he.ll',
        verified: true
      });
    } else {
      cb(null, false);
    }
  }
};

// Setup work and export for the JWT passport strategy
module.exports = function(passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    //need the mysql equivalent

    //
    User.findOne({id: jwt_payload.id}, function(err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  }));
};
