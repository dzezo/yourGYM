var mongoose = require('mongoose');
var config = require('../config/database');

// Member Schema
var MemberSchema = mongoose.Schema({
	gym: {
		type: String,
		index: true,
		required: true
	},
	name: {
		type: String, 
		required: true
	},
	phoneNum: String,	
	email: String,
	dateStarted: {
		type: Date,
		default: Date.now
	},
	length: {
		type: Number,
		min: 1
	},
	type: {
		type: String,
		default: 'Teretana'
	},
	cost: Number,
	paid: Number,
	datePaid: [Date]
});

var Member = module.exports = mongoose.model('Member', MemberSchema);

module.exports.addMember = function (newMember, callback) {
	newMember.save(callback);
}