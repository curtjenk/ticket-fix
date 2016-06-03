ticketFixApp.controller('indexController', function($scope, $http, $location) {

    $scope.showSearchBar = false;
    $scope.arrowUp = false;
    $scope.arrowDown = true;
    $scope.showLeftNavBtns = true;

    $scope.toggleSearch = function() {

        // Another 
        // if($scope.showSearchBar == false){
        //     $scope.showSearchBar = true;
        // } else if ($scope.showSearchBar == true){
        //     $scope.showSearchBar = false;
        // }
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
        // anchorSmoothScroll.scrollTo(eID);

    };



});


