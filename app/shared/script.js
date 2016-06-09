function is_int(value) {
	if ((parseFloat(value) == parseInt(value)) && !isNaN(value)) {
		return true;
	} else {
		return false;
	}
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
