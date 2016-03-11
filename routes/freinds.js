var express = require('express');
var FreindSchema  = require('../schemas/freind.js');
var router = express.Router();
module.exports = function(){
    
    router.get('/sendRequest/:id',function(req,res,next){
          var toUser = req.params._id;
          var frenReq = new FreindSchema();
          frenReq.from_user = req.user._id;
          frenReq.to_user = toUser;
          frenReq.date = new  Date();
          frenReq.save(function(err,data){
               if(err){
                    res.status(500);
                    res.json({ message:err });
               }
               res.status(200);
               res.json(data);
          });
    });
    return router;
};