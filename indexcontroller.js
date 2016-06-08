ticketFixApp.controller('indexController', function($rootScope, $scope, $http, $location, anchorSmoothScroll) {

    $scope.showSearchBar = false;
    $scope.arrowUp = false;
    $scope.arrowDown = true;
    $scope.showLeftNavBtns = true;

    $scope.toggleSearch = function() {
        $scope.showSearchBar = !$scope.showSearchBar;
    }

    $scope.arrowChange = function() {
        $scope.arrowDown = !$scope.arrowDown;
        $scope.arrowUp = !$scope.arrowUp;
    }

    $scope.gotoElement = function(eID) {
        // set the location.hash to the id of
        // the element you wish to scroll to.
        // $location.hash('contact');

        // call $anchorScroll()
        anchorSmoothScroll.scrollTo(eID);

    };

    $scope.register = function(type) {

        $rootScope.userType = type;
        $location.path('/register/profile');
    };



});
