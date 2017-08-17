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
		mName: String,
		start: Date,
		end: Date,
		daysLeft: Number,
		length: Number,
		cost: Number,
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

module.exports.addMember = function (userId, input, res) {
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
				mName: item.name,
				start: input.start,
				end: end,
				daysLeft: daysLeft,
				length: item.length,
				cost: item.cost,
				debt: debt,
			});
			if(input.amount){
				newMember.memberships[0].log.unshift({
					date: input.start,
					amount: input.amount
				});
			}
			newMember.save(function (err, member) {
				if(err)
					res.json({ success: false, msg: 'Failed to add member.'});
				else
					res.json({ success: true, msg: 'New member added.' });
			});
		}
	});
}

module.exports.newMembership = function(memberId, input, res){
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
						mName: item.name,
						start: input.start,
						end: end,
						daysLeft: daysLeft,
						length: item.length,
						cost: item.cost,
						debt: debt,
					});
					if(input.amount){
						member.memberships[0].log.unshift({
							date: input.start,
							amount: input.amount
						});
					}
					member.save(function(err, member){
						if(err)
							res.json({ success: false, msg: 'Failed to create new membership.'});
						else
							res.json({ success: true, msg: 'Membership created.' });
					});
				}
			});
		}
	});
}

module.exports.newPayment = function(memberId, membershipId, input, res){
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
		member.save(function(err, member){
			if(err)
				res.json({ success: false, msg: 'Failed to log the payment.'});
			else
				res.json({ success: true, msg: 'Payment logged.' });
		});
	});
}

// Delete

module.exports.removeMember = function(memberId, callback){
	var query = {_id: memberId};
	Member.findOneAndRemove(query, callback);
}

module.exports.removeMembership = function(memberId, membershipId, res){
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
		member.save(function(err, exMember){
			if(err)
				res.json({ success: false, msg: 'Failed to remove membership.' });
			else
				res.json({ success: true, msg: 'Membership is removed.' });
		});
	})
}

module.exports.removePayment = function(memberId, membershipId, paymentId, res){
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
		member.save( function(err, exMember){
			if(err)
				res.json({ success: false, msg: 'Failed to remove payment.' });
			else
				res.json({ success: true, msg: 'Payment is removed.' });
		});
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

module.exports.updateDaysLeft = function(userId, input, res){
	Member.find({userId: userId}, function(err, members){
		if(err)
			res.json({ success: false, msg: 'Failed to update remaining days.'});
		else{
			members.forEach(member =>{
				member.membership.forEach(membership => {
					if(membership.daysLeft != 0)
						membership.daysLeft = getDaysLeft(input.date, membership.end);
				});
				member.save(function(err, updatedMember){
					if(err)
						return res.json({ success: false, msg: 'Failed to update remaining days.'});
				});
			});
		}
	});
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

module.exports.getStatistics = function(userId, res){
	Member.find({userId: userId}, function(err, members){
		if(err)
			res.json({ success: false, msg: 'Failed to get statistics.'});
		else{
			var membersCount = 0;
			var activeMembers = 0;
			var indeptedMembers = 0;
			var unpaidAmount = 0;
			members.forEach(member =>{
				if(member.memberships[0].daysLeft > 0)
					activeMembers++;
				if(member.totalDebt > 0)
					indeptedMembers++;
				unpaidAmount += totalDebt;
				membersCount++;
			});
			res.json({
				members: membersCount,
				activeMembers: activeMembers,
				indeptedMembers: indeptedMembers,
				unpaidAmount: unpaidAmount
			});
		}
	});
}

module.exports.getMembers = function(userId, callback){
	var query = {userId: userId};
	var criterion = { name: -1 };
	Member.find(query,{},{sort: criterion}, callback);
}

module.exports.getActiveMembers = function(userId, res){
	Member.find({userId: userId}, function(err, members){
		if(err)
			res.json({ success: false, msg: 'Failed to get active members.'});
		else{
			var activeMem = [];
			members.forEach(member =>{
				var newMember = {
					name: member.name,
					debt: member.totalDebt,
					start: member.memberships[0].start,
					left: member.memberships[0].daysLeft
				};
				activeMem.push(newMember);
			});
			// sort
			// return
		}
	});
}