var express = require('express');
var router = express.Router();
var config = require('../config/database');
var Member = require('../models/member.model');

// Load
// Load Members
router.get('/:userId/criteria/:criteria', function (req, res, next) {

	var day = 1000*60*60*24;
	var date1 = new Date("2017-08-14T00:00:00.000Z");
	var date2 = new Date("2018-08-14T00:00:00.000Z");
	var date = date2.getTime() - date1.getTime();
	console.log(Math.round(date/day));

	Member.getMembers(req.params.userId, req.params.criteria, function (err, members){
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