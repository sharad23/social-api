var express = require('express');
var mongoose =  require('mongoose');
var PostSchema = require('../schemas/post');
var router = express.Router();
module.exports = function(){
     
    router.get('/:post_id', function(req,res,next){
          
           var post_id = req.params.post_id;
           PostSchema.findOne({ _id: post_id })
                     .lean()
                     .populate('meta.user')
                     .populate('comments.meta.user')
                     .exec(function(err,data){
                           if(err){
                           	     res.status(500);
                           	     return res.json({message:err});
                           }
                           res.status(200);
                           res.json(data);
                     });
     });

     router.get('/:post_id/:comment_id',function(req,res,next){
           
           var post_id = req.params.post_id;
           var comment_id = req.params.comment_id;
           PostSchema.aggregate([
                   { $match: { _id: mongoose.Types.ObjectId(post_id) }},
                   { $unwind: "$comments"},
                   { $match: {"comments._id": mongoose.Types.ObjectId(comment_id) }}
               ],
	           function(err, data){
                    if(err){
                    	 res.status(500);
                    	 return res.json({message: err });
                    }
                    res.status(200);
                    res.json(data);
	           }
	       );
     });

     router.post('/:post_id',function(req,res,next){
           
            var post_id = req.params.post_id;
            var comment =  req.params.comment;
            PostSchema.update(
                                { _id: mongoose.Types.ObjectId(post_id) },
                                { 
                                      "$push": { 
                                              "comments": { 
                                                             payload:comment
                                                             
                                                          } 
                                             } 
                                }, 
                                function(err,data){
                                    if(err) {
                                       res.status(500);
                                       return res.json({message: err });
                                    }
                                    res.status(200);
                                    res.json(data);
                                } 
                             );


     });
     router.put('/:post_id/:comment_id',function(req,res,next){
            var post_id = req.params.post_id;
            var comment_id = req.params.comment_id;
            var comment = req.body.comment;
            PostSchema.update( 
                               { _id: mongoose.Types.ObjectId(post_id), "comments._id": mongoose.Types.ObjectId(comment_id) },
                               { 
                                  "$set": {"comments.$.payload":comment }
                               },
                               function(err,data){
                                  
                                    if(err) {
                                       res.status(500);
                                       return res.json({message: err });
                                    }
                                    res.status(200);
                                    res.json(data);
                               }

                             ); 

     });
    router.delete('/:post_id/:comment_id',function(req,res,next){
            var post_id = req.params.post_id;
            var comment_id = req.params.comment_id;
            PostSchema.update(
                                { _id: mongoose.Types.ObjectId(post_id) },
                                { 
                                      "$pull": { "comments":{_id:mongoose.Types.ObjectId(comment_id) }} 
                                }, 
                                function(err,data){
                                    if(err) {
                                       res.status(500);
                                       return res.json({message: err });
                                    }
                                    res.status(200);
                                    res.json(data);
                                } 
                             );
    });
    return router;
};