var express = require('express');
var router = express.Router();
var Member = require('../models/member.model');

// New Member
router.post('/:userId', function (req, res, next) {
	Member.addMember(req.params.userId, req.body, res);
});

// New Membership
router.post('/member/:memberId', function (req, res, next){
	Member.newMembership(req.params.memberId, req.body, res);
});

// New Payment
router.post('/member/:memberId/membership/:membershipId', function (req, res, next){
	Member.newPayment(req.params.memberId, req.params.membershipId, req.body, res);
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
	Member.removeMembership(req.params.memberId, req.params.membershipId, res);
});

// Delete Payment
router.delete('/member/:memberId/membership/:membershipId/payment/:paymentId', function (req, res, next) {
	Member.removePayment(req.params.memberId, req.params.membershipId, req.params.paymentId, res);
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

// Update Days Left
router.put('/:userId', function (req, res, next) {
	Member.updateDaysLeft(req.params.userId, req.body, res);
});

// Load Member (Id)
router.get('/member/:memberId', function(req, res, next){
	Member.getMember(req.params.memberId, function(err, member){
		if(err)
			res.json({ success: false, msg: 'Failed to load member by ID.' });
		else
			res.json(member);
	});
});

// Load Member/s (Name)
router.get('/:userId/search/:search', function (req, res, next) {
	Member.searchMembers(req.params.userId, req.params.search, function (err, members){
		if(err)
			res.json({ success: false, msg: 'Search failed.'});
		else{
			var memArr = [];
			members.forEach(member =>{
				var newMember = {
					name: member.name,
					debt: member.totalDebt,
					start: member.memberships[0].start,
					left: member.memberships[0].daysLeft
				};
				memArr.push(newMember);
			});
			res.json(memArr);
		}
	});
});

// Load Members
router.get('/:userId', function (req, res, next) {
	Member.getMembers(req.params.userId, function (err, members){
		if(err)
			res.json({ success: false, msg: 'Failed to load members.'});
		else{
			var memArr = [];
			members.forEach(member =>{
				var newMember = {
					name: member.name,
					debt: member.totalDebt,
					start: member.memberships[0].start,
					left: member.memberships[0].daysLeft
				};
				memArr.push(newMember);
			});
			res.json(memArr);
		}
	});
});

// Load Active Members
router.get('/:userId', function (req, res, next) {
	Member.getActiveMembers(req.params.userId, function (err, members){
		if(err)
			res.json({ success: false, msg: 'Failed to load active members.'});
		else
			res.json(members);
	});
});

// Load Statistics
router.get('/:userId/statistics', function (req, res, next) {
	Member.getStatistics(req.params.userId, req.params.statId, res);
});

module.exports = router;