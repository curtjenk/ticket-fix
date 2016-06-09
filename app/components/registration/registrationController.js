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

		var regions = {

		}
		var unique_user_id;
		apiAjax.register(user).then(
			function (res) {
				if (res.data.success !== true) {
					$scope.errorMessage = "User Profile Already Exists";
				} else {
					if (userType == userTypeTenant) {
						runTenantFlow(property, res.data);
					} else if (userType == userTypeManager) {
						runManagerFlow(account, res.data);
					} else {
						runContractorFlow(account, res.data, regions);
					}
				}
			},
			function (err) {
				console.log(err);
			});


		// saveUserProfile(user)
		// 	.then(function (res) {
		// 		if (res.data.success !== true) {
		// 			throw res.data;
		// 		} else {
		// 			unique_user_id = res.data.info.id;
		// 			return saveAccount(userType, account);
		// 		}
		// 	}).then(function (res) {
		// 		console.log('return from saveAccount');
		// 		console.log(res);
		//
		// 		if (res.acctId > 0) {
		// 			var personObject = getTypeData(userType, unique_user_id, res.acctId);
		// 			if (userType == userTypeManager) {
		// 				return saveManager(personObject);
		// 			} else {
		// 				return saveContractor(personObject);
		// 			}
		// 		} else {
		// 			return new Promise(function (resolve, reject) {
		// 				resolve({
		// 					success: false,
		// 					message: 'no manager or contractor to save'
		// 				});
		// 			});
		// 		}
		// 	}).then(function (res) {
		// 		return saveProperty(userType, property);
		// 	}).then(function (res) {
		// 		// console.log('saveing the tenant...last step');
		// 		// console.log(res);
		// 		return saveTenant(unique_user_id, res.data);
		// 	}).then(function (res) {
		// 		console.log(res);
		// 		if (res.data.success === true) {
		// 			$location.path('/login');
		// 		}
		// 	}).catch(function (error) {
		// 		console.log(error);
		// 	});
	};

	function runTenantFlow(property, data) {
		apiAjax.saveproperty(property)
			.then(function (res) {
				return apiAjax.savetenant(data.info.id, res.info.property_id);
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	function runManagerFlow(account, data) {
		apiAjax.saveaccount(account)
			.then(function (res) {
				var personObject = getTypeData(userTypeManager, data.info.id, res.info.id);
				return apiAjax.savemanager(personObject);
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	function runContractorFlow(account, data) {
		apiAjax.saveaccount(account)
			.then(function (res) {
				var personObject = getTypeData(userTypeContractor, data.info.id, res.info.id);
				return apiAjax.savecontractor(personObject);
			})
			.catch(function (error) {
				console.log(error);
			});
	}




	//
	// function saveManager(personObject) {
	// 	var deferred = $q.defer();
	// 	if (userType === userTypeManager) {
	// 		promise = apiAjax.savemanager(personObject).then(
	// 			function (succ) {
	// 				console.log(succ);
	// 				deferred.resolve({
	// 					success: true,
	// 					data: succ.data.info
	// 				});
	// 			},
	// 			function (err) {
	// 				console.log(err);
	// 				deferred.reject({
	// 					success: false,
	// 					data: {
	// 						msg: err
	// 					}
	// 				});
	// 			});
	// 	} else {
	// 		promise = new Promise(function (resolve, reject) {
	// 			resolve({
	// 				success: true,
	// 				data: {
	// 					id: -1
	// 				}
	// 			});
	// 		});
	// 	}
	// 	return deferred.promise;
	// }
	//
	// function saveContractor(personObject) {
	// 	var deferred = $q.defer();
	// 	if (userType === userTypeContractor) {
	// 		promise = apiAjax.savecontractor(personObject).then(
	// 			function (succ) {
	// 				console.log(succ);
	// 				deferred.resolve({
	// 					success: true,
	// 					data: succ.data.info
	// 				});
	// 			},
	// 			function (err) {
	// 				console.log(err);
	// 				deferred.reject({
	// 					success: false,
	// 					data: {
	// 						msg: err
	// 					}
	// 				});
	// 			});
	// 	} else {
	// 		promise = new Promise(function (resolve, reject) {
	// 			resolve({
	// 				success: true,
	// 				data: {
	// 					id: -1
	// 				}
	// 			});
	// 		});
	// 	}
	// 	return deferred.promise;
	// }
	//
	// function saveAccount(userType, account) {
	// 	var deferred = $q.defer();
	// 	if (userType === userTypeManager || userType === userTypeContractor) {
	// 		promise = apiAjax.saveaccount(account).then(
	// 			function (succ) {
	// 				deferred.resolve({
	// 					success: true,
	// 					data: succ.data.info
	// 				});
	// 			},
	// 			function (err) {
	// 				deferred.reject({
	// 					success: false,
	// 					data: {
	// 						msg: err
	// 					}
	// 				});
	// 			});
	// 	} else {
	// 		promise = new Promise(function (resolve, reject) {
	// 			resolve({
	// 				success: true,
	// 				data: {
	// 					id: -1
	// 				}
	// 			});
	// 		});
	// 	}
	// 	return deferred.promise;
	// }

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
				region_1_address: $scope.formData.contAddress1,
				region_1_city: data.formData.contCity1,
				region_1_state: data.formData.contState1,
				region_1_zip: data.formData.contZip1,
				region_2_radius: $scope.formData.contMile2,
				region_2_address: $scope.formData.contAddress2,
				region_2_city: data.formData.contCity2,
				region_2_state: data.formData.contState2,
				region_2_zip: data.formData.contZip2,
				region_3_radius: $scope.formData.contMile3,
				region_3_address: $scope.formData.contAddress3,
				region_3_city: data.formData.contCity3,
				region_3_state: data.formData.contState3,
				region_3_zip: data.formData.contZip3

			};

		}
		return personObj;
	}

});
