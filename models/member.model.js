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
	debt: {
		type: Number,
		required: true
	}
});

var Member = module.exports = mongoose.model('Member', MemberSchema);

module.exports.addMember = function (userId, req, callback) {
	var newMember = new Member();
	var amount = (req.amount)?req.amount:0;
	// Member Info
	newMember.userId = userId;
	newMember.name = req.name;
	newMember.phoneNum = req.phoneNum;
	newMember.email = req.email;
	// Membership
	if(req.type)
		newMember.type = req.type;
	newMember.startDate = new Date(req.sDate);
	newMember.endDate = new Date(req.eDate);
	newMember.cost = req.cost;
	newMember.paid.push({
		date: new Date(req.sDate), 
		amount: amount
	});
	newMember.debt = req.cost - amount;
	// Add New Member
	newMember.save(callback);
}

module.exports.removeMember = function(userId, memberId, callback){
	var query = {userId: userId, _id: memberId};
	Member.findOneAndRemove(query, callback);
}

module.exports.removeMemberPayment = function(userId, memberId, paymentId, callback){
	var query = {userId: userId, _id: memberId};
	var update = { $pull: { paid: { _id: paymentId }}};
	
	Member.findOneAndUpdate(query, update, callback);
}

module.exports.updateMemberInfo = function(userId, memberId, req, callback){
	var query = {userId: userId, _id: memberId};
	var update = {
		$set: {
			name: req.name,
			phoneNum: req.phoneNum,
			email: req.email
		}
	};
	var options = { new: true };

	Member.findOneAndUpdate(query, update, options, callback);
}

module.exports.renewMembership = function(userId, memberId, req, callback){
	var query = {userId: userId, _id: memberId};
	var amount = (req.amount)?req.amount:0;
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
				date: req.sDate,
				amount: amount
			}
		}
	};

	Member.findOneAndUpdate(query, update, callback);
}

module.exports.makePayment = function(userId, memberId, req, callback){
	var query = {userId: userId, _id: memberId};
	var update = {
		$set: {
			debt: req.debt - req.amount
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

module.exports.undoPayment = function(userId, memberId, paymentId, req, callback){
	var newDebt = req.debt - req.amount;

	var query = {userId: userId, _id: memberId};
	var update = { 
		$set: { debt: newDebt },
		$pull: { paid: { _id: paymentId }}
	};
	
	Member.findOneAndUpdate(query, update, callback);
}

module.exports.getMember = function(userId, memberId, callback){
	var query = {userId: userId, _id: memberId};
	Member.findOne(query, callback);
}

module.exports.getMembers = function(userId, criteria, callback){
	var query = {userId: userId};
	if(criteria == 1)
		var sort = { sort: { debt: -1 } };
	Member.find(query, {}, sort, callback);
}