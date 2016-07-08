var async = require('async');
var mongoose = require('mongoose');
var redis = require('redis');
var client = redis.createClient();
var express = require('express');
var FreindSchema  = require('../schemas/freind.js');
var UserSchema = require('../schemas/user.js');
var router = express.Router();
module.exports = function(ee,io){
    
    router.get('/sendRequest/:id',function(req,res,next){
          //check whether the request has already been sent
          var toUser = req.params.id;
          var fromUser = req.user._id;
          FreindSchema.findOne({ $or:[{from_user: fromUser, to_user: toUser},{ from_user: toUser, to_user: fromUser }]  })
                       .exec(function(err,data){
                           if(!data){
                                var frenReq = new FreindSchema();
                                frenReq.from_user = fromUser;
                                frenReq.to_user = toUser;
                                frenReq.date = new  Date();
                                frenReq.save(function(err,data){
                                     if(err){
                                          res.status(500);
                                          return res.json({ message:err });
                                     }
                                     res.status(200);
                                     res.json(data);
                                });
                                client.get('user-'+toUser, function(err, socketid) {
                                    //io.to(socketid).emit('fren-req',"A new freind request from "+req.user.login_info.username);
                                    //get the frenReq id
                                    if(err){
                                        console.log(err);
                                    }
                                    console.log(socketid);
                                    io.to(socketid).emit('fren-req',frenReq);
                                });
                               ee.emit('test');
                           }
                           else{
                               res.status(400);
                               res.json({ message: "Fren request has been already send"});
                           }
                       }); 
          
          
    });
    router.get('/respondRequest/:id/:res',function(req,res,next){
          

          var add_to_freind_list = function(from_user,to_user,callback){
                  UserSchema.update(
                                      { _id: mongoose.Types.ObjectId(from_user) },
                                      { "$push" :{freinds: to_user }}, 
                                      function(err,data){
                                          if(err) {
                                             callback(err);
                                          }
                                          callback();
                                      } 
                                    );
          };
          var save_fren_response = function(data,callback){
                    data.save(function(err,data){
                                                    if(err){
                                                        callback(err);
                                                    }
                                                    callback();
                                                });
          };
          var response = parseInt(req.params.res);
          var req_id =  req.params.id;
          FreindSchema.findOne({_id: req_id })
                      .exec(function(err,data){
                            if(err){
                                  res.status(500);
                                  return res.json({ message:err });
                            }
                            if(data.to_user == req.user._id){
                                  if(typeof data.response.result === "undefined"){
                                       data.response.result = response;
                                       data.response.date = new Date();
                                       //this 3 tasks should be parallel
                                       if(data.response.result === true){
                                               async.parallel([  
                                                                 function(callback){
                                                                     
                                                                     save_fren_response(data,callback);
                                                                 },
                                                                 function(callback){
                                                                     
                                                                  
                                                                       add_to_freind_list(data.from_user,data.to_user,callback); 
                                                                 },
                                                                 function(callback){
                                                                     
                                                                   
                                                                       add_to_freind_list(data.to_user,data.from_user,callback); 
                                                                 }
                                                              ], 
                                                              function(err) { 
                                                                  if(err){
                                                                         res.status(500);
                                                                         return res.json({ message:err });
                                                                  } 
                                                                  res.status(200);
                                                                  res.json({message: "Freind added" });
                                                              });
                                        }
                                        else{

                                              data.save(function(err,data){
                                                                    if(err){
                                                                        res.status(500);
                                                                        return res.json({ message:err });
                                                                    }
                                                                    res.status(200);
                                                                    res.json({message: "Freind Not added" });
                                              });
                                        }
                                  }
                                  else{
                                      
                                       res.status(400);
                                       res.json({message: "Response has already been performed" });
                                  }
                                 
                            }
                            else{
                                  res.status(401);
                                  res.json({message:"Unauthorized to perform this action"});
                            }
                           
                      });
         
    });
    return router;
};