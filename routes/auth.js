var express = require('express');
var router = express.Router();
var User =  require('../schemas/user.js');
var jwt = require('jwt-simple');
var jwt_key = require('../config/jwt')();
/* GET home page. */

module.exports = function(passport){

        router.post('/login', function(req, res, next) {
		    passport.authenticate('local', { session: false } , function(err, user, info) {
		    	if(err) return res.json({'message':'error'});
			    if(!user) return res.json({'message': info});
		        else{
		           //create a JWT token
		           var token = jwt.encode(user, jwt_key.key);
		           console.log(token);
                   res.json({ 
                   	          message:'Success',
                   	          token: token
                   	        });
                }
            })(req, res, next);
        });
      
        return router;
};
