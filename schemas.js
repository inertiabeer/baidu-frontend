var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
	device: String,
	code: String,
	msg: String,
	word: String,
	time: Date,
	dataList: [{
		title: String,
		info: String,
		link: String,
		img: String
	}]

});
module.exports = userSchema;