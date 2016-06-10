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
	this.alt_phone = data.alt_phone;
	this.alt_first_name = data.alt_first_name;
	this.alt_last_name = data.alt_email;
	this.details_json = data.details_json;
	this.markers_json = data.markers_json;
	if (data.date_resolved) {
		this.date_resolved = data.date_resolved;
	}
};

module.exports = Ticket;
