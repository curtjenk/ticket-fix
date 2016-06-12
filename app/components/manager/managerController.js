ticketFixApp.controller('managerController', function ($rootScope, $scope, $http, $sce, $q, $location, apiAjax, zipLookup) {
	$scope.formData = {};
	var user = $rootScope.user;
	console.log($rootScope.user);
	var email = user.email;
    $scope.formData.floorplan = {id: '1', name: '1bed1bath'};  //sets the default
	$scope.floorPlanOptions = [{id: '1', name: '1bed1bath'},
                               {id: '2', name: '2bed1bath'},
                               {id: '2', name: '2bed2bath'},
                               {id: '2', name: '3bed2bath'},
                               {id: '2', name: '3bed2.5bath'}
                            ];
	$scope.page = {};
	$scope.page.viewby = 10;
	$scope.page.currentPage = 1;
	$scope.page.itemsPerPage = $scope.page.viewby;
	$scope.page.maxSize = 5; //Number of pager buttons to show

	$scope.page.setPage = function (pageNo) {
		console.log('Page changed to: ' + $scope.page.currentPage);
	};
	$scope.page.setItemsPerPage = function (num) {
		$scope.page.itemsPerPage = num;
		$scope.page.currentPage = 1; //reset to first page
	};
	apiAjax.getallmanagertickets(email).then(
		function (succ) {
			console.log(succ);
			$scope.tickets = succ.data.info;
			for (i = 0; i < $scope.tickets.length; i++) {
				$scope.tickets[i].formattedDate = formatDateTime($scope.tickets[i].client_datetime_string);
				var html = "<ul class='ticket-popover-contact'><li>Phone:" + $scope.tickets[i].contact_phone + "</li>" +
					"<li>Mobile:" + $scope.tickets[i].contact_mobile + "</li>" +
					"<li>Email:" + $scope.tickets[i].contact_email + "</li>" +
					"<li><strong>Alternate Info</strong></li>" +
					"<li>Email:" + $scope.tickets[i].alt_email + "</li>" +
					"<li>Phone:" + $scope.tickets[i].alt_phone + "</li></ul>";

				console.log(html);
				$scope.tickets[i].popoverContact = $sce.trustAsHtml(html);

			}
		},
		function (err) {
			console.log(err);
		});

	apiAjax.getallmanagerproperties(email).then(
		function (succ) {
			$scope.properties = succ.data.info;
			console.log($scope.properties);
		},
		function (err) {
			console.log(err);
		});

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
});
