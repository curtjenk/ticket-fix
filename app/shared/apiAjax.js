//var baseUrl = 'http://localhost:3000';
//var baseUrl = Config.ticketFixMeApi;
var SendMailOptions = function(data) {
    data = data || {};
    this.from = data.from;
    this.to = data.to;
    this.subject = data.subject;
    this.text = data.text;
    this.html = data.html;
};
ticketFixApp.factory('apiAjax', function($http, $q, localStore) {
    var baseUrl = Config.ticketFixMeApi;
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
    var ticketinfoUrl = baseUrl + "/api/ticketinfo";
    var tenantinfo = baseUrl + "/api/tenantinfo";
    var managerinfo = baseUrl + "/api/managerinfo";
    var alltenantsinfo = baseUrl + "/api/alltenantsinfo";
    var allmanagersinfo = baseUrl + "/api/allmanagersinfo";
    var createticket = baseUrl + "/api/createticket";
    var allmanagertickets = baseUrl + "/api/allmanagertickets";
    var alltenanttickets = baseUrl + "/api/alltenanttickets";
    var allmanagerproperties = baseUrl + "/api/allmanagerproperties";
    var savemanagerproperty = baseUrl + "/api/savemanagerproperty";
    var contractorticketsUrl = baseUrl + "/api/contractor/tickets"; //get a list of tickets in the contractor's service regions.
    var adminTicketsPerDayUrl = baseUrl + "/api/admin/ticketsperday";
    var updateTicketStatusUrl = baseUrl + "/api/update/ticketstatus";
    var sendmailUrl = baseUrl + "/api/sendmail";
    var sendmailContactUrl = baseUrl + "/sendmailcontactus";

    var ApiResponse = function(res) {
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
    var makeTheCall = function(whereTo, data) {
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
    var makeThePostApiCall = function(api, email, whereTo, data) {
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
    var makeTheGetApiCall = function(api, email, whereTo, queryParms) {
        var ct = checkToken(api, email);
        //console.log(ct);
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
    apiAjax.sendmail = function(userEmail, sendMailOptions) {
        console.log("apiAjax sendmail for " + userEmail);
        return makeThePostApiCall('sendmail', userEmail, sendmailUrl, {
            sendMailOptions: sendMailOptions
        });

    };
    apiAjax.updateTicketStatus = function(userEmail, ticket_id, status_id) {
        console.log("apiAjax updateTicketStatus for " + userEmail);
        return makeThePostApiCall('updateTicketStatus', userEmail, updateTicketStatusUrl, {
            ticket_id: ticket_id,
            status_id: status_id
        });

    };
    apiAjax.sendmailContactUs = function(sendMailOptions) {
        console.log("apiAjax sendmailContactUs");
        return makeTheCall(sendmailContactUrl, {
            sendMailOptions: sendMailOptions
        });
    };
    apiAjax.createticket = function(ticket, email) {
        console.log("apiAjax createticket");
        return makeThePostApiCall('createticket', email, createticket, {
            ticket: ticket
        });
    };
    apiAjax.getContractorTickets = function(email) {
        var queryParms = 'email=' + email;
        console.log('apiAjax getContractorTickets');
        return makeTheGetApiCall('getContractorTickets', email, contractorticketsUrl, queryParms);
    };
    apiAjax.getTicketsPerDay = function(email) {
        var queryParms = 'email=' + email;
        console.log('apiAjax getTicketsPerDay');
        return makeTheGetApiCall('getTicketsPerDay', email, adminTicketsPerDayUrl, queryParms);
    };
    apiAjax.getTicketInfo = function(email, ticket_id) {
        var queryParms = 'email=' + email + '&ticket_id=' + ticket_id;
        console.log('apiAjax getContractorTickets');
        return makeTheGetApiCall('getTicketInfo', email, ticketinfoUrl, queryParms);
    };
    apiAjax.gettenantinfo = function(email) {
        var queryParms = 'email=' + email;
        console.log('apiAjax gettenantinfo');
        return makeTheGetApiCall('gettenantinfo', email, tenantinfo, queryParms);
    };
    apiAjax.getalltenantsinfo = function(email) {
        var queryParms = '';
        console.log('apiAjax getalltenantsinfo');
        return makeTheGetApiCall('getalltenantsinfo', email, alltenantsinfo, queryParms);
    };
    apiAjax.getallmanagersinfo = function(email) {
        var queryParms = '';
        console.log('apiAjax getallmanagersinfo');
        return makeTheGetApiCall('getallmanagersinfo', email, allmanagersinfo, queryParms);
    };
    //Begin manager stuff
    apiAjax.getmanagerinfo = function(email) {
        var queryParms = 'email=' + email;
        console.log('apiAjax managerinfo');
        return makeTheGetApiCall('managerinfo', email, managerinfo, queryParms);
    };
    apiAjax.getallmanagertickets = function(email) {
        var queryParms = 'email=' + email;
        console.log('apiAjax managertickets');
        return makeTheGetApiCall('managertickets', email, allmanagertickets, queryParms);
    };
    apiAjax.getalltenanttickets = function(email) {
        var queryParms = 'email=' + email;
        console.log('apiAjax tenanttickets');
        return makeTheGetApiCall('tenanttickets', email, alltenanttickets, queryParms);
    };
    apiAjax.getallmanagerproperties = function(email) {
        var queryParms = 'email=' + email;
        console.log('apiAjax managerproperties');
        return makeTheGetApiCall('managerproperties', email, allmanagerproperties, queryParms);
    };
    apiAjax.savemanagerproperty = function(email, property) {
        console.log('apiAjax savemanagerproperty');
        return makeThePostApiCall('savemanagerproperty', email, savemanagerproperty, {
            property: property,
            email: email
        });
    };
    // --- end manager stuff
    apiAjax.login = function(email, password) {
        console.log("apiAjax login");
        return makeTheCall(login, {
            email: email,
            password: password
        });
    };
    apiAjax.registerNew = function(user, property, account) {
        console.log("apiAjax register new ");
        return makeTheCall(registerNew, {
            user: user,
            property: property,
            account: account
        });
    };
    apiAjax.register = function(data) {
        console.log("apiAjax register ");
        return makeTheCall(register, {
            user: data
        });
    };
    apiAjax.saveaccount = function(data) {
        console.log("apiAjax saveaccount");
        return makeTheCall(saveAccount, {
            account: data
        });
    };
    apiAjax.savemanager = function(data) {
        console.log("apiAjax manager");
        return makeTheCall(saveManager, {
            manager: data
        });
    };
    apiAjax.saveproperty = function(data) {
        console.log("apiAjax property");
        return makeTheCall(saveProperty, {
            property: data
        });
    };
    apiAjax.savetenant = function(data) {
        console.log("apiAjax tenant");
        return makeTheCall(saveTenant, {
            tenant: data
        });
    };
    apiAjax.savecontractor = function(data) {
        console.log("apiAjax contractor");
        return makeTheCall(saveContractor, {
            contractor: data
        });
    };
    apiAjax.savecontregions = function(data) {
        console.log("apiAjax savecontregions");
        return makeTheCall(saveContRegions, {
            contregions: data
        });
    };
    return apiAjax;
});
