var util = require('../util');

var Manager = function (data) {
	data = data || {};
	//console.log(data);
	if (data.id) {
		this.id = data.id;
	}
	this.account_id = data.account_id;
	this.user_id = data.user_id;
};
var ManagerHasProperty = function (data) {
	data = data || {};
	//console.log(data);
	this.manager_id = data.manager_id;
	this.property_id = data.property_id;
};

exports.Manager = Manager;
exports.ManagerHasProperty = ManagerHasProperty;
