ticketFixApp.controller('ticketController', function ($rootScope, $scope, $http, $location, apiAjax, localStore) {
	$scope.formData = {};
    var d = new Date();
    $scope.formData.date = d.toDateString();
	// $scope.formData.firstname = "Josh";
	// $scope.lastname = "Ciaralli";
	// $scope.email = "jciarallij@gmail.com";
	// $scope.phone = "555-555-1234";
	// $scope.date = "06/13/2016";
	var user = $rootScope.user;
	var localData;
	if (user && user.email) {
		localData = localStore.get(user.email);
	} else {
        //user not logged in.  Just show an empty page for now!
        return;
    }
	console.log(' -----------------------------------------------');
	console.log(localData);
	if (localData.userType == 3) {
		/* returns
		email, first_name, last_name, home_phone, mobile_phone,
		  code, address1, address2, city, state, zip
		*/
		apiAjax.gettenantinfo(user.email).then(function (res) {
            console.log(res);

			if (res.data.success === true) {
				$scope.formData.firstname = res.data.info.first_name;
				$scope.formData.lastname = res.data.info.last_name;
				$scope.formData.email = res.data.info.email;
				$scope.formData.phone = res.data.info.phone;

			}
		}, function (err) {

		});
	} else if (localData.userType == 4) { //manager
        
    }


});
