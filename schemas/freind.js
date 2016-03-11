var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var freindSchema = new Schema({ 
	                    from_user: { type: Schema.Types.ObjectId, ref: 'User' },
                        to_user: { type: Schema.Types.ObjectId, ref: 'User' },
                        date: Date,
                        response: {
                           result: Boolean,
                           date: Date
                        }


                    });
module.exports = mongoose.model('freind',freindSchema);