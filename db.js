var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/sharadbook');
module.exports = mongoose.connection;