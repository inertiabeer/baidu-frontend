var mongoose = require('mongoose');
var userSchema = require('./schemas.js');
var user = mongoose.model('user', userSchema);
module.exports = user;