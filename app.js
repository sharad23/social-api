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
var async  = require('async');
var ee = new events.EventEmitter();
ee.on('test',function(){
   
      console.log('willy wonker');
});


/* File Calls */
var testMiddleware =  require('./middlewares/test');
var auth =  require('./auth')(passport);
var db =  require('./db');
var jwt_key = require('./config/jwt.js')();
var routes = require('./routes/index')();
var users = require('./routes/users')();
var auth =  require('./routes/auth.js')(passport);
var posts =  require('./routes/posts.js')();
var app = express();
var io = require('socket.io').listen(app.listen(4000));
io.sockets.on('connection',function(socket){
      //stores every socket-client to redis
      console.log(socket.id);
      socket.on('store-to-redis',function(data){
            var user = data.id;
            client.set('user-'+user,socket.id);
            //socket.emit('joining','You have joined');
           
      });
      
      //for joining a chat room
      socket.on('join',function(data){
            socket.join('some-room');
            io.sockets.in('some-room').emit('okz', 'data1');
            client.get('user-56e26582679c7fac10a74266', function(err, socketid) {
                  io.to(socketid).emit('fren-req',"A new freind request from ");
            });
      });

      socket.on('join2',function(data){
            socket.join('some-room2');
            io.sockets.in('some-room2').emit('okz', 'only to some-room2'); 
      });

      //tutorial for leaving socket

      socket.on('join3',function(data){
           console.log('joined');
           //io.to(socket.id).emit('fren-req',"A new freind request from ");
           socket.join('white-room');
           io.sockets.in('white-room').emit('fren-req',"This is a global");
           io.sockets.in('white-room').emit('fren-req',"This should be  appearing as well");
           socket.leave('white-room');
           io.sockets.in('white-room').emit('fren-req',"This shouldn't be appearing");
      });

      //tutorial for leave ends
});
//remeber to flush the redis after disconnection
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


var comments =  require('./routes/comments.js')(io);
var freinds = require('./routes/freinds.js')(ee,io);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.get('/testMiddleware',testMiddleware,function(req,res,next){
    
       res.json({result: 'ok' });
});
app.get('/',function(req,res,next){
       //console.log(io.sockets.clients());
       client.get('user-'+"56e023358ba6aa590eecef61",function(err, socketid) {
            
            //console.log(io.sockets.clients());
            //console.log(socketid);
            //console.log(socketid);
            //console.log(io.sockets.connected[socketid]);

             //getting that particuar socket 
             io.sockets.connected[socketid].emit('joining','cheese-pizza');  //now you can add this socket to any particular group 
             //io.sockets.connected[socketid]   
             //res.json({result:"ok"});    

             //making someone to join socket
             console.log(io.sockets.connected[socketid]);
             io.sockets.connected[socketid].join('chat-room');
             io.sockets.in('chat-room').emit('joining','You have joined'); 
             res.json({result:"ok"});                                           
       }); 
       
});

app.post('/test-file',function(req,res,next){

      res.json({file: req.file});

});

var blockMe = function(key,cb){
      
      if(key != 2){
          setTimeout(function(){
                cb(null);
              
          },1000);
      }
      else{
        setTimeout(function(){
                cb("Error Occurred for key "+key);
                
          },1000);
      }
}
app.get('/asyncTest',function(req,res,next){
        
        var datas = [1,2,3,4];
        async.eachSeries(datas,function(data,callback){
              blockMe(data,function(err){
                   if(err){
                      return callback(err);
                   }
                   return callback(null);
              });

        },function(err){
            if(err){
              res.status(500);
              return res.json({result: err});
            }
            res.json({result: "complete"});
        });
});
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
