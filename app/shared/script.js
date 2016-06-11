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
	this.kitchen = data.kitchen;
	this.bedroom = data.bedroom;
	this.bathroom = data.bathroom;
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



console.log(ticketDetails);

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
