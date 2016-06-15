ticketFixApp.controller('adminController', function ($rootScope, $scope, $http, apiAjax) {

	$scope.page = {};

	$scope.page.currentPage = 1;
	$scope.page.pageSize = 10;

	var user = $rootScope.user;
	console.log($rootScope.user);
	var email = user.email;

	apiAjax.getalltenantsinfo(email).then(
		function (succ) {
			console.log(succ);
			$scope.tenants = succ.data.info;
		},
		function (err) {
			console.log(err);
		});

	apiAjax.getTicketsPerDay(email).then(
		function (succ) {
			var ticksPerDay = succ.data.info;
			console.log(succ);
            $scope.series = ['Tickets'];
            $scope.labels = [];
            $scope.data =[];
			for (var i = 0; i < ticksPerDay.length; i++) {
                $scope.labels.push(ticksPerDay[i].DateOnly);
                $scope.data.push(ticksPerDay[i].num);
				// $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
				// $scope.series = ['Tickets'];
				// $scope.data = [
                //                                [65, 59, 80, 81, 56, 55, 40],
                //                                [28, 48, 40, 19, 86, 27, 90]
                //                            ];
			}
			$scope.onClick = function (points, evt) {
				console.log(points, evt);
			};

		},
		function (err) {
			console.log(err);
		});

});
