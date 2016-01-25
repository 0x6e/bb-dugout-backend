var JwtStrategy = require('passport-jwt').Strategy;
 
// load up the coach model
var Coach = require('../app/models/coach');
var config = require('../config/database'); // get db config file
 
module.exports = function(passport) {
  var opts = {};
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    Coach.findOne({id: jwt_payload.id}, function(err, coach) {
          if (err) {
              return done(err, false);
          }
          if (coach) {
              done(null, coach);
          } else {
              done(null, false);
          }
      });
  }));
};
