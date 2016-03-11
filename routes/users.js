var events = require('events');
var eventEmitter = new events.EventEmitter();
var mongoose =  require('mongoose');
var express = require('express');
var UserSchema = require('../schemas/user');
var router = express.Router();
eventEmitter.on('doorOpen',function(){

       console.log('Fired');
});
module.exports = function(){
      
      router.get('/',function(req,res,next){
            UserSchema.find({},{})
                      .sort({ "login_info.username": 1})
                      .exec(function(err,data){
                          if(err){
                               res.status(500);
                               res.json({message:err});
                          }
                          res.status(200);
                          res.json(data);
                       });
      });
	    router.post('/signup',function(req,res,next){
	      var newUser = new UserSchema();
            newUser.login_info.username = req.body.username;
            newUser.login_info.email =  req.body.email;
            newUser.login_info.password = req.body.password;
            newUser.personnel_info.full_name = req.body.full_name;
            newUser.personnel_info.dob = req.body.dob;
            newUser.personnel_info.hobbies = req.body.hobbies;
            newUser.save(function(err,data){
                  if(err){
                         res.status(500);
                         return res.json(err);
                  }
                  res.status(200);
                  return res.json(data);  
            });
      });
      router.get('/:id',function(req,res,next){
            var id = req.params.id;
            UserSchema.findOne({ _id: id })
                     .lean()
                     .exec(function(err,data){
                           if(err){
                                   res.status(500);
                                   return res.json({message:err});
                           }
                           res.status(200);
                           res.json(data);
                     });
      });
      router.put('/changePassword/:id', function(req, res, next) {
            var id = req.params.id;
            UserSchema.findOne({_id:id}).
                       exec(function(err,data){
                            if(err){
                                res.status(500);
                                return res.json({message:err});
                            }
                            data.login_info.password = req.body.password;
                            data.save(function(err,data){
                                  if(err){
                                      res.status(500);
                                      return res.json({message:err});
                                  }
                                  res.status(200);
                                  res.json(data);
                                  console.log('done');
                            });
                       });
            eventEmitter.emit('doorOpen');
      });
      return router;
};
