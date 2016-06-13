ticketFixApp.controller('tenantController', function($rootScope, $scope, $http, apiAjax) {

    $scope.page = {};

    $scope.page.currentPage = 1;
    $scope.page.pageSize = 10;

    var user = $rootScope.user;
    console.log($rootScope.user);
    var email = user.email;

    apiAjax.getalltenantsinfo(email).then(
        function(succ) {
            console.log(succ);
            $scope.tenants = succ.data.info;
        },
        function(err) {
            console.log(err);
        });

});
