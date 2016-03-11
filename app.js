/* Module Calls */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport =  require('passport');
var jwt = require('jwt-simple');


/* File Calls */
var auth =  require('./auth')(passport);
var db =  require('./db');
var jwt_key = require('./config/jwt.js')();
var routes = require('./routes/index')();
var users = require('./routes/users')();
var auth =  require('./routes/auth.js')(passport);
var posts =  require('./routes/posts.js')();
var comments =  require('./routes/comments.js')();
var freinds = require('./routes/freinds.js')();


var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/auth',auth);
app.use(function(req,res,next){
     
    //decode token
    var token = req.headers['x-access-token'];
    if (token) {
        try {
              var decoded = jwt.decode(token, jwt_key.key);
              req.user = decoded;
              return next();

            } 
        catch (err) {
           res.json({
                       status: 401,
                       message: "Invalid Token"
                    });     
        }
    } 
    else {
      
        res.json({
                    status: 401,
                    message: "No token provided"
                });
    }
});
app.use('/', routes);
app.use('/posts',posts);
app.use('/users', users);
app.use('/comments',comments);
app.use('/freinds',freinds);
/*app.use(function(err,req,res,next){
     
      console.log('Error Found');
});*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
