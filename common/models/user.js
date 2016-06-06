var User = function (data) {
	data = data || {};
	if (data.id) {
		this.id = data.id;
	}
	this.email = data.email;
	if (data.username) {
		this.username = data.username;
	}
	this.password = data.password;
	this.type_user_id = data.type_user_id;
	this.first_name = data.first_name;
	this.last_name = data.last_name;
	this.home_phone = data.home_phone;
	this.mobile_phone = data.mobile_phone;
	if (data.create_time) {
		this.create_time = data.create_time;
	}
};
