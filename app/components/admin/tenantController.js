ticketFixApp.controller('tenantController', function($rootScope, $scope, $http, apiAjax) {


	var user = $rootScope.user;
	console.log($rootScope.user);
	var email = user.email;

    apiAjax.getalltenantsinfo(email).then(
        function(succ) {
        	console.log(succ);
        	$scope.tenants = succ.data.info;
        },
        function(err) {
        	console.log(err);
        });

});
