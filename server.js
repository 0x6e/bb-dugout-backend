var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport	= require('passport');
var config      = require('./config/database'); // get db config file
var Coach       = require('./app/models/coach'); // get the mongoose model
var port        = process.env.PORT || 8080;
var jwt         = require('jwt-simple');

// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// log to console
app.use(morgan('dev'));

// Use the passport package in our application
app.use(passport.initialize());

// Enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// demo Route (GET http://localhost:8080)
app.get('/', function(req, res) {
  res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// connect to database
mongoose.connect(config.database);

// pass passport for configuration
require('./config/passport')(passport);

// bundle our routes
var apiRoutes = express.Router();

// create a new user account (POST http://localhost:8080/api/signup)
apiRoutes.post('/signup', function(req, res) {
  if (!req.body.name || !req.body.password) {
    res.status(409).json({success: false, msg: 'Please pass a Coach name and password.'});
  } else {
    var newCoach = new Coach({
      uniqueName: req.body.name.toUpperCase(),
      name: req.body.name,
      password: req.body.password
    });
    // save the user
    newCoach.save( function(err) {
      if (err) {
        return res.status(409).json({success: false, msg: 'This Coach already exists.'});
      }
      res.status(201).json({success: true, msg: 'Successfully created a new Coach.'});
    });
  }
});

// route to authenticate a coach (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {
  Coach.findOne({
    name: req.body.name
  }, function(err, coach) {
    if (err) throw err;

    if (!coach) {
      res.status(401).send({success: false, msg: 'Authentication failed. Coach not found.'});
    } else {
      // check if password matches
      coach.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if coach is found and password is right create a token
          var token = jwt.encode(coach, config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

// delete an authenticated user (DELETE http://localhost:8080/api/coach)
apiRoutes.delete('/coach', passport.authenticate('jwt', {session: false}),function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decodedCoach = jwt.decode(token, config.secret);
    Coach.remove({uniqueName: decodedCoach.uniqueName}, function(err) {
      if (err) {
        return res.status(401).send({success: false, msg: 'Failed to delete coach.'});
      }
        return res.status(200).send({success: true, msg: 'Coach deleted.'});
    });
  } else {
      return res.status(401).send({success: false, msg: 'Authentication failed.'});
  }
});

getToken = function(headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    }
  }

  return null;
}

// connect the api routes under /api/*
app.use('/api', apiRoutes);

// Start the server
app.listen(port);
console.log('There will be dragons: http://localhost:' + port);
