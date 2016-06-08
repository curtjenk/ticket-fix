ticketFixApp.controller('registrationController', function ($rootScope, $scope, $http, $q, $location, apiAjax) {
	$scope.formData = {};

	var apiUrl = "http://localhost:3000";
	var userType = $rootScope.userType;
	var userTypeManager = 4;
	var userTypeContractor = 1;
	var userTypeTenant = 3;
	var userTypeStaff = 5;
	var userTypeArray = ['n/a', 'Contractor', 'Admin', 'Tenant', 'Manager', 'Staff'];
	
	$scope.account_type = userTypeArray[$rootScope.userType];

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
			account_name: $scope.formData.acctname,
			contact_name: $scope.formData.contactname,
			contact_email: $scope.formData.acctemail,
			contact_phone: $scope.formData.acctphone,
			account_address: $scope.formData.acctaddress,
			account_city: $scope.formData.acctcity,
			account_state: $scope.formData.acctstate,
			account_zip: $scope.formData.acctzip
		};

		var property = {
			address1: $scope.formData.address1,
			address2: $scope.formData.address2,
			city: $scope.formData.city,
			state: $scope.formData.state,
			zip: $scope.formData.zip,
			isManaged: 0
		};
		var unique_user_id;

		saveUserProfile(user)
			.then(function (res) {
				if (res.data.success !== true) {
					throw res.data;
				} else {
					unique_user_id = res.data.info.id;
					return saveAccount(userType, account);
				}
			}).then(function (res) {
				console.log('return from saveAccount');
				console.log(res);

				if (res.acctId > 0) {
					var personObject = getTypeData(userType, unique_user_id, res.acctId);
					if (userType == userTypeManager) {
						return saveManager(personObject);
					} else {
						return saveContractor(personObject);
					}
				} else {
					return new Promise(function (resolve, reject) {
						resolve({
							success: false,
							message: 'no manager or contractor to save'
						});
					});
				}
			}).then(function (res) {
				return saveProperty(userType, property);
			}).then(function (res) {
				// console.log('saveing the tenant...last step');
				// console.log(res);
				return saveTenant(unique_user_id, res.data.info.id);
			}).then(function (res) {
				console.log(res);
				if (res.data.success === true) {
					$location.path('/login');
				}
			}).catch(function (error) {
				console.log(error);
			});
	};
	// 	apiAjax.register(user).then(
	// 		function (succ) {
	// 			console.log(succ.data);
	// 			if (succ.data.success !== true) {
	// 				return;
	// 			}
	// 			// console.log("saved user now check for manager / contractor ");
	// 			// console.log("after register user.  user id = ");
	// 			var unique_user_id = succ.data.info.id;
	// 			// console.log(unique_user_id);
	// 			if (userType === userTypeManager || userType === userTypeContractor) {
	// 				apiAjax.saveaccount(account).then(
	// 					function (succ) {
	// 						// console.log("after saveaccount.  account id = ");
	// 						var acctId = succ.data.info.id;
	// 						// console.log(acctId);
	// 						var personObject = getTypeData(userType, unique_user_id, acctId);
	// 						// console.log(personObject);
	// 						if (userType === userTypeManager) {
	// 							apiAjax.savemanager(personObject).then(function (succ) {
	// 								console.log(succ);
	// 							}, function (err) {
	// 								console.log(err);
	// 							});
	// 						} else if (userType === userTypeContractor) {
	// 							apiAjax.savecontractor(personObject).then(function (succ) {
	// 								console.log(succ);
	// 							}, function (err) {
	// 								console.log(err);
	// 							});
	// 						}
	// 					},
	// 					function (err) {
	//
	// 					});
	// 			}
	// 		},
	// 		function (err) {
	// 			console.log(err);
	// 		});
	// };

	function saveUserProfile(user) {
		// var deferred = $q.defer();
		return apiAjax.register(user);
	}

	function saveTenant(user_id, property_id) {
		return apiAjax.savetenant({user_id: user_id, property_id: property_id});
	}

	function saveProperty(userType, property) {
		if (userType == userTypeTenant) {
			return apiAjax.saveproperty(property);
		} else {
			return new Promise(function (resolve, reject) {
				resolve({
					success: false,
					message: 'userType is not Tenant'
				});
			});
		}
	}

	function saveManager(personObject) {
		var deferred = $q.defer();
		var promise = apiAjax.savemanager(personObject).then(
			function (succ) {
				console.log(succ);
				deferred.resolve(succ);
			},
			function (err) {
				console.log(err);
				deferred.reject(err);
			});
		return deferred.promise;
	}

	function saveContractor(personObject) {
		var deferred = $q.defer();
		var promise = apiAjax.savecontractor(personObject).then(
			function (succ) {
				console.log(succ);
				deferred.resolve(succ);
			},
			function (err) {
				console.log(err);
				deferred.reject(err);
			});
		return deferred.promise;
	}

	function saveAccount(userType, account) {
		var deferred = $q.defer();
		if (userType === userTypeManager || userType === userTypeContractor) {
			return apiAjax.saveaccount(account).then(
				function (succ) {
					deferred.resolve({
						success: true,
						acctId: succ.data.info.id
					});
				},
				function (err) {
					deferred.reject({
						success: false,
						msg: err
					});
				});
		} else {
			return new Promise(function (resolve, reject) {
				resolve({
					success: true,
					acctId: -1
				});
			});
		}
		return deferred.promise;
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
				region_1_address: $scope.region_1_address,
				region_1_city: data.region_1_city,
				region_1_state: data.region_1_state,
				region_1_zip: data.region_1_zip,
				region_2_address: data.region_2_address,
				region_2_city: data.region_2_city,
				region_2_state: data.region_2_state,
				region_2_zip: data.region_2_zip,
				region_3_address: data.region_3_address,
				region_3_city: data.region_3_city,
				region_3_state: data.region_3_state,
				region_3_zip: data.region_3_zip
			};

		}
		return personObj;
	}

});
