var util = require('../util');

var Tenant = function (data) {
	data = data || {};
	//console.log(data);
	if (data.id) {
		this.id = data.id;
	}
	this.property_id = data.property_id;
	this.user_id = data.user_id;
};

module.exports = Tenant;
