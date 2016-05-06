var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Account = new Schema({
	username: String,
	password: String,
	emailAddress: String,
	token: String,
	frequency: String,
	quantity: String,
	grind: String,
	fullName: String,
	address1: String,
	address2: String,
	city: String,
	state: String,
	zipCode: String,
	deliveryDate: String,
	plan: String
});

module.exports = mongoose.model('Account', Account)