const express = require('express');
const path = require('path');

// Node middleware for serving a favicon (this is the icon used to represent the site inside the 
// browser tab, bookmarks, etc.).
const favicon = require('serve-favicon');

// An HTTP request logger middleware for node.
const logger = require('morgan');

// Used to parse the cookie header and populate req.cookies (essentially provides a convenient method 
// for accessing cookie information).
const cookieParser = require('cookie-parser');

// This parses the body portion of an incoming HTTP request and makes it easier to extract different 
// parts of the contained information. For example, you can use this to read POST parameters.
const bodyParser = require('body-parser');

// These modules/files contain code for handling particular sets of related "routes" (URL paths). 
// When we extend the skeleton application, for example to list all books in the library, we will add 
// a new file for dealing with book-related routes.
const index = require('./routes/index');
const users = require('./routes/users');

// creates an express app object
const app = express();

// Import mongoose module
const mongoose = require('mongoose');
const dev_db_url = 'mongodb://cooluser:coolpassword@ds119748.mlab.com:19748/local_library';
// set up default mongoose connection
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {
  useMongoClient: true
});
// get mongoose to use global promise library
mongoose.Promise = global.Promise;
// get default connection
const db = mongoose.connection;
// bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// use express.static middleware to get express to serve all static files in directory /public
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Now that all the other middleware is set up, we add our (previously imported) route-handling code 
 * to the request handling chain. The imported code will define particular routes for the different 
 * parts of the site:
 * 
 * Note: The paths specified below ('/' and '/users') are treated as a prefix to routes defined in 
 * the imported files. So for example if the imported users module defines a route for /profile, you 
 * would access that route at /users/profile. 
 */
app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
