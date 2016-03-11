var express = require('express');
var PostSchema = require('../schemas/post');
var router = express.Router();

module.exports = function(){

	router.get('/', function(req, res, next) {
          
            PostSchema.find({},{ comments:{ $slice: -5 }})
                      .lean()
                      .populate('meta.user')
                      .populate('comments.meta.user')
                      .exec(function(err,data){
                            if(err) {

                            	  res.status(500);
                            	  return res.json({message: err});
                            }
                            res.status(200);
                            res.json({message:data});
                      });
      
	});
	router.post('/',function(req,res,next){
	    
           var newPost = new PostSchema();
           newPost.payload =  req.body.post;
           newPost.meta.date =  new Date();
           newPost.meta.user = req.user._id;
           newPost.save(function(err,data){
                 if(err){
                      res.status(500);
                      return res.json({message: err});
                 }
                 
                 res.status(200);
                 res.json({message:data});
           });

	});
	router.get('/:id',function(req,res,next){
             
             var id =  req.params.id;
             PostSchema.find({_id:id })
                      .lean()
                      .populate('meta.user')
                      .populate('comments.meta.user')
                      .exec(function(err,data){
                            if(err) {

                            	  res.status(500);
                            	  return res.json({message: err});
                            }
                            res.status(200);
                            res.json({message:data});
                      });
	
	});
	router.put('/:id',function(req,res,next){
           
            var id = req.params.id;
            PostSchema.findOne({_id:id })
                      .exec(function(err,data){
                            if(err) {

                            	  res.status(500);
                            	  return res.json({message: err});
                            }
                            
                            data.post = req.body.post;
                            data.meta.updates.push({ date: new Date()});
                            data.save(function(err,result){
                                   if(err){
                                   	     res.status(500);
                            	         return res.json({message: err});
                                   }
                                   else{
                                   	     res.json({ message:result });
                                   }
                            });
                           
                            

                       }); 
	
	});
    router.post('/add-comment/:id',function(req,res,next){

            var id = req.params.id;
            PostSchema.findOne({_id:id })
                      .exec(function(err,data){
                            if(err) {

                            	  res.status(500);
                            	  return res.json({message: err});
                            }
                            
                            data.comments.push({
                                                   payload:'why?',
                                                   meta:{
                                                   	  date: new Date(),
                                                   	  user: req.user._id
                                                   }
                                               });
                            data.save(function(err,result){
                                   if(err){
                                   	     res.status(500);
                            	         return res.json({message: err});
                                   }
                                   else{
                                   	     res.json({ message:result });
                                   }
                            });
                           
                            

                       }); 

    });
    router.delete('/:id',function(req,res,next){
          
           var id = req.params.id;
           PostSchema.remove({ _id : id }, function (err) {
			   if (err){
			   	    res.status(500);
			   	    return res.json({message:err});
			   }
	           res.status(200);
			   return res.json({ message: "Successfully deleted" });

           });
    });
	
	return router;
};
