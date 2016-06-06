var util = require('../util');

var Contractor = function (data) {
	data = data || {};
	//console.log(data);
	if (data.id) {
		this.id = data.id;
	}
	this.account_id = data.account_id;
	this.user_id = data.user_id;
	this.service_region_1_zip = data.service_region_1_zip;
	this.service_region_2_zip = data.service_region_2_zip;
	this.service_region_3_zip = data.service_region_3_zip;
	if (data.company_name) {
		this.company_name = data.company_name;
	}
};

module.exports = Contractor;
