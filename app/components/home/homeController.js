ticketFixApp.controller('homeController', function($rootScope, $scope, $http, $location) {


    $scope.register = function(type) {

        $rootScope.userType = type;
		$location.path('/register');
    };

});
