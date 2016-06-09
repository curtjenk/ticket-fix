var baseUrl = 'http://localhost:3000';

ticketFixApp.factory('apiAjax', function ($http) {
	var apiAjax = {};
	var login = baseUrl + "/login";
	var register = baseUrl + "/register";
	var saveAccount = baseUrl + "/saveaccount";
	var saveManager = baseUrl + "/savemanager";
	var saveProperty = baseUrl + "/saveproperty";
	var saveTenant= baseUrl + "/savetenant";
	var saveContractor = baseUrl + "/savecontractor";
	var saveContRegions = baseUrl + "/savecontregions";
	var gettenantinfo = baseUrl + "/api/gettenantinfo";

	var makeTheCall = function(whereTo, data) {
		//console.log(" -- api call using ---");
		//console.log(data);
		return $http({
			method: "post",
			url: whereTo,
			data: data,
			headers: {'Content-Type': 'application/json'}
		});
	};
	var makeTheGetCall = function(completeQueryString) {
		return $http({
			method: "get",
			url: encodeURI(completeQueryString)
		});
	};
	apiAjax.gettenantinfo = function (email) {
		var completeQueryString = gettenantinfo + '/?email=' + email;
		console.log('apiAjax gettenantinfo');
		return makeTheGetCall(completeQueryString);
	};

	apiAjax.login = function (email, password) {
		console.log("apiAjax login");
		return makeTheCall(login, {email: email, password: password});
	};
	apiAjax.register = function (data) {
		console.log("apiAjax register ");
		return makeTheCall(register, {user: data});
	};
	apiAjax.saveaccount = function (data) {
		console.log("apiAjax saveaccount");
		return makeTheCall(saveAccount,  {account: data});
	};
	apiAjax.savemanager = function (data) {
		console.log("apiAjax manager");
		return makeTheCall(saveManager,  {manager: data});
	};
	apiAjax.saveproperty = function (data) {
		console.log("apiAjax property");
		return makeTheCall(saveProperty,  {property: data});
	};
	apiAjax.savetenant = function (data) {
		console.log("apiAjax tenant");
		return makeTheCall(saveTenant,  {tenant: data});
	};
	apiAjax.savecontractor = function (data) {
		console.log("apiAjax contractor");
		return makeTheCall(saveContractor,  {contractor: data});
	};
	apiAjax.savecontregions = function (data) {
		console.log("apiAjax savecontregions");
		return makeTheCall(saveContRegions,  {contregions: data});
	};
	return apiAjax;
});
