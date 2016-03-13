/* Module Calls */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport =  require('passport');
var jwt = require('jwt-simple');
var events = require('events');
var redis = require('redis');
var client = redis.createClient();
var ee = new events.EventEmitter();
ee.on('test',function(){
   
      console.log('willy wonker');
});


/* File Calls */
var auth =  require('./auth')(passport);
var db =  require('./db');
var jwt_key = require('./config/jwt.js')();
var routes = require('./routes/index')();
var users = require('./routes/users')();
var auth =  require('./routes/auth.js')(passport);
var posts =  require('./routes/posts.js')();
var comments =  require('./routes/comments.js')();



var app = express();
var io = require('socket.io').listen(app.listen(4000));
io.sockets.on('connection',function(socket){
      //stores every socket-client to redis
      socket.on('store-to-redis',function(data){
            var user = data.id;
            client.set('user-'+user,socket.id);
           
      });
});
/*io.sockets.on('connection', function (socket) {
      
      console.log(socket.id);
      socket.on('touch',function(data){
          console.log(data);
          //io.emit('tty',"A new fren request");
          //socket.broadcast.emit('tty', "this is a broadcast execpt to the sender");
          //socket.emit('tty',"this is a test");
          //socket.broadcast.to("/#RS8jwOmdquo-j8RBAAAB").emit('tty', 'for your eyes only');
      });
      socket.on('make',function(data,fn){
          console.log(data);
          //fn("ticker or treat");
          console.log(fn);
      });
      //io.sockets.emit('pizza','peppperoni');
      
});*/



var freinds = require('./routes/freinds.js')(ee,io);

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
