ticketFixApp.controller('ticketController', function ($rootScope, $scope, $http, $location, apiAjax, localStore) {

	$scope.formData = {};

	$scope.formData.firstname = "Josh";
	$scope.lastname = "Ciaralli";
	$scope.email = "jciarallij@gmail.com";
	$scope.phone = "555-555-1234";
	$scope.date = "06/13/2016";
	var user = $rootScope.user;
	var localData;
	if (user && user.email) {
		localData = localStore.get(user.email);
	}
	console.log(' -----------------------------------------------');
	console.log(localData);
    if (localData.userType == 3) {
	       //apiAjax.getTenantInfo
    }


});
