var baseUrl = 'http://localhost:3000';

ticketFixApp.factory('apiAjax', function ($http) {
	var apiAjax = {};
	var login = baseUrl + "/login";
	var register = baseUrl + "/register";
	var saveAccount = baseUrl + "/saveaccount";
	var saveManager = baseUrl + "/savemanager";
	var saveProperty = baseUrl + "/saveproperty";
	var saveContractor = baseUrl + "/savecontractor";

	var makeTheCall = function(whereTo, data) {
		return $http({
			method: "post",
			url: whereTo,
			data: data,
			headers: {'Content-Type': 'application/json'}
		});
	};

	apiAjax.login = function (data) {
		console.log("apiAjax login");
		return makeTheCall(login, data);
		// return $http({
		// 	method: "post",
		// 	url: login,
		// 	data: data,
		// 	headers: {'Content-Type': 'application/json'}
		// });
	};

	apiAjax.register = function (data) {
		console.log("apiAjax register ");
		return makeTheCall(register, data);
		// console.log(data);
		//
		// return $http({
		// 	method: "post",
		// 	url: register,
		// 	data: data,
		// 	headers: {'Content-Type': 'application/json'}
		// });
	};

	apiAjax.saveaccount = function (data) {
		console.log("apiAjax saveaccount");
		return makeTheCall(saveAccount, data);
		// return $http({
		// 	method: "post",
		// 	url: saveAccount,
		// 	data: data,
		// 	headers: {'Content-Type': 'application/json'}
		// });
	};

	apiAjax.savemanager = function (data) {
		console.log("apiAjax manager");
		return makeTheCall(saveManager, data);
		// return $http({
		// 	method: "post",
		// 	url: saveManager,
		// 	data: data,
		// 	headers: {'Content-Type': 'application/json'}
		// });
	};

	apiAjax.saveproperty = function (data) {
		console.log("apiAjax property");
		return makeTheCall(saveProperty, data);
		// return $http({
		// 	method: "post",
		// 	url: saveProperty,
		// 	data: data,
		// 	headers: {'Content-Type': 'application/json'}
		// });
	};

	apiAjax.savecontractor = function (data) {
		console.log("apiAjax contractor");
		return makeTheCall(saveContractor, data);
		// return $http({
		// 	method: "post",
		// 	url: saveContractor,
		// 	data: data,
		// 	headers: {'Content-Type': 'application/json'}
		// });
	};

	return apiAjax;
});
