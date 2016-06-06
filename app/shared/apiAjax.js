var baseUrl = 'http://localhost:3000';

ticketFixApp.factory('apiAjax', function ($http) {
	var apiAjax = {};
	var login = baseUrl + "/login";
	var register = baseUrl + "/register";
	var saveAccount = baseUrl + "/saveaccount";
	var saveManager = baseUrl + "/savemanager";
	var saveProperty = baseUrl + "/saveproperty";
	var saveContractor = baseUrl + "/contractor";
	apiAjax.login = function (data) {
		console.log("apiAjax login");
		return $http({
			method: "post",
			url: login,
			data: data,
			dataType: 'json'
		});
	};

  apiAjax.register = function (data) {
    console.log("apiAjax register");
    return $http({
      method: "post",
      url: register,
      data: data,
      dataType: 'json'
    });
  };

  apiAjax.saveaccount = function (data) {
    console.log("apiAjax saveaccount");
    return $http({
      method: "post",
      url: saveAccount,
      data: data,
      dataType: 'json'
    });
  };

  apiAjax.savemanager = function (data) {
    console.log("apiAjax manager");
    return $http({
      method: "post",
      url: saveManager,
      data: data,
      dataType: 'json'
    });
  };

  return apiAjax;
});
