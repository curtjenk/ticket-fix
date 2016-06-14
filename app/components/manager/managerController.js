ticketFixApp.controller('managerController', function ($rootScope, $scope, $http, $sce, $q, $state, $location, apiAjax, zipLookup) {
	var tenantinfo = {};
	$scope.formData = {};
	$scope.ticketData = {};
	var user = $rootScope.user; // this is the logged-in user
	console.log($rootScope.user);
	var email = user.email;
	$scope.formData.floorplan = {
		id: '1',
		name: '1bed1bath'
	}; //sets the default
	$scope.floorPlanOptions = [{
		id: '1',
		name: '1bed1bath'
    }, {
		id: '2',
		name: '2bed1bath'
    }, {
		id: '2',
		name: '2bed2bath'
    }, {
		id: '2',
		name: '3bed2bath'
    }, {
		id: '2',
		name: '3bed2.5bath'
    }];
	$scope.page = {};
	$scope.page.viewByOptions = [3, 5, 10];
	$scope.page.currentPage = 1;
	$scope.page.pageSize = 5;
	$scope.page.viewby = 5;

	$scope.page.setItemsPerPage = function (num) {
		$scope.page.pageSize = num;
		$scope.page.currentPage = 1; //reset to first page
	};

	var descMax = 1000;
	var entryMax = 240;
	$scope.count = descMax;
	$scope.countTwo = entryMax;
	$scope.textFunc = function () {
		if ($scope.ticketData.desc) {
			$scope.count = descMax - $scope.ticketData.desc.length;
		} else {
			$scope.count = descMax;
		}
	};

	$scope.textFuncTwo = function () {
		if ($scope.ticketData.entryPoint) {
			$scope.countTwo = entryMax - $scope.ticketData.entryPoint.length;
		} else {
			$scope.countTwo = entryMax;
		}
	};


	runGetMgrTickets(email);

	runGetMgrProperties(email);

	$scope.transitionToTicket = function (item) {
		console.log("transition to ticket");
		$state.transitionTo('manager.createticket');
		console.log("--------- it worked?.  Clicked on ... --------------------");
		console.log(item);
		$scope.ticketData.address1 = item.address1;
		$scope.ticketData.address2 = item.address2;
		$scope.ticketData.city = item.city;
		$scope.ticketData.state = item.state;
		$scope.ticketData.zip = item.zip;
	};
	// this is basically the same logic found in the ticketController.js
	$scope.saveTicketFunc = function () {

		console.log("here");
		var d = new Date();
		var ticket = new Ticket();
		ticket.isCreatedByMgr = true;
		ticket.user_id = tenantinfo.user_id;
		ticket.property_id =$scope.property_id;  //passed in from the form.
		ticket.client_datetime_string = d.yyyymmdd() + '-' + d.hhmmss();

		ticket.contact_first_name = $scope.ticketData.firstname || "";
		ticket.contact_last_name = $scope.ticketData.lastname || "";
		ticket.contact_email = $scope.ticketData.email || "";
		ticket.contact_phone = $scope.ticketData.phone || "";
		ticket.contact_mobile = $scope.ticketData.mobile || "";
		ticket.pet = $scope.ticketData.pet || "";
		ticket.entry_point = $scope.ticketData.entryPoint || "";

		ticket.issue_description = $scope.ticketData.desc || "";
		ticket.notify_preference = $scope.ticketData.notifyPreference || "";
		ticket.enter_if_absent = $scope.ticketData.enterIfAbsent || "";

		//use the logged-in user !
		apiAjax.createticket(ticket, user.email).then(
			function (suc) {
				console.log(suc);
				console.log("transition back to properties");
				if (suc.data.success === true) {
                    runGetMgrTickets();  //to show the new ticket on the Mangage Tickets page.
					$state.transitionTo('manager.properties');
					doSendEmail();
				} else {
					$scope.errorMessage = suc.data.message + " : " + suc.data.info.code || "";
				}

			},
			function (err) {
				console.log(err);
			});
	};

	$scope.savePropertyFunc = function () {
		var property = {
			address1: $scope.formData.address1,
			address2: $scope.formData.address2 || "",
			city: $scope.formData.city,
			state: $scope.formData.state,
			zip: $scope.formData.zip,
			isManaged: 1,
			floor_plan_code: $scope.formData.floorplan.name
		};
		apiAjax.savemanagerproperty(user.email, property).then(
			function (succ) {
				console.log(succ);
				$scope.formData.address1 = "";
				$scope.formData.address2 = "";
				$scope.formData.city = "";
				$scope.formData.state = "";
				$scope.formData.zip = "";
				//refresh the Properties Table
				runGetMgrProperties(email);
			},
			function (err) {
				console.log(err);
			});
		//console.log(property);
	};

	$scope.zipLookup = function () {
		if ($scope.formData.zip && $scope.formData.zip.length === 5 && is_int($scope.formData.zip.length)) {
			var ok = function (resp) {
				$scope.formData.city = resp.city;
				$scope.formData.state = resp.state;
			};
			var error = function (err) {
				$scope.formData.city = "";
				$scope.formData.state = "";
			};
			zipLookup.get($scope.formData.zip, ok, error);
		}
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

	function runGetMgrTickets(email) {
		apiAjax.getallmanagertickets(email).then(
			function (succ) {
				// console.log(succ);
				$scope.tickets = succ.data.info;
				for (i = 0; i < $scope.tickets.length; i++) {
					$scope.tickets[i].formattedDate = formatDateTime($scope.tickets[i].client_datetime_string);
					var html = "<ul class='ticket-popover-contact'><li>Phone:" + $scope.tickets[i].contact_phone + "</li>" +
						"<li>Mobile:" + $scope.tickets[i].contact_mobile + "</li>" +
						"<li>Email:" + $scope.tickets[i].contact_email + "</li>" +
						"<li><strong>Alternate Info</strong></li>" +
						"<li>Email:" + $scope.tickets[i].alt_email + "</li>" +
						"<li>Phone:" + $scope.tickets[i].alt_phone + "</li></ul>";

					// console.log(html);
					$scope.tickets[i].popoverContact = $sce.trustAsHtml(html);
				}
			},
			function (err) {
				console.log(err);
			});
	}

	function runGetMgrProperties(email) {

		apiAjax.getallmanagerproperties(email).then(
			function (succ) {
				//$scope.properties = succ.data.info;
				$scope.items = succ.data.info;
				//$scope.page.totalItems = $scope.properties.length;
				console.log($scope.items);
			},
			function (err) {
				console.log(err);
			});
	}
});
