var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var CoachSchema = new Schema({
  uniqueName: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

CoachSchema
// Check we don't have an existing coach with the same name
.pre('save', function (next) {
  this.constructor.findOne({'uniqueName': this.uniqueName}, function (error, coach) {
    if (error)
      return next(error);

    if (coach !== null)
      return next(new Error("Coach already exists!"));

    next();
  });
})
// Salt the password
.pre('save', function (next) {
  var user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err)
        return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err)
          return next(err);

        user.password = hash;
        next();
      });
    });
  } else {
    return next( new Error("Case not handled"));
  }
});

CoachSchema.methods.comparePassword = function (passw, cb) {
  bcrypt.compare(passw, this.password, function (err, isMatch) {
    if (err)
      return cb(err);

    cb(null, isMatch);
  });
};

module.exports = mongoose.model('Coach', CoachSchema);
