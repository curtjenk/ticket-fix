ticketFixApp.controller('homeController', function ($rootScope, $scope, $http, $location) {


	$scope.register = function (type) {
		console.log("here " + type);
    $rootScope.userType = type;
		// $rootScope.$broadcast('signup', {userType: type} );
    // $scope.$emit('signup', {userType: type} );
		$location.path('/register');
	};

});
