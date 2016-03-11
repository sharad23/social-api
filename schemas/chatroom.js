var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var chatRoomSchema = new Schema({ 
	                  
                         users:[{ type: Schema.Types.ObjectId, ref: 'User'}],
                         meta:{
                            date: Date,
                            founder: [{ type: Schema.Types.ObjectId, ref: 'User'}]
                        }

                    });
module.exports = mongoose.model('ChatRoom', chatRoomSchema);