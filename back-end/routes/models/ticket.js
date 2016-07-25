var util = require('../util');

var Ticket = function (data) {
	data = data || {};
	//console.log(data);
	if (data.id) {
		this.id = data.id;
	}
	if (data.date_create) {
		this.date_create = data.date_create;
	}
	this.client_datetime_string = data.client_datetime_string;
	this.user_id = data.user_id;
	this.property_id = data.property_id;

	this.contact_first_name = data.contact_first_name;
	this.contact_last_name = data.contact_last_name;
	this.contact_email = data.contact_email;
	this.contact_phone = data.contact_phone;
	this.contact_mobile = data.contact_mobile;
	this.pet = data.pet;
	this.entry_point = data.entry_point;

	this.alt_phone = data.alt_phone;
	this.alt_first_name = data.alt_first_name;
	this.alt_last_name = data.alt_last_name;
	this.alt_email = data.alt_email;
	this.issue_description = data.issue_description;
	this.details_json = data.details_json;
	this.markers_json = data.markers_json;
	this.notify_preference = data.notify_preference;
	this.enter_if_absent = data.enter_if_absent;
	this.agree = data.agree;
	if (data.date_resolved) {
		this.date_resolved = data.date_resolved;
	}
	if (data.status_id) {
		this.status_id = data.status_id;
	}
};
module.exports = Ticket;
