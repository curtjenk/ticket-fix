ticketFixApp.controller('ticketViewerController', function ($rootScope, $scope, $state, $http, $sce, apiAjax) {

	totalMarkers = "";
	counter = 0;
	//get the ticket_id from $rootScope
	//get the "go back" state from $rootScope
	var user = $rootScope.user;
	$scope.ticket_id = $rootScope.ticket_id;
	$scope.next_state = $rootScope.next_state;
	//get the ticket info via a service call
	//display ticket
	var tick = {};
	apiAjax.getTicketInfo(user.email, $scope.ticket_id).then(
		function(suc){
			console.log(suc);
			xferData(suc.data.info[0]);
		}, function(err){

		});




	function xferData(ticket) {
		console.log(ticket);
		console.log("here");
		var d = new Date();

		$scope.date =  formatDateTime(ticket.client_datetime_string);
		$scope.contact_firstname = ticket.contact_first_name;
		$scope.contact_last_name = ticket.contact_last_name  || "";
		$scope.contact_email = ticket.contact_email || "";
		$scope.contact_phone = ticket.contact_phone || "";
		$scope.contact_mobile = ticket.contact_mobile  || "";
		$scope.pet = ticket.pet || "";
		$scope.entry_point = ticket.entry_point || "";
		$scope.contact_altphone = ticket.alt_phone || "";
		$scope.contact_altemail = ticket.alt_email || "";
		$scope.issue_description = ticket.issue_description || "";
		$scope.floorplan_image = "../assets/img/floor-plans/"  + ticket.floorplan_image;

		console.log(JSON.parse(ticket.markers_json));
		var markers = JSON.parse(ticket.markers_json);
		for (var i=0; i<markers.length; i++)
		{
			addMarker(markers[i]);
		}

		// var details = new TicketDetails();
		//
		// for (var prop in $scope.formData.kitchen) {
		// 	details.kitchen.push({
		// 		key: prop,
		// 		value: $scope.formData.kitchen[prop]
		// 	});
		// 	// details.kitchen.push(new KeyValue(prop, $scope.formData.kitchen[prop]));
		// }
		// for (var bd in $scope.formData.bedroom) {
		// 	details.bedroom.push({
		// 		key: bd,
		// 		value: $scope.formData.bedroom[bd]
		// 	});
		// 	// details.bedroom.push(new KeyValue(bd, $scope.formData.bedroom[bd]));
		// }
		// for (var item in $scope.formData.bathroom) {
		// 	details.bathroom.push({
		// 		key: item,
		// 		value: $scope.formData.bathroom[item]
		// 	});
		// 	// details.bathroom.push(new KeyValue(item, $scope.formData.bathroom[item]));
		// }
		//
		// ticket.details_json = details;
		//
		// ticket.markers_json = [];
		// for (var i = 0; i < markerArray.length; i++) {
		// 	ticket.markers_json.push(markerArray[i]);
		// }

	}

	function addMarker (marker) {
		counter++;
		// console.log(counter);
		// console.log('WOW YOU CLICKED IT!');
		// console.log($event);
		var xClick = marker.x;
		var yClick = marker.y;
		var newHtml = '<div class="marker text-center" style="position: absolute; top: ' + yClick + 'px; left: ' + xClick + 'px;">' + marker.num + '</div>';
		totalMarkers += newHtml;
		$scope.newMarker = $sce.trustAsHtml(totalMarkers);
	}

	$scope.goBack = function (next) {
		console.log(next);
		$state.transitionTo(next);
	};


});
