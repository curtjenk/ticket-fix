ticketFixApp.controller('managerController', function($rootScope, $scope, $http, $q, $location, apiAjax, zipLookup) {

    var user = $rootScope.user;
    console.log($rootScope.user);
    var email = user.email;

    apiAjax.getallmanagertickets(email).then(
        function(succ) {
            console.log(succ);
            $scope.tickets = succ.data.info;
        },
        function(err) {
            console.log(err);
        });









});
