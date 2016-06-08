ticketFixApp.controller('loginController', function ($rootScope, $scope, $http, $location, apiAjax, localStore) {
$scope.errorMessage = '';

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
                if (succ.data.success === true) {
                    var email = succ.data.info.email;
                    var userType = succ.data.info.type_user_id;
                    var token = succ.data.token;
                    $rootScope.email = email;
                    //save succ.data.token to localStore
                    localStore.set(succ.data.info.email, {userType: userType, token: token});

					$scope.$emit("userLoggedIn", {
				       email: email
				     });
                } else {
                    $scope.errorMessage = "Invalid Email and/or Password";
                }
			},
			function (err) {
				console.log(err);
                $scope.errorMessage = err.data.message;
			});

	};


});
