var util = require('../util');

var Ticket = function (data) {
	data = data || {};
	//console.log(data);
	if (data.id) {
		this.id = data.id;
	}
	if (data.date_create) {
		this.id = data.id;
	}
	this.user_id = data.user_id;
	this.property_id = data.property_id;
	this.status_id = data.status_id;
	this.issue_description = data.issue_description;
	if (data.date_resolved) {
		this.date_resolved = data.date_resolved;
	}
};
Property.prototype.genCode = function () {
	this.code = util.generateCode('P', 9);
	//console.log(this.account_code);
};
module.exports = Property;
