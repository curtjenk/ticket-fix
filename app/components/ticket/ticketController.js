ticketFixApp.controller('ticketController', function ($rootScope, $scope, $http, $location, $sce, apiAjax, localStore) {



	var counter = 0;
	var totalMarkers = "";
	var markerArray = [];
	var tenantinfo = {};
	$scope.page = {};
	$scope.page.currentPage = 1;
	$scope.page.pageSize = 5;

	$scope.addMarker = function ($event) {
		counter++;
		// console.log(counter);
		// console.log('WOW YOU CLICKED IT!');
		// console.log($event);
		var xClick = $event.offsetX - 10;
		var yClick = $event.offsetY - 10;
		var newHtml = '<div class="marker text-center" style="position: absolute; top: ' + yClick + 'px; left: ' + xClick + 'px;">' + counter + '</div>';
		totalMarkers += newHtml;
		$scope.newMarker = $sce.trustAsHtml(totalMarkers);
		//$scope.markerArray.push($scope.totalMarkers);
		markerArray.push(new Marker({
			x: xClick,
			y: yClick,
			num: counter
		}));
		console.log(markerArray);

	};

	$scope.removeMarkers = function () {
		// console.log(markerArray);
		markerArray = [];
		totalMarkers = "";
		$scope.newMarker = "";
		counter = 0;
	};

	var descMax = 1000;
	var entryMax = 240;
	$scope.count = descMax;
	$scope.countTwo = entryMax;
	$scope.textFunc = function () {
		if ($scope.formData.desc) {
			$scope.count = descMax - $scope.formData.desc.length;
		} else {
			$scope.count = descMax;
		}
	};

	$scope.textFuncTwo = function () {
		if ($scope.formData.entryPoint) {
			$scope.countTwo = entryMax - $scope.formData.entryPoint.length;
		} else {
			$scope.countTwo = entryMax;
		}
	};


	$scope.formData = {};
	var d = new Date();
	$scope.formData.date = d.toDateString();
	var user = $rootScope.user;
	var localData;

	//go get the user's info [manager or tenant]
	onload();

	$scope.ticketFunc = function () {
		console.log($scope.formData.kitchen);
		console.log("here");
		var d = new Date();
		var ticket = new Ticket();
		ticket.user_id = $scope.user_id;
		ticket.property_id = $scope.property_id;
		ticket.client_datetime_string = d.yyyymmdd() + '-' + d.hhmmss();

		ticket.contact_first_name = $scope.formData.firstname || "";
		ticket.contact_last_name = $scope.formData.lastname || "";
		ticket.contact_email = $scope.formData.email || "";
		ticket.contact_phone = $scope.formData.phone || "";
		ticket.contact_mobile = $scope.formData.mobile || "";
		ticket.pet = $scope.formData.pet || "";
		ticket.entry_point = $scope.formData.entryPoint || "";

		ticket.alt_phone = $scope.formData.altphone || "";
		ticket.alt_first_name = $scope.formData.firstname || "";
		ticket.alt_last_name = $scope.formData.lastname || "";
		ticket.alt_email = $scope.formData.altemail || "";
		ticket.issue_description = $scope.formData.desc || "";
		ticket.notify_preference = $scope.formData.notifyPreference || "";
		ticket.enter_if_absent = $scope.formData.enterIfAbsent || "";
		ticket.agree = $scope.formData.agree;

		var details = new TicketDetails();

		for (var prop in $scope.formData.kitchen) {
			details.kitchen.push({
				key: prop,
				value: $scope.formData.kitchen[prop]
			});
			// details.kitchen.push(new KeyValue(prop, $scope.formData.kitchen[prop]));
		}
		for (var bd in $scope.formData.bedroom) {
			details.bedroom.push({
				key: bd,
				value: $scope.formData.bedroom[bd]
			});
			// details.bedroom.push(new KeyValue(bd, $scope.formData.bedroom[bd]));
		}
		for (var item in $scope.formData.bathroom) {
			details.bathroom.push({
				key: item,
				value: $scope.formData.bathroom[item]
			});
			// details.bathroom.push(new KeyValue(item, $scope.formData.bathroom[item]));
		}

		ticket.details_json = details;

		ticket.markers_json = [];
		for (var i = 0; i < markerArray.length; i++) {
			ticket.markers_json.push(markerArray[i]);
		}
		//use the logged-in user !
		apiAjax.createticket(ticket, user.email).then(
			function (suc) {
				console.log(suc);
				$location.path('/');

				var emailHtml =
					"<div><h1>Location</h1>" +
					"    <p>" + tenantinfo.address1 + tenantinfo.address2 + "</p>" +
                    "    <p>" + tenantinfo.city + "," + tenantinfo.state + " " + tenantinfo.zip + "</p>" +
					"</div>" +
					"<div><h1>Description Of Issue and Special Instructions</h1>" +
					"    <p>" + ticket.issue_description + "</p>" +
					"    <p>" + ticket.entry_point + "</p>" +
					"    <p> <h4>Pet(s)? :" + ticket.pet  + "</h4></p>" +
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
			},
			function (err) {
				console.log(err);
			});
	};

	// ---- helper functions below ----



	Date.prototype.yyyymmdd = function () {
		var yyyy = this.getFullYear().toString();
		var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
		var dd = this.getDate().toString();
		var hh = this.getHours().toString();
		var mi = this.getMinutes().toString();
		var ss = this.getSeconds().toString();
		return yyyy + (mm[1] ? mm : "0" + mm[0]) + (dd[1] ? dd : "0" + dd[0]); // padding
	};

	Date.prototype.hhmmss = function () {
		var hh = this.getHours().toString();
		var mi = this.getMinutes().toString();
		var ss = this.getSeconds().toString();
		return (hh[1] ? hh : "0" + hh[0]) + (mi[1] ? mi : "0" + mi[0]) + (ss[1] ? ss : "0" + ss[0]); // padding
	};

	function runGetTenantTickets(email) {
		apiAjax.getalltenanttickets(email).then(
			function (succ) {
				console.log(succ);
				$scope.tickets = succ.data.info;
				// console.log($scope.tickets);
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

	function onload() {
		if (user && user.email) {
			localData = localStore.get(user.email);
		} else {
			//user not logged in.  Just show an empty page for now!
			return;
		}
		console.log(' -----------------------------------------------');
		//console.log(localData);

		runGetTenantTickets(user.email);

		if (localData.userType == 3) {
			/* returns
			email, first_name, last_name, home_phone, mobile_phone,
			  code, address1, address2, city, state, zip
			*/
			apiAjax.gettenantinfo(user.email).then(function (res) {
				console.log(res);
				tenantinfo = res.data.info;

				if (res.data.success === true) {
					$scope.user_id = tenantinfo.user_id;
					$scope.property_id = tenantinfo.property_id;
					$scope.formData.firstname = tenantinfo.first_name;
					$scope.formData.lastname = tenantinfo.last_name;
					$scope.formData.email = tenantinfo.email;
					$scope.formData.phone = tenantinfo.home_phone;
					$scope.formData.mobile = tenantinfo.mobile_phone;

					$scope.formData.planUrl = "../assets/img/floor-plans/" + tenantinfo.image;
					console.log($scope.formData.planUrl);

				}
			}, function (err) {

			});
		} else if (localData.userType == 4) { //manager
			apiAjax.getmanagerinfo(user.email).then(function (res) {
				console.log(res);
				if (res.data.success === true) {
					$scope.user_id = res.data.info.user_id;
					$scope.formData.firstname = res.data.info.first_name;
					$scope.formData.lastname = res.data.info.last_name;
					$scope.formData.email = res.data.info.email;
					$scope.formData.phone = res.data.info.home_phone;
					$scope.formData.mobile = res.data.info.mobile_phone;

				}
			}, function (err) {

			});
		}
	}

});
