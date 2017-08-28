var mongoose = require('mongoose');

// Pricelist Schema
var PricelistSchema = mongoose.Schema({
	userId : {
		type: mongoose.Schema.ObjectId,
		index: true,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	length: {
		type: Number,
		required: true
	},
	cost: {
		type: Number,
		required: true
	}
});

var Pricelist = module.exports = mongoose.model('Pricelist', PricelistSchema);

module.exports.loadPricelist = function(userId, callback){
	var query = {userId: userId};
	var project = {};
	var options = {sort: { length: 1 }};
	Pricelist.find(query, project, options, callback);
}

module.exports.loadItem = function(itemId, callback){
	var query = {_id: itemId};
	Pricelist.findOne(query, callback);
}

module.exports.removeItem = function(itemId, callback){
	var query = {_id: itemId};
	Pricelist.findOneAndRemove(query, callback);
}

module.exports.updateItem = function(itemId, update, callback){
	var query = {_id: itemId};
	var update = {
		$set: {
			name: update.name,
			length: update.length,
			cost: update.cost
		}
	};
	var options = { new: true };

	Pricelist.findOneAndUpdate(query, update, options, callback);
}