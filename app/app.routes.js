ticketFixApp.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: function($routeParams) {
            // console.log("routing to home");
            return 'app/components/home/homeView.html';
        }
    });
    $routeProvider.when('/register', {
        templateUrl: function($routeParams) {
            // console.log("routing to register");
            // return 'app/components/registration/registrationView.html';
            return 'app/components/registration/reg-form.html';
        }
    });
    $routeProvider.when('/registertwo', {
        templateUrl: function($routeParams) {
            // console.log("routing to register");
            // return 'app/components/registration/registrationView.html';
            return 'app/components/registration/reg-form-companyinfo.html';
        }
    });
    $routeProvider.when('/registerthree', {
        templateUrl: function($routeParams) {
            // console.log("routing to register");
            // return 'app/components/registration/registrationView.html';
            return 'app/components/registration/reg-form-stepthree.html';
        }
    });
    $routeProvider.when('/login', {
        templateUrl: function($routeParams) {
            // console.log("routing to login");
            return 'app/components/login/loginView.html';
        }
    });
    $routeProvider.otherwise({
        redirectTo: '/'
    });
});
