//--- constants
const USER_TYPE_MANAGER = 4;
const USER_TYPE_CONTRACTOR = 1;
const USER_TYPE_TENANT = 3;
const USER_TYPE_STAFF = 5;
const USER_TYPE_NAMES = ['n/a', 'Contractor', 'Admin', 'Tenant', 'Manager', 'Staff'];

function is_int(value) {
	if ((parseFloat(value) == parseInt(value)) && !isNaN(value)) {
		return true;
	} else {
		return false;
	}
}

var Marker = function (data) {
	data = data || {};
	this.x = data.x;
	this.y = data.y;
	this.num = data.num;
};


var KeyValue = function(key, value) {
	this.key = key;
	this.value = value;
};
var kitchenCheckboxes = [];
var bedroomCheckboxes = [];
var bathroomCheckboxes = [];
var TicketDetails = function(data) {
	data = data || {};
	this.kitchen = data.kitchen || [];
	this.bedroom = data.bedroom || [];
	this.bathroom = data.bathroom || [];
};

kitchenCheckboxes.push(new KeyValue("Sink",0));
kitchenCheckboxes.push(new KeyValue("Dishwasher",0));
kitchenCheckboxes.push(new KeyValue("Stove", 0));
kitchenCheckboxes.push(new KeyValue("Oven",0));
kitchenCheckboxes.push(new KeyValue("Refrigerator",0));
kitchenCheckboxes.push(new KeyValue("Garbage Disposal",0));

bathroomCheckboxes.push(new KeyValue("Sink",0));
bathroomCheckboxes.push(new KeyValue("Toilet",0));
bathroomCheckboxes.push(new KeyValue("Tub",0));
bathroomCheckboxes.push(new KeyValue("Shower",0));
bathroomCheckboxes.push(new KeyValue("Mirror",0));
bathroomCheckboxes.push(new KeyValue("Fan",0));

bedroomCheckboxes.push(new KeyValue("Fan",0));
bedroomCheckboxes.push(new KeyValue("Outlet",0));
bedroomCheckboxes.push(new KeyValue("Closet",0));
bedroomCheckboxes.push(new KeyValue("Door",0));
bedroomCheckboxes.push(new KeyValue("AC Vent",0));
bedroomCheckboxes.push(new KeyValue("Carpet",0));

var ticketDetails = new TicketDetails({
	kitchen: kitchenCheckboxes,
	bedroom: bedroomCheckboxes,
	bathroom: bathroomCheckboxes
});

// console.log(ticketDetails);

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


function formatDateTime(string){
	if (!string) return "";
	if (string.length < 15) return "";
	var yyyy = string.substring(0, 4);
	var mm = string.substring(4, 6);
	var dd = string.substring(6, 8);
	var hour = string.substring(9, 11);
	var min = string.substring(11, 13);
	var sec = string.substring(13, 15);
	return mm+ "-" + dd + "-" + yyyy + " " + hour + ":" + min + ":" + sec;
}

function formatPhone(string){
	if (!string) return "";
	if (string.length < 10) return "";
	var output = "";
	for (var i=0; i < string.length; i++) {
		if (i === 0){
			output += '(';
		}
		if (i===2) {
			output += ') ';
		}
		if (i===6) {
			output += '-';
		}

		output += string[i];
	}

	return output;
}

$(document).ready(function () {

	(function ($) {
		$(document).ready(function () {
			$(window).scroll(function () {
				if ($(this).scrollTop() > 150) {
					$('#scroll-nav').fadeIn(500);
				} else {
					$('#scroll-nav').fadeOut(500);
				}
			});
		});
	})(jQuery);
});
