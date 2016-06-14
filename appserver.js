var express = require('express');
var http = require("http");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);

var mongoose = require('mongoose');
var methodOverride = require('method-override');

var app = express();

/*** db config files ***/
var usersDbConfig = require(path.join(__dirname, '/config/db'));

var indexRoute = require('./routes/index');
var usersRoute = require('./routes/users');
var todoRoute = require('./routes/todo');

/*** view engine setup ***/
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
/*** other setup ***/
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

/*** mongodb connection string ***/
if (app.get('env') === 'development') {
    mongoose.connect(usersDbConfig.devUrl, function(err) {
      if(err) {
          console.log('mongodb connection error for localhost:3000', err);
      } else {
          console.log('mongodb connection successful. API query URL: localhost:3000');
      }
    });

    /*** using the mongodb session ***/
    app.use(session( {store: new mongoStore( {url: usersDbConfig.devUrl} ),
                      secret: usersDbConfig.sessionSecret,
                      saveUnitialized: true,
                      resave: true
                     }
                  )
    );
}
if (app.get('env') === 'production') {
    mongoose.connect(usersDbConfig.prodUrl, function(err) {
      if(err) {
          console.log('mongodb connection error.' + usersDbConfig.routeName, err);
      } else {
          console.log('mongodb connection successful.' + usersDbConfig.routeName);
      }
    });

    /*** using the mongodb session ***/
    app.use(session( {store: new mongoStore( {url: usersDbConfig.prodUrl} ),
                      secret: usersDbConfig.sessionSecret,
                      saveUnitialized: true,
                      resave: true
                     }
                   )
    );
}

/*** mapping express routes ***/
app.use('/todos', todoRoute);
app.use('/users', usersRoute.router);
app.use('/', usersRoute.checkUserIsAuthenticated, indexRoute);

/*** resolve the get_partials custom path. ngApp.js needs this. ***/
app.get('/get_partials/:name', function(req, res) {
  var name = req.params.name;
  res.render(path.join(__dirname, '/views/partials/', name));
});

/*** the last step of pretifying the url by using the AngularJS
     $locationProvider.html5mode ***/
/** do url redirect to /#/<name> in case users type /<name> manually
     in a web browser. **/
app.get('/register', usersRoute.checkUserIsAuthenticated, function(req, res) {
  if(!req.isAuthOutput.checkResult) {
      res.redirect('/#/register');
  } else {
      console.log('CONSOLE LOG : Attempted to access registration page while still signed in. Please logout beforehand.');
      res.redirect('/');
  }
});
app.get('/login', usersRoute.checkUserIsAuthenticated, function(req, res) {
  if(!req.isAuthOutput.checkResult) {
      res.redirect('/#/login')
  } else {
      console.log('CONSOLE LOG : Attempted to access login page while still signed in. Please logout beforehand.');
      res.redirect('/');
  }
});

/** catch 404 and forward to error handler **/
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/*** error handlers ***/
/** development error handler - will print stacktrace **/
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
/** production error handler - no stacktraces leaked to user **/
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}

module.exports = app;
