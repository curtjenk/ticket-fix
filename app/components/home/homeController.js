ticketFixApp.controller('homeController', function ($scope, $http, $location) {
  $scope.msg = "Property ddddd";
	console.log('almost')
	$scope.register = function (type) {
		console.log('here');
		//$scope.$broadcast("signup", {userType: type});
		//$location.path('/register');
	};

});
