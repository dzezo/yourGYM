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
			var daysLeft = getDaysLeft(input.submitTime, end);
			var debt = item.cost - ((input.amount)?input.amount:0);
			var newMember = new Member({
				userId: userId,
				name: input.name,
				totalDebt: debt
			});
			if(input.phone)
				newMember.phone = input.phone;
			if(input.email)
				newMember.email = input.email;
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
					res.json({ 
						success: true, 
						msg: 'New member added.', 
						member: {
							id: member._id,
							name: member.name,
							debt: member.totalDebt,
							start: member.memberships[0].start,
							left: member.memberships[0].daysLeft
						} 
					});
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
					var daysLeft = getDaysLeft(input.submitTime, end);
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
							res.json({ success: true, msg: 'Membership created.', member: member });
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
				res.json({ success: true, msg: 'Payment logged.', member: member });
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
		if (member.memberships.length == 1)
			return res.json({success: false, msg: 'Member must have at least one membership.'});
		var counter = 0;
		member.memberships.forEach(membership =>{
			if(membership._id == membershipId){
				member.totalDebt = member.totalDebt - membership.debt;
				member.memberships.splice(counter,1);
			}
			counter++;
		});
		member.save(function(err, member){
			if(err)
				res.json({ success: false, msg: 'Failed to remove membership.' });
			else
				res.json({ success: true, msg: 'Membership is removed.', newTotalDebt: member.totalDebt });
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
		member.save( function(err, member){
			if(err)
				res.json({ success: false, msg: 'Failed to remove payment.' });
			else
				res.json({ success: true, msg: 'Payment is removed.', member: member });
		});
	})
}

// Put

module.exports.updateMemberInfo = function(memberId, input, callback){
	var query = {_id: memberId};
	var update = {
		$set: {
			name: input.name,
			phone: input.phone,
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
				member.memberships.forEach(membership => {
					if(membership.daysLeft != 0)
						membership.daysLeft = getDaysLeft(input.date, membership.end);
				});
				member.save();
			});
			res.json({ success: true, msg: 'Remaining days updated.'});
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
				unpaidAmount += member.totalDebt;
				membersCount++;
			});
			var statistics = {
				members: membersCount,
				activeMembers: activeMembers,
				indeptedMembers: indeptedMembers,
				unpaidAmount: unpaidAmount
			};
			res.json(statistics);
		}
	});
}

module.exports.getMembers = function(userId, callback){
	var query = {userId: userId};
	var criterion = { totalDebt: -1 };
	Member.find(query,{},{sort: criterion}, callback);
}

module.exports.getActiveMembers = function(userId, res){
	Member.find({userId: userId}, function(err, members){
		if(err)
			res.json({ success: false, msg: 'Failed to get active members.'});
		else{
			var activeMem = [];
			members.forEach(member =>{
				if(member.memberships[0].daysLeft > 0){
					var newMember = {
						id: member._id,
						name: member.name,
						debt: member.totalDebt,
						start: member.memberships[0].start,
						left: member.memberships[0].daysLeft
					};
					activeMem.push(newMember);
				}
			});
			var i,j,min, tmp;
			for(i = 0; i < activeMem.length - 1; i++){
				min = i;
				for (j = i+1; j < activeMem.length; j++){
					if(activeMem[min].left > activeMem[j].left)
						min = j;
				}
				if(min != i){
					tmp = activeMem[i];
					activeMem[i] = activeMem[min];
					activeMem[min] = tmp;
				}
			}
			res.json(activeMem);
		}
	});
}
