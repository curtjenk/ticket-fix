var util = require('../util');

var Contractor = function (data) {
	data = data || {};
	//console.log(data);
	if (data.id) {
		this.id = data.id;
	}
	this.account_id = data.account_id;
	this.user_id = data.user_id;
	this.region_1_radius = data.region_1_radius;
	this.region_1_city = data.region_1_city;
	this.region_1_state = data.region_1_state;
	this.region_1_zip = data.region_1_zip;

	this.region_2_radius = data.region_2_zip_radius;
	this.region_2_city = data.region_2_city;
	this.region_2_state = data.region_2_state;
	this.region_2_zip = data.region_2_zip;

	this.region_3_radius = data.region_3_radius;
	this.region_3_city = data.region_3_city;
	this.region_3_state = data.region_3_state;
	this.region_3_zip = data.region_3_zip;
};

module.exports = Contractor;
