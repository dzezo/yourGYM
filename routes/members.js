var express = require('express');
var router = express.Router();
var passport = require('passport');

var config = require('../config/database');
var Member = require('../models/member.model');

// Load
router.get('/:userId', function (req, res, next) {
	Member.getMembers(req.params.userId, function (err, members){
		if(err)
			res.json({ success: false, msg: 'Failed to load members.'});
		res.json(members);
	});
});

// Save
router.post('/:userId', function (req, res, next) {
	var newMember = new Member({
		// Member Info
		userId: req.params.userId,
		name: req.body.name,
		phoneNum: req.body.phoneNum,
		email: req.body.email
	});
	// Membership
	if(req.body.type)
		newMember.type = req.body.type;
	newMember.startDate = new Date(req.body.sDate);
	newMember.endDate = new Date(req.body.eDate);
	newMember.cost = req.body.cost;
	if(req.body.payDate && req.body.amount)
		newMember.paid.push({
			date: new Date(req.body.payDate), 
			amount: req.body.amount
		});
	newMember.debt = Member.calculateDebt(newMember.cost, newMember.paid);

	Member.addMember(newMember, function (err, member) {
		if(err)
			res.json({
				success: false,
				msg: 'Failed to add member.'
			});
		res.json({
			success: true,
			msg: 'New member added.'
		});
	});
});

// Delete
// Delete Member
router.delete('/:userId/member/:memberId', function (req, res, next) {
	Member.removeMember(req.params.userId, req.params.memberId, function(err, exMember){
		if(err)
			res.json({
				success: false,
				msg: 'Failed to remove member.'
			});
		res.json({
			success: true,
			msg: exMember.name + ' is removed.'
		});
	});
});

// Delete Payment Log


// Update
// Membership Update 
router.put('/:userId/membership/:memberId', function (req, res, next) {
	Member.updateMembership(req.params.userId, req.params.memberId, req.body, function(err, updatedMember){
		if(err)
			res.json({
				success: false,
				msg: 'Failed to update member.'
			});
		res.json({
			success: true,
			msg: updatedMember.name + ' is now updated.'
		});
	});
});

// Member Info Update

// Member Payment Update

module.exports = router;