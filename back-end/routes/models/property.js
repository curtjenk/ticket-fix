var util = require('../util');

var Property = function (data) {
	data = data || {};
	//console.log(data);
	if (data.id) {
		this.id = data.id;
	}
	this.code = data.code;
	this.address1 = data.address1 || "";
	this.address2 = data.address2 || "";
	this.city = data.city || "";
	this.state = data.state || "";
	this.zip = data.zip || "";
	this.isManaged = data.isManaged;
};
Property.prototype.genCode = function () {
	this.code = util.generateCode('P', 9);
	//console.log(this.account_code);
};
Property.prototype.genKey = function () {
	this.key = this.zip.replace(/\s+/g, '') +
				this.address1.replace(/\s+/g, '') +
				this.address2.replace(/\s+/g, '');
};
module.exports = Property;
