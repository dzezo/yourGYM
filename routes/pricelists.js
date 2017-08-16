var express = require('express');
var router = express.Router();
var Pricelist = require('../models/pricelist.model');

router.get('/:userId', function (req, res, next) {
	Pricelist.loadPricelist(req.params.userId, function (err, pricelist){
		if(err)
			res.json({success: false, msg: 'pricelist loading failed.'});
		else
			res.json(pricelist);
	});
});

router.get('/:userId/item/:pricelistId', function (req, res, next) {
	Pricelist.loadItem(req.params.userId, req.params.pricelistId, function(err, item){
		if(err)
			res.json({success: false, msg: 'Loading of pricelist item failed.'});
		else
			res.json(item);
	});
});

router.post('/:userId', function (req, res, next) {
	var newItem = new Pricelist({
		userId: req.params.userId,
		name: req.body.name,
		length: req.body.length,
		cost: req.body.cost
	});

	newItem.save(function (err, savedItem){
		if(err)
			res.json({ success: false, msg: 'Failed to save item.' });
		else
			res.json({ success: true, msg: 'New item saved.'});
	});
});

router.delete('/:userId/item/:pricelistId', function (req, res, next) {
	Pricelist.removeItem(req.params.userId, req.params.pricelistId, function(err, deletedItem){
		if(err)
			res.json({ success: false, msg: 'Failed to remove item.' });
		else
			res.json({ success: true, msg: deletedItem.name + ' is removed.' });
	});
});

router.put('/:userId/item/:pricelistId', function (req, res, next) {
	Pricelist.updateItem(req.params.userId, req.params.pricelistId, req.body, function(err, updatedItem){
		if(err)
			res.json({ success: false, msg: 'Failed to update item information.' });
		else
			res.json({ success: true, msg: updatedItem.name + ' is now updated.' });
	});
});

module.exports = router;