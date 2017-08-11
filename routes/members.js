var express = require('express');
var router = express.Router();
var passport = require('passport');

var config = require('../config/database');
var Member = require('../models/member.model');

// Load
/*
router.get('/', function (req, res, next) {
	console.log('loading orders.');
	Order.find({}).exec(function (err, orders) {
		if(err)
			console.log('error loading orders.');
		res.json(orders);
	});
});
*/
// Save
router.post('/', function (req, res, next) {
	var newMember = new Member({
		gym: req.body.gym,
		name: req.body.name,
		phoneNum: req.body.phoneNum,
		email: req.body.email,
		//dateStarted: new  Date(),
		length: req.body.length,
		type: req.body.type,
		cost: req.body.cost,
		paid: req.body.paid,
		//datePaid: addToSet(new Date())
	});

	console.log(newMember);
	/*
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
	*/
});
/*
// Delete
router.delete('/:id', function (req, res, next) {
	Order.findOneAndRemove(
		{
			//query
			_id: req.params.id
		}, function (err, deletedOrder) {
			if(err)
				console.log('error deleting order.');
			res.json(deletedOrder);
		});
});

//Update
router.put('/:id', function (req, res, next) {
	Order.findOneAndUpdate({
		_id: req.params.id
	},{
		$set: {name: req.body.name, drink: req.body.drink}
	},function (err, updatetedBook) {
		if(err)
			console.log('error updating order.');
		res.json(updatetedBook);
	})
});
*/
module.exports = router;