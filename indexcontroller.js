ticketFixApp.controller('indexController', function ($rootScope, $scope, $http, $location, localStore, anchorSmoothScroll) {

	$scope.showSearchBar = false;
	$scope.arrowUp = false;
	$scope.arrowDown = true;
	$scope.showLeftNavBtns = true;
	$scope.loggedIn = false;
	$scope.registrationInProgress = false;

	$scope.toggleSearch = function () {
		$scope.showSearchBar = !$scope.showSearchBar;
	};

	$scope.arrowChange = function () {
		$scope.arrowDown = !$scope.arrowDown;
		$scope.arrowUp = !$scope.arrowUp;
	};

	$scope.gotoElement = function (eID) {
		// set the location.hash to the id of
		// the element you wish to scroll to.
		// $location.hash('contact');

		// call $anchorScroll()
		anchorSmoothScroll.scrollTo(eID);

	};

	$scope.register = function (type) {
		$scope.registrationInProgress = true;
		$rootScope.userType = type;
		$scope.userType = type;
		$location.path('/register');
	};

	$scope.$on("nothome", function (event, args) {
		$scope.home = false;
	});

	$scope.$on("home", function (event, args) {
		$scope.home = true;
	});

	$scope.$on("registration-complete", function (event, args) {
		$scope.registrationInProgress = false;
	});

	$scope.$on("userLoggedIn", function (event, args) {
		$scope.loggedIn = true;
		$scope.userType = args.userType;
		$scope.email = args.email;
	});

	$scope.$on("userLoggedOut", function (event, args) {
		// alert("logged out");
		$scope.loggedIn = false;
		localStore.remove($scope.email);
	});

	$scope.logout = function () {
		$scope.loggedIn = false;
		localStore.remove($scope.email);
		$location.path('/');
	};



});
