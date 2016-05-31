ticketFixApp.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: function($routeParams) {
            // console.log("routing to home");
            return 'app/components/home/homeView.html';
        }
    });
    $routeProvider.when('/register', {
        templateUrl: function($routeParams) {
            // console.log("routing to home");
            return 'app/components/registration/registrationView.html';
        }
    });
    $routeProvider.when('/login', {
        templateUrl: function($routeParams) {
            // console.log("routing to home");
            return 'app/components/login/loginView.html';
        }
    });
    $routeProvider.when('/about', {
        templateUrl: function($routeParams) {
            // console.log("routing to home");
            return 'app/components/about/aboutView.html';
        }
    });
    $routeProvider.when('/benefits', {
        templateUrl: function($routeParams) {
            // console.log("routing to home");
            return 'app/components/benefits/benefitsView.html';
        }
    });
    $routeProvider.when('/contact', {
        templateUrl: function($routeParams) {
            // console.log("routing to home");
            return 'app/components/contact/contactView.html';
        }
    });
    $routeProvider.otherwise({
        redirectTo: '/'
    });
});
