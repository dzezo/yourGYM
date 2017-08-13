var express = require('express');
var router = express.Router();
var config = require('../config/database');
var Member = require('../models/member.model');

// Load
// Load Members
router.get('/:userId', function (req, res, next) {
	Member.getMembers(req.params.userId, function (err, members){
		if(err)
			res.json({ success: false, msg: 'Failed to load members.'});
		res.json(members);
	});
});
// Load Member
router.get('/:userId/member/:memberId', function(req, res, next){
	Member.getMember(req.params.userId, req.params.memberId, function(err, member){
		if(err)
			res.json({
				success: false,
				msg: 'Failed to load member.'
			});
		res.json({
			success: true,
			member: member
		});
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
router.delete('/:userId/member/:memberId/payment/:paymentId', function (req, res, next) {
	Member.removeMember(req.params.userId, req.params.memberId, req.params.paymentId, function(err, member){
		if(err)
			res.json({
				success: false,
				msg: 'Failed to remove payment.'
			});
		res.json({
			success: true,
			msg: 'Payment is removed.'
		});
	});
});

// Update
// Membership Update 
router.put('/:userId/membership/:memberId', function (req, res, next) {
	Member.updateMembership(req.params.userId, req.params.memberId, req.body, function(err, updatedMember){
		if(err)
			res.json({
				success: false,
				msg: 'Failed to update membership information.'
			});
		res.json({
			success: true,
			msg: updatedMember.name + ' membership is now updated.'
		});
	});
});
// Member Info Update
router.put('/:userId/memberinfo/:memberId', function (req, res, next) {
	Member.updateMemberInfo(req.params.userId, req.params.memberId, req.body, function(err, updatedMember){
		if(err)
			res.json({
				success: false,
				msg: 'Failed to update member information.'
			});
		res.json({
			success: true,
			msg: updatedMember.name + ' is now updated.'
		});
	});
});
// Member Payment Update
router.put('/:userId/memberpaid/:memberId', function (req, res, next) {
	Member.updateMemberPayments(req.params.userId, req.params.memberId, req.body, function(err, updatedMember){
		if(err)
			res.json({
				success: false,
				msg: 'Failed to log the payment.'
			});
		res.json({
			success: true,
			msg: updatedMember.name + ' payment logged.'
		});
	});
});

module.exports = router;