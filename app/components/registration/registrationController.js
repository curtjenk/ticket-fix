ticketFixApp.controller('registrationController', function ($rootScope, $scope, $http, apiAjax) {
	var apiUrl = "http://localhost:3000";
	var userType = $rootScope.userType;
	var userTypeManager = 4;
	var userTypeContractor = 1;
	var userTypeTenant = 3;
	var userTypeStaff = 5;
	var userTypeArray = ['n/a', 'Contractor', 'Admin', 'Tenant', 'Manager', 'Staff'];
	$scope.showAccount = false;
	$scope.showContractor = false;

	// console.log("first");
	if ($rootScope.userType === userTypeManager || $rootScope.userType === userTypeContractor) {
			$scope.showAccount = true;
	}

	if ($rootScope.userType === userTypeContractor){
			$scope.showContractor = true;
	}
	
	// console.log(userArray);

	$scope.account_type = userTypeArray[$rootScope.userType];

$scope.errorMessage = "";

$scope.registerFunc = function () {
	// var url = apiUrl + "/register";
	// console.log("registerfunc");
	// return;

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

	var account = {
		account_name: $scope.acctname,
		contact_name: $scope.contactname,
		contact_email: $scope.acctemail,
		contact_phone: $scope.acctphone,
		account_address: $scope.acctaddress,
		account_city: $scope.acctcity,
		account_state: $scope.acctstate,
		account_zip: $scope.acctzip
	};

	apiAjax.register(user).then(
		function (succ) {
			// console.log(succ.data);
			if (succ.data.success !== true)
			{
				console.log(succ.data);
				return;
			}
			// console.log("saved user now check for manager / contractor ");
			// console.log("after register user.  user id = ");
			var unique_user_id = succ.data.info.id;
			// console.log(unique_user_id);
			if (userType === userTypeManager || userType === userTypeContractor) {
				apiAjax.saveaccount(account).then(
					function (succ) {
						// console.log("after saveaccount.  account id = ");

						var acctId = succ.data.info.id;
						// console.log(acctId);
						var personObject = getTypeData(userType, unique_user_id, acctId);
						// console.log(personObject);
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
	var personObj = {};
	if (userType === userTypeManager) {
		personObj  = {
			account_id: acctId,
			user_id: unique_user_id
		};

	} else if (userType === userTypeContractor) {
		personObj = {
            account_id: acctId,
            user_id: unique_user_id,
            region_1_address : $scope.region_1_address,
            region_1_city : data.region_1_city,
            region_1_state : data.region_1_state,
            region_1_zip : data.region_1_zip,
            region_2_address : data.region_2_address,
            region_2_city : data.region_2_city,
            region_2_state : data.region_2_state,
            region_2_zip : data.region_2_zip,
            region_3_address : data.region_3_address,
            region_3_city : data.region_3_city,
            region_3_state : data.region_3_state,
            region_3_zip : data.region_3_zip
        };

	}
	return personObj;
}

$scope.change = function () {
console.log($scope.propertycode);
};

});
