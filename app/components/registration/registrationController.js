ticketFixApp.controller('registrationController', function ($rootScope, $scope, $http, apiAjax) {
	var apiUrl = "http://localhost:3000";
	var userType;
	var userTypeManager = 4;
	var userTypeContractor = 1;
	var userTypeTenant = 3;
	var userTypeStaff = 5;
	var userArray = ['n/a', 'Contractor', 'Admin', 'Tenant', 'Manager', 'Staff'];
	$scope.showAccount = false;

	console.log("first");
	if ($rootScope.userType === userTypeManager || $rootScope.userType === userTypeContractor) {
			$scope.showAccount = true;
	}
	console.log(userArray);
	$scope.account_type = userArray[$rootScope.userType];

$scope.errorMessage = "";

$scope.registerFunc = function () {
	// var url = apiUrl + "/register";
	console.log("registerfunc");
	return;

	var user = new User({
		type_user_id: userType,
		email: $scope.email,
		first_name: $scope.firstname,
		last_name: $scope.lastname,
		password: $scope.password,
		home_phone: $scope.phone,
		mobile_phone: $scope.mobile,
		address: $scope.address,
		city: $scope.city,
		state: $scope.state,
		zip: $scope.zip
	});

	var account = new Account({
		account_name: $scope.acctname,
		contact_name: $scope.contactname,
		contact_email: $scope.acctemail,
		contact_phone: $scope.acctphone,
		account_address: $scope.acctaddress,
		account_city: $scope.acctcity,
		account_state: $scope.acctstate,
		account_zip: $scope.acctzip
	});

	apiAjax.register(user).then(
		function (success) {
			console.log(success);
			var unique_user_id = success.data.id;
			if (userType === userTypeManager || userType === userTypeContractor) {
				apiAjax.saveaccount(account).then(
					function (succ) {
						var acctId = succ.id;
						var personObject = getTypeData(userType, unique_user_id, acctId);

						if (userType === userTypeManager) {
							apiAjax.savemanager(personObject).then(function (succ) {
								console.log(succ);
							}, function (err) {
								console.log(err);
							});
						} else if (userType === userTypeContractor) {
							apiAjax.savecontractor(personObject).then(function (succ) {
								console.log(succ);
							}, function (err) {
								console.log(err);
							});
						}
					},
					function (err) {

					});
			}
		},
		function (err) {
			console.log(err);
		});
};

function getTypeData(userType, unique_user_id, acctId) {
	if (userType === userTypeManager) {
		var manager = new Manager({
			account_id: acctId,
			user_id: unique_user_id
		});

	} else if (userType === userTypeContractor) {
		var contractor = new Contractor({
			account_id: acctId,
			user_id: unique_user_id,
			service_region_1_zip: $scope.region1,
			service_region_2_zip: $scope.region2,
			service_region_3_zip: $scope.region3
		});

	}
}

$scope.change = function () {
console.log($scope.propertycode);
};

});
