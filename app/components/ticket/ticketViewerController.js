ticketFixApp.controller('ticketViewerController', function ($rootScope, $scope, $state, $http, apiAjax) {

	//get the ticket_id from $rootScope
	//get the "go back" state from $rootScope
	var user = $rootScope.user;
	$scope.ticket_id = $rootScope.ticket_id;
	$scope.next_state = $rootScope.next_state;
	//get the ticket info via a service call
	//display ticket
	apiAjax.getTicketInfo(user.email, $scope.ticket_id).then(
		function(suc){

		}, function(err){

		});




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

	};

	$scope.goBack = function (next) {
		console.log(next);
		$state.transitionTo(next);
	};


});
