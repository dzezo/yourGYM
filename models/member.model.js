var mongoose = require('mongoose');
var Pricelist = require('../models/pricelist.model');

var MemberSchema = mongoose.Schema({
	userId: {
		type: mongoose.Schema.ObjectId,
		index: true,
		required: true
	},
	name: {
		type: String, 
		required: true
	},
	phone: {
		type: String,
		default: 'Phone number not submitted'
	},	
	email: {
		type: String,
		default: 'E-mail not submitted'
	},
	totalDebt: {
		type: Number,
		default: 0
	},
	memberships: [{
		membershipId: mongoose.Schema.ObjectId,
		start: Date,
		end: Date,
		daysLeft: Number,
		debt: Number,
		log: [{
			date: Date,
			amount: Number
		}]
	}]
});

var Member = module.exports = mongoose.model('Member', MemberSchema);

function getEndDate (startDate, length) {
	var length = 1000*60*60*24*parseInt(length);
	var startDate = new Date (startDate);
	return (new Date (startDate.getTime() + length));
}

function getDaysLeft (currentDate, endDate){
	var day_ms = 1000*60*60*24;
	var current = new Date(currentDate);
	var end = new Date(endDate);
	return Math.round((end.getTime() - current.getTime())/day_ms);
}

// Post

module.exports.addMember = function (userId, input, res, callback) {
	Pricelist.findOne({_id: input.membershipId}, function(err, item){
		if (err)
			res.json({success: false, msg: 'Membership type not found.'});
		else{
			var end = getEndDate(input.start, item.length);
			var daysLeft = getDaysLeft(input.start, end);
			var debt = item.cost - ((input.amount)?input.amount:0);
			var newMember = new Member({
				userId: userId,
				name: input.name,
				phone: input.phone,
				email: input.email,
				totalDebt: debt,
			});
			newMember.memberships.unshift({
				membershipId: input.membershipId,
				start: input.start,
				end: end,
				daysLeft: daysLeft,
				debt: debt,
			});
			if(input.amount){
				newMember.memberships[0].log.unshift({
					date: input.start,
					amount: input.amount
				});
			}
			newMember.save(callback);
		}
	});
}

module.exports.newMembership = function(memberId, input, res, callback){
	Pricelist.findOne({_id: input.membershipId}, function(err, item){
		if (err)
			res.json({success: false, msg: 'Membership type not found.'});
		else{
			Member.findById(memberId, function(err, member){
				if (err)
					res.json({success: false, msg: 'Member not found.'});
				else{
					var end = getEndDate(input.start, item.length);
					var daysLeft = getDaysLeft(input.start, end);
					var debt = item.cost - ((input.amount)?input.amount:0);
					member.totalDebt = member.totalDebt + debt;
					member.memberships.unshift({
						membershipId: input.membershipId,
						start: input.start,
						end: end,
						daysLeft: daysLeft,
						debt: debt,
					});
					if(input.amount){
						member.memberships[0].log.unshift({
							date: input.start,
							amount: input.amount
						});
					}
					member.save(callback);
				}
			});
		}
	});
}

module.exports.newPayment = function(memberId, membershipId, input, res, callback){
	Member.findById(memberId, function (err, member){
		if (err)
			return res.json({success: false, msg: 'Member not found.'});
		member.totalDebt = member.totalDebt - input.amount;
		member.memberships.forEach(membership => {
			if(membership._id == membershipId){
				membership.debt = membership.debt - input.amount;
				membership.log.unshift({
					date: input.date,
					amount: input.amount
				});
			}
		});
		member.save(callback);
	});
}

// Delete

module.exports.removeMember = function(memberId, callback){
	var query = {_id: memberId};
	Member.findOneAndRemove(query, callback);
}

module.exports.removeMembership = function(memberId, membershipId, res, callback){
	Member.findById(memberId, function(err, member){
		if (err) 
			return res.json({success: false, msg: 'Member not found.'});
		var counter = 0;
		member.memberships.forEach(membership =>{
			if(membership._id == membershipId){
				member.totalDebt = member.totalDebt - membership.debt;
				member.memberships.splice(counter,1);
			}
			counter++;
		});
		member.save(callback);
	})
}

module.exports.removePayment = function(memberId, membershipId, paymentId, res, callback){
	Member.findById(memberId, function(err, member){
		if (err) 
			return res.json({success: false, msg: 'Member not found.'});
		var counter = 0;
		member.memberships.forEach(membership =>{
			if(membership._id == membershipId){
				membership.log.forEach(payment =>{
					if(payment._id == paymentId){
						member.totalDebt += payment.amount;
						membership.debt += payment.amount;
						membership.log.splice(counter,1);
					}
					counter++;
				});
			}
		});
		member.save(callback);
	})
}

// Put

module.exports.updateMemberInfo = function(memberId, input, callback){
	var query = {_id: memberId};
	var update = {
		$set: {
			name: input.name,
			phoneNum: input.phoneNum,
			email: input.email
		}
	};
	var options = { new: true };

	Member.findOneAndUpdate(query, update, options, callback);
}

// Get

module.exports.getMember = function(memberId, callback){
	var query = {_id: memberId};
	Member.findOne(query, callback);
}

module.exports.searchMembers = function(userId, name, callback){
	var query = {
		userId: userId,
		name: { $regex: name, $options: "i" }
	};
	Member.find(query, callback);
}



// Old

module.exports.getMembers = function(userId, sortId, callback){
	var query, criterion;
	switch(parseInt(sortId)){
		case 00: {
			query = {userId: userId};
			criterion = { name: -1 };
		}
		break;
		case 10: {
			query = {userId: userId};
			criterion = { debt: -1 };
		}
		break;
		case 20: {
			query = { userId: userId, daysLeft: { $gte: 0 } };
			criterion = { daysLeft: -1};
		}
		break;
		case 30: {
			query = {userId: userId};
			criterion = { startDate: -1 };
		}
		break;
		case 01: {
			query = {userId: userId};
			criterion = { name: 1 };
		}
		break;
		case 11: {
			query = {userId: userId};
			criterion = { debt: 1 };
		}
		break;
		case 21: {
			query = { userId: userId, daysLeft: { $gte: 0 } };
			criterion = { daysLeft: 1};
		}
		break;
		case 31: {
			query = {userId: userId};
			criterion = { startDate: 1 };
		}
		break;
		default:
			console.log('SortId is not valid');
	}
	Member.find(query,{},{sort: criterion}, callback)
}

module.exports.getStat = function(userId, statId, res){
	switch(parseInt(statId)){
		case 1:
			Member.count({ userId: userId }, function(err, count){
				if(err)
					res.json({ success: false, msg: 'Failed to fetch number of members.'});
				res.json({ success: true, data: count});
			});
			break;
		case 2:
			Member.count({ userId: userId, daysLeft: { $gt: 0 } }, function(err, count){
				if(err)
					res.json({ success: false, msg: 'Failed to fetch number of active members.'});
				res.json({ success: true, data: count});
			});
			break;
		case 3:
			Member.count({ userId: userId, debt: { $gt: 0 } }, function(err, count){
				if(err)
					res.json({ success: false, msg: 'Failed to fetch number of unpaid memberships.'});
				res.json({ success: true, data: count});
			});
			break;
		case 4:
			Member.find({userId: userId}, function(err, members){
				if(err)
					res.json({ success: false, msg: 'Failed to fetch unpaid amount.'});
				var sum = 0;
				members.forEach(member => {
					sum = sum + member.debt;
				});
				res.json({ success: true, data: sum});
			});
			break;
		default:
			console.log('StatId ' + statId + ' is not valid.');
	}
}