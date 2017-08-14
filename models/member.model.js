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
	phoneNum: {
		type: String,
		default: 'Phone number not submitted'
	},	
	email: {
		type: String,
		default: 'E-mail not submitted'
	},
	
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
	daysLeft: {
		type: Number,
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

module.exports.calculateDaysLeft = function(date1, date2){
	var day = 1000*60*60*24,
		days = date2.getTime() - date1.getTime();

	return (Math.round(days/day));
}

module.exports.addMember = function (userId, req, callback) {
	var newMember = new Member(),
		amount = (req.amount)?req.amount:0,
		sDate = new Date(req.sDate),
		eDate = new Date(req.eDate);

	// Member Info
	newMember.userId = userId;
	newMember.name = req.name;
	if(req.phoneNum)
		newMember.phoneNum = req.phoneNum;
	if(req.email)
		newMember.email = req.email;
	// Membership
	if(req.type)
		newMember.type = req.type;
	newMember.startDate = sDate;
	newMember.endDate = eDate;
	newMember.daysLeft = calculateDaysLeft(sDate, eDate);
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

module.exports.getMembers = function(userId, criteria, limit, callback){
	var query = {userId: userId},
		criterion = {};
	if(criteria == 1)
		criterion = { debt: -1 };
	else if (criteria == 2)
		criterion = { daysLeft: 1 };
	else if (criteria == 3)
		criterion = { startDate: -1 };

	if(limit != 0)
		Member.find(query, {}, { sort: criterion, limit: limit }, callback);
	else
		Member.find(query, {}, { sort: criterion }, callback);
}

module.exports.getStat = function(userId, stat, callback){
	var query = {};
	if(stat == 1)
		query = { daysLeft: { $gt: 0 } };
	if(stat == 2)
		query = { debt: { $gt: 0 } };

	Member.count(query, callback);
}