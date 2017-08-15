var express = require('express');
var router = express.Router();
var config = require('../config/database');
var Member = require('../models/member.model');

// Load
// Load Sorted
// #00/01 - Name
// #10/11 - Debt
// #20/21 - Days Left
// #30/31 - Start Date
router.get('/:userId/sortby/:sortId', function (req, res, next) {
	Member.getMembers(req.params.userId, req.params.sortId, function (err, members){
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
				msg: 'Failed to load member by ID.'
			});
		res.json(member);
	});
});
// Load Member/s by Name
router.get('/:userId/search/:search', function (req, res, next) {
	Member.getByName(req.params.userId, req.params.search, function (err, members){
		if(err)
			res.json({ success: false, msg: 'Search failed.'});
		res.json(members);
	});
});
// Load Stat by ID
// #1 - Number of members
// #2 - Number of active members
// #3 - Number of unpaid memberships
// #4 - Total unpaid amount
router.get('/:userId/stat/:statId', function (req, res, next) {
	Member.getStat(req.params.userId, req.params.statId, res);
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
// Member Undo Payment
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