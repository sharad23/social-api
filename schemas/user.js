var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
var userSchema = new Schema({
                                login_info:{ 
                	                        
                                    username: String,
                                    email: String,
                                    password: String

                                },
                                personnel_info:{
                               
                                    full_name: String,
                                    dob: Date,
                                    hobbies:[ String ]
                                },
                                freinds:[{ type: Schema.Types.ObjectId, ref: 'User'}]
                            });

userSchema.pre('save', function(next) {
    
    var user = this;
    bcrypt.genSalt(4, function(err, salt) {
    	if(err) return console.error(err);
        bcrypt.hash(user.login_info.password, salt, function(err,hash) {
		            if(err) return console.error(err);
		            user.login_info.password = hash;
		            next();
		    });
            
    });
});

userSchema.methods.comparePassword = function (password,cb) {
     var user = this;
     var hash = user.login_info.password;
     bcrypt.compare(password, hash, function(err,res) {
             
             cb(err,res);
     });
};

module.exports = mongoose.model('User', userSchema);