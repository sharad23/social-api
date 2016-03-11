var express = require('express');
var router = express.Router();

/* GET home page. */
module.exports = function(){

	router.get('/', function(req, res, next) {
	      
	     res.send('ok');
	});

	return router;
};
