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
		debt: Number,
		log: [{
			date: Date,
			amount: Number
		}]
	}]
});

var Member = module.exports = mongoose.model('Member', MemberSchema);

module.exports.addMember = function (userId, input, callback) {
	var newMember = new Member({
		userId: userId,
		name: input.name,
		phone: input.phone,
		email: input.email
	});

	Pricelist.findOne({_id: input.membershipId}, function(err, item){
		if (err)
			return res.json({success: false, msg: 'Membership type not found.'});
		if(input.amount){
			// Dug za clanarinu
			var debt = item.cost - input.amount;
			var start = new Date(input.start);
			var length = 1000*60*60*24*parseInt(item.length);
			// Krajnji datum
			var end = new Date(start.getTime() + length);
			newMember.totalDebt = debt;
			newMember.memberships.unshift({
				membershipId: input.membershipId,
				start: input.start,
				end: end,
				debt: debt,
			});
			newMember.memberships[0].log.unshift({
				date: input.start,
				amount: input.amount
			});
			newMember.save(callback);
		}
	});
}

// calculate end
// calculate debt
// calculate totaldebt
module.exports.newMembership = function(userId, memberId, input, callback){
	var query = {userId: userId, _id: memberId, 'memberships._id': "599391be6b957013ac3318ee"};
	var update = {
		$push: {
			'memberships.$.log': {
				date: input.start,
				amount: input.amount
			}
		}
	};

	Member.findOneAndUpdate(query, update, callback);
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

module.exports.getByName = function(userId, name, callback){
	var query = {
		userId: userId,
		name: { $regex: name, $options: "i" }
	};
	Member.find(query, callback);
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