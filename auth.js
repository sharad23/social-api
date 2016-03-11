var LocalStrategy = require('passport-local').Strategy;
var User = require('./schemas/user');
module.exports =  function(passport){

        //local Statergy
        passport.use(new LocalStrategy({
			    usernameField: 'username',
			    passwordField: 'password'
			  },
			  
			  function(username, password, done) {

			        User.findOne({ 'login_info.username': username }, function (err, user) {
			          if (err) { return done(err,false); }
				      if (!user) {  return done(null, false,'Invalid Username'); }
		              user.comparePassword(password,function(err,res){
                            if(err) return console.log(err);
                            if(res == true) {  return done(null,user); }
                            else if(res == false) {  return done(null,false,'Invalid Password'); }
				      });
				    });
			  }
	    ));

	    return passport;
}