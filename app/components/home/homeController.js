ticketFixApp.controller('homeController', function ($rootScope, $scope, $http, $location) {


	$scope.register = function (type) {
		console.log("here " + type);
		 $rootScope.$broadcast('signup', {userType: type} );
		$location.path('/register');
	};

});
