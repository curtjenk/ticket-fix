ticketFixApp.controller('contractorController', function ($rootScope, $scope, $http, $sce, $q, $state, $location, apiAjax, zipLookup) {
	var tenantinfo = {};
	var user = $rootScope.user; // this is the logged-in user
	var email = user.email;
	$scope.page = {};
	$scope.page.viewByOptions = [3, 5, 10];
	$scope.page.currentPage = 1;
	$scope.page.pageSize = 5;
	$scope.page.viewby = 5;

	$scope.page.setItemsPerPage = function (num) {
		$scope.page.pageSize = num;
		$scope.page.currentPage = 1; //reset to first page
	};

	runGetContractorTickets(email);

	$scope.transitionToTicket = function (item) {
		console.log(item);
		alert("Show ticket details");
	};

	//   Custom orderby function for applying a different sort rule for the click_count column
	//without this function the "click count" would be sorted as string instead of a number
	//have to know which column is being sorted
	// returns a closure of the orignal function
	$scope.orderByFunction = function (sortType) {
		return function (item) {

			if (sortType === 'zip') { //sorting on the click_count. force integer comparison versus default string compare
				console.log(sortType);
				return parseInt(item.zip);
			} else if (sortType === 'address1') {
				return item.address1;
			} else if (sortType === 'address2') {
				return item.address2;
			} else {
				return item.city;
			}
		};
	};


	//helper functions below ----------
	//allow the contractor to send an email to the manager
	function doSendEmail() {

		var emailHtml =
			"<div><h1>Location</h1>" +
			"    <p>" + tenantinfo.address1 + tenantinfo.address2 + "</p>" +
			"    <p>" + tenantinfo.city + "," + tenantinfo.state + " " + tenantinfo.zip + "</p>" +
			"</div>" +
			"<div><h1>Description Of Issue and Special Instructions</h1>" +
			"    <p>" + ticket.issue_description + "</p>" +
			"    <p>" + ticket.entry_point + "</p>" +
			"    <p> <h4>Pet(s)? :" + ticket.pet + "</h4></p>" +
			"    <p> <h4>Contact :</h4> " +
			"    <p>" + ticket.contact_first_name + " " + ticket.contact_last_name + "</p>" +
			"    <p>" + formatPhone(ticket.contact_phone) + " " + formatPhone(ticket.contact_mobile) + " " + ticket.contact_email + "</p>" +
			"    <p> <h4>Alternate Contact :</h4>" +
			"    <p>" + ticket.alt_first_name + " " + ticket.alt_last_name + "</p>" +
			"    <p>" + formatPhone(ticket.alt_phone) + " " + ticket.alt_email + "</p>" +
			"</div>";
		var emailText = emailHtml;

		var sendMailOptions = {
			from: user.email,
			to: 'hello@ticketfixme.com,josh@ticketfixme.com,curtis@ticketfixme.com',
			subject: "Tenant requires attention",
			text: emailText,
			html: emailHtml
		};
		apiAjax.sendmail(user.email, sendMailOptions).then(
			function (succ) {
				console.log(succ);
			},
			function (err) {
				console.log(err);
			});
	}

	function runGetContractorTickets(email) {
		$scope.errorMessage = "";
		apiAjax.getContractorTickets(email).then(
			function (succ) {
				console.log(succ);
				var c = succ.data;
				if (c.success === true) {
					$scope.tickets = c.info;
					for (i = 0; i < c.info.length; i++) {
						//console.log($scope.tickets[i].ticket_status);  //item.ticket_status
						$scope.tickets[i].ticket_date = formatDateYYYYMMDD($scope.tickets[i].client_datetime_string);
					}
				} else {
					$scope.errorMessage = "Sorry, we didn't find anything in your region(s)";
				}
			},
			function (err) {
				console.log(err);
			});
	}
});
