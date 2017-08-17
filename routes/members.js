var express = require('express');
var router = express.Router();
var Member = require('../models/member.model');

// New Member
router.post('/:userId', function (req, res, next) {
	Member.addMember(req.params.userId, req.body, res, function (err, member) {
		if(err)
			res.json({ success: false, msg: 'Failed to add member.'});
		else
			res.json({ success: true, msg: 'New member added.' });
	});
});

// New Membership
router.post('/member/:memberId', function (req, res, next){
	Member.newMembership(req.params.memberId, req.body, res, function(err, member){
		if(err)
			res.json({ success: false, msg: 'Failed to create new membership.'});
		else
			res.json({ success: true, msg: 'Membership created.' });
	});
});

// New Payment
router.post('/member/:memberId/membership/:membershipId', function (req, res, next){
	Member.newPayment(req.params.memberId, req.params.membershipId, req.body, res, function(err, member){
		if(err)
			res.json({ success: false, msg: 'Failed to log the payment.'});
		else
			res.json({ success: true, msg: 'Payment logged.' });
	});
});

// Delete Member
router.delete('/member/:memberId', function (req, res, next) {
	Member.removeMember(req.params.memberId, function(err, exMember){
		if(err)
			res.json({ success: false, msg: 'Failed to remove member.' });
		else
			res.json({ success: true, msg: exMember.name + ' is removed.' });
	});
});

// Delete Membership
router.delete('/member/:memberId/membership/:membershipId', function (req, res, next) {
	Member.removeMembership(req.params.memberId, req.params.membershipId, res, function(err, exMember){
		if(err)
			res.json({ success: false, msg: 'Failed to remove membership.' });
		else
			res.json({ success: true, msg: 'Membership is removed.' });
	});
});

// Delete Payment
router.delete('/member/:memberId/membership/:membershipId/payment/:paymentId', function (req, res, next) {
	Member.removePayment(req.params.memberId, req.params.membershipId, req.params.paymentId, res, function(err, exMember){
		if(err)
			res.json({ success: false, msg: 'Failed to remove payment.' });
		else
			res.json({ success: true, msg: 'Payment is removed.' });
	});
});

// Update Member Info
router.put('/member/:memberId', function (req, res, next) {
	Member.updateMemberInfo(req.params.memberId, req.body, function(err, updatedMember){
		if(err)
			res.json({ success: false, msg: 'Failed to update member information.' });
		else
			res.json({ success: true, msg: updatedMember.name + ' is now updated.', member: updatedMember});
	});
});

// Load Member (Id) - rework return
router.get('/member/:memberId', function(req, res, next){
	Member.getMember(req.params.memberId, function(err, member){
		if(err)
			res.json({ success: false, msg: 'Failed to load member by ID.' });
		else
			res.json(member);
	});
});

// Load Member/s (Name) - rework return
router.get('/:userId/search/:search', function (req, res, next) {
	Member.searchMembers(req.params.userId, req.params.search, function (err, members){
		if(err)
			res.json({ success: false, msg: 'Search failed.'});
		else
			res.json(members);
	});
});


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
// Load Stat by ID
// #1 - Number of members
// #2 - Number of active members
// #3 - Number of unpaid memberships
// #4 - Total unpaid amount
router.get('/:userId/stat/:statId', function (req, res, next) {
	Member.getStat(req.params.userId, req.params.statId, res);
});

module.exports = router;