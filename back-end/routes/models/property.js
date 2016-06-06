var util = require('../util');

var Property = function (data) {
	data = data || {};
	//console.log(data);
	if (data.id) {
		this.id = data.id;
	}
	this.code = data.code;
	this.address = data.address;
	this.city = data.city;
	this.state = data.state;
	this.zip = data.zip;
};
Property.prototype.genCode = function () {
	this.code = util.generateCode('P', 9);
	//console.log(this.account_code);
};
module.exports = Property;
