ticketFixApp.controller('managerController', function ($rootScope, $scope, $http, $q, $location, apiAjax, zipLookup) {
    $scope.formData = {};
	var user = $rootScope.user;
	console.log($rootScope.user);
	var email = user.email;

	apiAjax.getallmanagertickets(email).then(
		function (succ) {
			console.log(succ);
			$scope.managerTickets = succ.data.info;
		},
		function (err) {
			console.log(err);
		});

	/*
	apiAjax.getallmanagerproperties(email).then(
	    function(succ) {
	        console.log(succ);
	        $scope.managerProperties = succ.data.info;
	    },
	    function(err) {
	        console.log(err);
	    });
	*/
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
