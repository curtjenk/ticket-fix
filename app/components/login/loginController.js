ticketFixApp.controller('loginController', function ($rootScope, $scope, $http, $location, apiAjax, localStore) {

	$scope.loginFunc = function () {
        console.log('login');
		if (!$scope.loginForm.$valid) {
			console.log("loginForm is invalid");
            $scope.errorMessage = "Please enter all required fields";
			return;
		}
		apiAjax.login($scope.email, $scope.password).then(
			function (succ) {
				console.log(succ);
			},
			function (err) {
				console.log(err);
			});

	};


});
