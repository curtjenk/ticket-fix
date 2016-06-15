ticketFixApp.controller('homeController', function($rootScope, $scope, $http, $location) {


    $scope.register = function(type) {

        $rootScope.userType = type;
        $location.path('/register');
    };

    $scope.stepsMessage = "Tenant";
    $scope.tenantStep = true;
    $scope.managerStep = false;
    $scope.contractorStep = false;

    $scope.changeSteps = function(step) {
        if (step == 1) {
            $scope.tenantStep = true;
            $scope.managerStep = false;
            $scope.contractorStep = false;
            $scope.stepsMessage = "Tenant";
        } else if (step == 2) {
            $scope.managerStep = true;
            $scope.tenantStep = false;
            $scope.contractorStep = false;
            $scope.stepsMessage = "Property Owner";
        } else if (step == 3) {
            $scope.contractorStep = true;
            $scope.managerStep = false;
            $scope.tenantStep = false;
            $scope.stepsMessage = "Contractor";

        }


    };

    $scope.message = {};
    $scope.message.message = "";

    var messageMax = 1000;
    $scope.count = messageMax;
    $scope.textFunc = function() {
        if ($scope.message.message) {
            $scope.count = messageMax - $scope.message.message.length;
        } else {
            $scope.count = messageMax;
        }
    };

});
