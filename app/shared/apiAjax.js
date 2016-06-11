var baseUrl = 'http://localhost:3000';

ticketFixApp.factory('apiAjax', function ($http, $q, localStore) {
	var apiAjax = {};
	var login = baseUrl + "/login";
	var register = baseUrl + "/register";
	var registerNew = baseUrl + "/register-new";
	var saveAccount = baseUrl + "/saveaccount";
	var saveManager = baseUrl + "/savemanager";
	var saveProperty = baseUrl + "/saveproperty";
	var saveTenant = baseUrl + "/savetenant";
	var saveContractor = baseUrl + "/savecontractor";
	var saveContRegions = baseUrl + "/savecontregions";
	var tenantinfo = baseUrl + "/api/tenantinfo";
	var managerinfo = baseUrl + "/api/managerinfo";
	var alltenantsinfo = baseUrl + "/api/alltenantsinfo";
	var createticket = baseUrl + "/api/createticket";

	var ApiResponse = function (res) {
		res = res || {};
		this.api = res.api;
		this.success = res.success;
		this.message = res.message;
		this.token = res.token;
		this.info = res.info;
	};

	function checkToken(api, email) {
		var token = localStore.get(email).token;
		apiRes = new ApiResponse();
		apiRes.api = api;
		if (!token) {
			apiRes.success = false;
			apiRes.message = "This api requires a token";
		} else {
			apiRes.success = true;
			apiRes.token = token;
		}
		return apiRes;
	}
	var makeTheCall = function (whereTo, data) {
		//console.log(" -- api call using ---");
		//console.log(data);
		return $http({
			method: "post",
			url: whereTo,
			data: data,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	};
	var makeThePostApiCall = function (api, email, whereTo, data) {
		var ct = checkToken(api, email);
		if (ct.success === false) {
			return $q.reject(ct);
		}
		return $http({
			method: "post",
			url: encodeURI(whereTo + '/?token=' + ct.token),
			data: data,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	};
	var makeTheGetApiCall = function (api, email, whereTo, queryParms) {
		var ct = checkToken(api, email);
		console.log(ct);
		if (ct.success === false) {
			return $q.reject(ct);
		}
		if (queryParms && queryParms.length === 0) {
			qa = '/?token=' + token;
		} else {
			qa = '/?' + queryParms + '&token=' + ct.token;
		}
		return $http({
			method: "get",
			url: encodeURI(whereTo + qa)
		});
	};
	apiAjax.createticket = function (ticket, email) {
		console.log("apiAjax createticket");
		return makeThePostApiCall('createticket', email, createticket, {
			ticket: ticket
		});
	};

	apiAjax.gettenantinfo = function (email) {
		var queryParms = 'email=' + email;
		console.log('apiAjax gettenantinfo');
		return makeTheGetApiCall('gettenantinfo', email, tenantinfo, queryParms);
	};
	apiAjax.getalltenantsinfo = function (email) {
		var queryParms = '';
		console.log('apiAjax getalltenantsinfo');
		return makeTheGetApiCall('getalltenantsinfo', email, alltenantsinfo, queryParms);
	};
	apiAjax.getmanagerinfo = function (email) {
		var queryParms = 'email=' + email;
		console.log('apiAjax managerinfo');
		return makeTheGetApiCall('managerinfo', email, managerinfo, queryParms);
	};
	apiAjax.login = function (email, password) {
		console.log("apiAjax login");
		return makeTheCall(login, {
			email: email,
			password: password
		});
	};
	apiAjax.registerNew = function (user, property, account) {
		console.log("apiAjax register new ");
		return makeTheCall(registerNew, {
			user: user,
			property: property,
			account: account
		});
	};
	apiAjax.register = function (data) {
		console.log("apiAjax register ");
		return makeTheCall(register, {
			user: data
		});
	};
	apiAjax.saveaccount = function (data) {
		console.log("apiAjax saveaccount");
		return makeTheCall(saveAccount, {
			account: data
		});
	};
	apiAjax.savemanager = function (data) {
		console.log("apiAjax manager");
		return makeTheCall(saveManager, {
			manager: data
		});
	};
	apiAjax.saveproperty = function (data) {
		console.log("apiAjax property");
		return makeTheCall(saveProperty, {
			property: data
		});
	};
	apiAjax.savetenant = function (data) {
		console.log("apiAjax tenant");
		return makeTheCall(saveTenant, {
			tenant: data
		});
	};
	apiAjax.savecontractor = function (data) {
		console.log("apiAjax contractor");
		return makeTheCall(saveContractor, {
			contractor: data
		});
	};
	apiAjax.savecontregions = function (data) {
		console.log("apiAjax savecontregions");
		return makeTheCall(saveContRegions, {
			contregions: data
		});
	};
	return apiAjax;
});
