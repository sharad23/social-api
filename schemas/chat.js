var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var chatSchema = new Schema({ 
	                  
                         chatroom_id:{ type:Schema.Types.ObjectId, ref: 'chatRoom'},
                         message: String,
                         meta:{
                         	 date: Date,
                         	 from: {type:Schema.Types.ObjectId, ref: 'User'}
                         }

                    });
module.exports = mongoose.model('Chat', chatSchema);