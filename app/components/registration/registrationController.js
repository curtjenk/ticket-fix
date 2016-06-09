ticketFixApp.controller('registrationController', function ($rootScope, $scope, $http, $q, $location, apiAjax, zipLookup) {
	$scope.formData = {};

	var apiUrl = "http://localhost:3000";
	var userType = $rootScope.userType;
	var userTypeManager = 4;
	var userTypeContractor = 1;
	var userTypeTenant = 3;
	var userTypeStaff = 5;
	var userTypeArray = ['n/a', 'Contractor', 'Admin', 'Tenant', 'Manager', 'Staff'];

	$scope.account_type = userTypeArray[$rootScope.userType];

	$scope.zipLookupTenant = function () {
		console.log($scope.formData.zip);
		if ($scope.formData.zip && $scope.formData.zip.length === 5 && is_int($scope.formData.zip.length)) {
			var ok = function (resp) {
				$scope.formData.city = resp.city;
				$scope.formData.state = resp.state;
			};
			var error = function (err) {
				$scope.formData.city = "";
				$scope.formData.state = "";
			};
			zipLookup.get($scope.formData.zip, ok, error);
		}
	};

	$scope.zipLookupRegion1 = function () {
		var zip = $scope.formData.contZip1;
		console.log(zip);
		if (zip && zip.length === 5 && is_int(zip.length)) {
			var ok = function (resp) {
				$scope.formData.contCity1 = resp.city;
				$scope.formData.contState1 = resp.state;
			};
			var error = function (err) {
				$scope.formData.contCity1  = "";
				$scope.formData.contState1  = "";
			};
			zipLookup.get(zip, ok, error);
		}
	};
	$scope.zipLookupRegion2 = function () {
		var zip = $scope.formData.contZip2;
		console.log(zip);
		if (zip && zip.length === 5 && is_int(zip.length)) {
			var ok = function (resp) {
				$scope.formData.contCity2 = resp.city;
				$scope.formData.contState2 = resp.state;
			};
			var error = function (err) {
				$scope.formData.contCity2  = "";
				$scope.formData.contState2  = "";
			};
			zipLookup.get(zip, ok, error);
		}
	};
	$scope.zipLookupRegion3 = function () {
		var zip = $scope.formData.contZip3;
		console.log(zip);
		if (zip && zip.length === 5 && is_int(zip.length)) {
			var ok = function (resp) {
				$scope.formData.contCity3 = resp.city;
				$scope.formData.contState3 = resp.state;
			};
			var error = function (err) {
				$scope.formData.contCity3  = "";
				$scope.formData.contState3  = "";
			};
			zipLookup.get(zip, ok, error);
		}
	};

	$scope.registerFunc = function () {
		// var url = apiUrl + "/register";
		// console.log("registerfunc");
		// return;
		if (!$scope.registerForm.$valid) {
			$scope.errorMessage = "Please enter all required fields";
			console.log('form invalid');
			return;
		}
		var user = {
			type_user_id: userType,
			email: $scope.formData.email,
			first_name: $scope.formData.firstname,
			last_name: $scope.formData.lastname,
			password: $scope.formData.password,
			home_phone: $scope.formData.phone,
			mobile_phone: $scope.formData.mobile,
		};

		var account = {
			account_name: $scope.formData.company,
			contact_name: $scope.formData.contactName,
			contact_email: $scope.formData.acctEmail,
			contact_phone: $scope.formData.acctPhone,
			account_address: $scope.formData.acctAddress,
			account_city: $scope.formData.acctCity,
			account_state: $scope.formData.acctState,
			account_zip: $scope.formData.acctZip
		};

		var property = {
			address1: $scope.formData.address1,
			address2: $scope.formData.address2,
			city: $scope.formData.city,
			state: $scope.formData.state,
			zip: $scope.formData.zip,
			isManaged: 0
		};

		apiAjax.register(user).then(
			function (res) {
				// console.log(res);
				if (res.data.success !== true) {
					$scope.errorMessage = "User Profile Already Exists";
				} else {
					if (userType == userTypeTenant) {
						runTenantFlow(property, res.data);
					} else if (userType == userTypeManager) {
						runManagerFlow(account, res.data);
					} else {
						runContractorFlow(account, res.data);
					}
				}
			},
			function (err) {
				console.log(err);
			});


	};

	function runTenantFlow(property, data) {
		apiAjax.saveproperty(property)
			.then(function (res) {
				console.log(res);
				//apiAjax.savetenant = function (data) {
				return apiAjax.savetenant({
					user_id: data.info.id,
					property_id: res.data.info.id
				});
			})
			.then(function (res) {
				if (res.data.success === true) {
					$location.path('/login');
				} else {
					console.log(res);
					$scope.errorMessage = "Unable to save tenant information.";
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	function runManagerFlow(account, data) {
		apiAjax.saveaccount(account)
			.then(function (res) {
				var personObject = getTypeData(userTypeManager, data.info.id, res.data.info.id);
				return apiAjax.savemanager(personObject);
			})
			.then(function (res) {
				if (res.data.success === true) {
					$location.path('/login');
				} else {
					console.log(res);
					$scope.errorMessage = "Unable to save account information.";
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	function runContractorFlow(account, data) {
		apiAjax.saveaccount(account)
			.then(function (res) {
				var personObject = getTypeData(userTypeContractor, data.info.id, res.data.info.id);
				return apiAjax.savecontractor(personObject);
			})
			.then(function (res) {
				if (res.data.success === true) {
					$location.path('/login');
				} else {
					console.log(res);
					$scope.errorMessage = "Unable to save contractor information.";
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	}


	function getTypeData(userType, unique_user_id, acctId) {
		if (userType === userTypeManager) {
			personObj = {
				userType: userType,
				account_id: acctId,
				user_id: unique_user_id
			};

		} else if (userType === userTypeContractor) {
			personObj = {
				userType: userType,
				account_id: acctId,
				user_id: unique_user_id,
				region_1_radius: $scope.formData.contMile1,
				region_1_city: $scope.formData.contCity1,
				region_1_state: $scope.formData.contState1,
				region_1_zip: $scope.formData.contZip1,

				region_2_radius: $scope.formData.contMile2,
				region_2_city: $scope.formData.contCity2,
				region_2_state: $scope.formData.contState2,
				region_2_zip: $scope.formData.contZip2,

				region_3_radius: $scope.formData.contMile3,
				region_3_city: $scope.formData.contCity3,
				region_3_state: $scope.formData.contState3,
				region_3_zip: $scope.formData.contZip3

			};
		}
		return personObj;
	}

});
