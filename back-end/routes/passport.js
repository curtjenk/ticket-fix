

// Setup work and export for the JWT passport strategy
module.exports = function(req, res, next) {
  var token = req.body && req.body.access_token;
  if (token) {
  try {
    var decoded = jwt.decode(token, config.secret);

    // handle token here

  } catch (err) {
    return next();
  }
} else {
  next();
}

};
