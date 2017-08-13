var mongoose = require('mongoose');
var config = require('../config/database');

// Member Schema
var MemberSchema = mongoose.Schema({
	// Member
	userId: {
		type: mongoose.Schema.ObjectId,
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
	type: {
		type: String,
		default: 'Teretana'
	},
	startDate: {
		type: Date,
		required: true
	},
	endDate: {
		type: Date,
		required: true
	},
	cost: {
		type: Number,
		required: true
	},
	paid: [{
		date: Date,
		amount: Number
	}],
	debt: Number
});

var Member = module.exports = mongoose.model('Member', MemberSchema);

module.exports.addMember = function (newMember, callback) {
	newMember.save(callback);
}

module.exports.removeMember = function(userId, memberId, callback){
	var query = {userId: userId, _id: memberId};
	Member.findOneAndRemove(query, callback);
}

module.exports.removeMemberPayment = function(userId, memberId, paymentId, callback){
	var query = {userId: userId, _id: memberId};
	Member.findOneAndUpdate(query, 
	{ 
		$pull: {
			_id: paymentId
		}
	}, callback);
}

module.exports.updateMemberInfo = function(userId, memberId, req, callback){
	var query = {userId: userId, _id: memberId};
	var update = {
		$set: {
			name: req.name,
			phone: req.phone,
			email: req.email
		}
	};
	var options = { new: true };

	Member.findOneAndUpdate(query, update, options, callback);
}

module.exports.updateMembership = function(userId, memberId, req, callback){
	var query = {userId: userId, _id: memberId};
	var update = {
		$set: {
			type: req.type,
			startDate: new Date(req.sDate),
			endDate: new Date(req.eDate),
			cost: req.cost,
			debt: req.debt + (req.cost - req.amount)
		},
		$push: {
			paid: {
				date: req.payDate,
				amount: req.amount
			}
		}
	};

	Member.findOneAndUpdate(query, update, callback);
}

module.exports.updateMemberPayments = function(userId, memberId, req, callback){
	var query = {userId: userId, _id: memberId};
	Member.findOneAndUpdate(query, 
	{ 
		$push: {
			paid: {
				date: req.payDate,
				amount: req.amount
			}
		}
	}, callback);
}

module.exports.getMember = function(userId, memberId, callback){
	var query = {userId: userId, _id: memberId};
	User.findOne(query, callback);
}

module.exports.getMembers = function(userId, callback){
	var query = {userId: userId};
	Member.find(query, callback);
}

module.exports.calculateDebt = function (cost, paid){
	var sum = 0;
	if(paid)
		paid.forEach(element => { sum += element.amount; });
	return cost - sum;
}