var mongoose = require('mongoose');
var config = require('../config/database');

// Member Schema
var MemberSchema = mongoose.Schema({
	// Member
	gymId: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		index: true,
		required: true
	},
	name: {
		type: String, 
		required: true
	},
	phoneNum: String,	
	email: String,
	
	// Membership
	startDate: {
		type: Date,
		required: true
	},
	endDate: {
		type: Date,
		required: true
	},
	type: {
		type: String,
		default: 'Teretana'
	},
	cost: {
		type: Number,
		required: true
	},
	paid: [{
		_id: false,
		date: Date,
		amount: Number
	}],
	debt: Number
});

var Member = module.exports = mongoose.model('Member', MemberSchema);

module.exports.addMember = function (newMember, callback) {
	newMember.save(callback);
}

module.exports.calculateDebt = function (cost, paid){
	var sum = 0;
	if(paid)
		paid.forEach(element => { sum += element.amount; });
	return cost - sum;
}

module.exports.calculateEndDate = function (startDate, days){
	var endDate = new Date(startDate);
	endDate.setDate(endDate.getDate() + days);
	return endDate;
}