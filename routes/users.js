var express = require('express');
var router = express.Router();

var path = require('path');
var util = require('util');
var mongoose = require('mongoose');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var pwdHashSalt = require('password-hash-and-salt');

/*** db config files ***/
var usersDbConfig = require(path.join(__dirname, '../config/db'));

var user = require(path.join(__dirname, '../models/user'));
var userModel = mongoose.model('User');

/*** using the mongodb session ***/
if (router.get('env') === 'development') {
    router.use(session( {store: new mongoStore( {url: usersDbConfig.devUrl} ),
                         secret: usersDbConfig.sessionSecret,
                         saveUnitialized: true,
                         resave: true
                        }
                      )
    );
}
if (router.get('env') === 'production') {
    router.use(session( {store: new mongoStore( {url: usersDbConfig.prodUrl} ),
                         secret: usersDbConfig.sessionSecret,
                         saveUnitialized: true,
                         resave: true
                        }
                      )
    );
}

router.use(passport.initialize());
router.use(passport.session());

passport.use( new localStrategy(
      function(username, password, done) {
          userModel.findOne({email: username}, function(err, userCredential) {
              if(err) {
                  return done(err);
              }
              if(!userCredential) {
                  // Incorrect username
                  return done(null, false);
              }
              pwdHashSalt(password).verifyAgainst(userCredential.password, function(err, verified) {
                  if(err) {
                      // Password verification has failed
                      return done(null, false);
                  }
                  if(!verified) {
                      // wrong password
                      return done(null, false);
                  }
                  // successful login attempt
                  return done(null, userCredential);
              });
          });
      }
));

passport.serializeUser( function(user, done) {
    // only user's id is serialised to the session.
    done(null, user.id);
});

passport.deserializeUser( function(id, done) {
    // use user's id to get user's info from the session
    userModel.findById(id, function(err, user) {
         done(err, user);
    });
});

/***
  We are not using the passport req.isAuthenticated() method to check if user has
  logged in. The reason is this function only works in this router module. Outside
  this module such as in appserver.js, the function will always return false.

  Recall, the 'loggedUser' session is created after users successfully logged
  in with their account.

  To check the content of session for debugging purpose :
  console.log(require('util').inspect(req.session));
***/
var isAuthenticated = function(req,res,next) {
    req.isAuthOutput = {
      checkResult: false,
      loggedUserName: "",
      loggedUserFirstName: "",
      loggedUserLastName: ""
    };

    if(typeof req.session !== "undefined") {
        if(typeof req.session.passport !== "undefined" && typeof req.session.loggedUser !== "undefined") {
              if(typeof req.session.passport.user !== "undefined" && typeof req.session.loggedUser.id !== "undefined") {
                  if(req.session.passport.user === req.session.loggedUser.id) {
                      req.isAuthOutput.checkResult = true;
                      req.isAuthOutput.loggedUserName = req.session.loggedUser.username;
                      req.isAuthOutput.loggedUserFirstName = req.session.loggedUser.firstname;
                      req.isAuthOutput.loggedUserLastName = req.session.loggedUser.lastname;
                  }
              }
        }
    }

    next();
}

/*** <domain>/users/login ***/
router.post('/login', passport.authenticate('local', { session: true }), function(req, res){
    /* Create a mongodb session to be used by isAuthenticated function.
       This is a necessary step in order to make the isAuthenticated function to be able
       to be used outside this module.
    */
    req.session.loggedUser = { id: req.user._id,
                               username: req.user.email,
                               firstname: req.user.firstname,
                               lastname: req.user.lastname };

    res.json(req.user);
});

/*** <domain>/users/register ***/
router.post('/register',function(req,res) {
    pwdHashSalt(req.body.password).hash(function(err, hash) {
        if(err) {
            res.json({'alert':'Registration error [password hashing error]'});
        }
        var u =  new userModel();
        u.email = req.body.email;
        u.lastname = req.body.lastname;
        u.firstname = req.body.firstname;
        u.password = hash;
        u.save(function(err) {
            if (err) {
                res.json({'alert':'Registration error'});
            } else {
                res.json({'alert':'Registration success'});
            }
        });
    });
});

/*** <domain>/users/logout ***/
router.post('/logout', function(req, res) {
    req.session.destroy();
    req.logout();
    res.sendStatus(200);
});

/*** GET all users. <domain>/user ***/
router.get('/', function(req, res, next) {
    userModel.find(function(err, data) {
        if(err) return next(err);

        res.json(data);
    });
});

/*** DELETE an user. <domain>/user/:id ***/
router.delete('/:id', function(req, res, next) {
    userModel.findByIdAndRemove(req.params.id, req.body, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/*** export this router module, and the userAuthenticated function ***/
module.exports = {
    router,
    checkUserIsAuthenticated: isAuthenticated
};
