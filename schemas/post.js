var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var commentSchema =  new Schema({ 
                         payload: String,
                         meta:{
                             date: Date,
                             user: { type: Schema.Types.ObjectId, ref: 'User' },
                             updates: [{ date: Date }]
                         }
                     });
var postSchema = new Schema({ 
	                     payload: String,
                         comments: [ commentSchema ],
                         meta: {
                             date: Date,
                             user: { type: Schema.Types.ObjectId, ref: 'User' },
                             updates: [{ date: Date }]
                         }
                            
                    });
module.exports = mongoose.model('Post', postSchema);