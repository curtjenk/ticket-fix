var util = require('../util');

var Account = function (data) {
	data = data || {};
	//console.log(data);
	if (data.id) {
		this.id = data.id;
	}
	this.account_code = data.account_code;
	this.account_name = data.account_name;
	this.monthly_rate = data.monthly_rate;
	this.ticket_rate = data.ticket_rate;
	this.contact_name = data.contact_name;
	this.contact_email = data.contact_email;
	this.contact_phone = data.contact_phone;
	if (data.contracted_num_units) {
		this.contracted_num_units = data.contracted_num_units;
	}
};
Account.prototype.genCode = function () {
	this.account_code = util.generateCode('A', 7);
	//console.log(this.account_code);
};

module.exports = Account;
