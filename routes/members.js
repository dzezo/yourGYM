var express = require('express');
var router = express.Router();
var config = require('../config/database');
var Member = require('../models/member.model');

// Load
// Load Members
router.get('/:userId/criteria/:criteria/limit/:limit', function (req, res, next) {
	Member.getMembers(req.params.userId, req.params.criteria, req.params.limit, function (err, members){
		if(err)
			res.json({ success: false, msg: 'Failed to load members.'});
		res.json(members);
	});
});
// Load Member by Id
router.get('/:userId/member/:memberId', function(req, res, next){
	Member.getMember(req.params.userId, req.params.memberId, function(err, member){
		if(err)
			res.json({
				success: false,
				msg: 'Failed to load member.'
			});
		res.json(member);
	});
});
// Load Member by Username
// Load Stats
router.get('/:userId/stat/:stat', function (req, res, next) {
	Member.getStat(req.params.userId, req.params.stat, function (err, members){
		if(err)
			res.json({ success: false, msg: 'Failed to load members.'});
		res.json(members);
	});
});

// Save
router.post('/:userId', function (req, res, next) {
	Member.addMember(req.params.userId, req.body, function (err, member) {
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
	Member.removeMemberPayment(req.params.userId, req.params.memberId, req.params.paymentId, function(err, member){
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
// Membership Renewal 
router.put('/:userId/renew/:memberId', function (req, res, next) {
	Member.renewMembership(req.params.userId, req.params.memberId, req.body, function(err, updatedMember){
		if(err)
			res.json({
				success: false,
				msg: 'Failed to renew membership.'
			});
		res.json({
			success: true,
			msg: updatedMember.name + ' membership is now renewed.'
		});
	});
});

// Member Payment
// Member Make Payment
router.put('/:userId/pay/:memberId', function (req, res, next) {
	Member.makePayment(req.params.userId, req.params.memberId, req.body, function(err, updatedMember){
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
// Member Cancel Payment
router.put('/:userId/undopaid/:memberId/payment/:paymentId', function (req, res, next) {
	Member.undoPayment(req.params.userId, req.params.memberId, req.params.paymentId, req.body, function(err, updatedMember){
		if(err)
			res.json({
				success: false,
				msg: 'Failed to undo the payment.'
			});
		res.json({
			success: true,
			msg: updatedMember.name + ' payment undone.'
		});
	});
});

module.exports = router;