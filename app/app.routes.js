// configuring our routes for registration nested views (wizard)
// =============================================================================
ticketFixApp.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

        // route to show our basic form (/form)
        .state('home', {
            url: '/',
            templateUrl: 'app/components/home/homeView.html'
            // controller: 'registrationController'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'app/components/login/loginView.html'
            // controller: 'registrationController'
        })
        .state('register', {
            url: '/register',
            abstract: true,
            templateUrl: 'app/components/registration/partials/reg-form.html',
            controller: 'registrationController'
        })
        .state('register.profile', {
            parent: 'register',
            url: '',
            templateUrl: 'app/components/registration/partials/reg-form-profile.html'
        })
        .state('register.account', {
            parent: 'register',
            url: '/account',
            templateUrl: 'app/components/registration/partials/reg-form-account.html'
        })
        .state('register.unit', {
            parent: 'register',
            url: '/unit',
            templateUrl: 'app/components/registration/partials/reg-form-tenantunit.html'
        })
        .state('register.units', {
            parent: 'register',
            url: '/units',
            templateUrl: 'app/components/registration/partials/reg-form-managementunits.html'
        });
        // nested states
        // each of these sections will have their own view
        // url will be nested (/form/profile)
        // .state('form.profile', {
        //     url: '/profile',
        //     templateUrl: 'form-profile.html'
        // })

        // url will be /form/interests
        // .state('form.interests', {
        //     url: '/interests',
        //     templateUrl: 'form-interests.html'
        // })

        // url will be /form/payment
        // .state('form.payment', {
        //     url: '/payment',
        //     templateUrl: 'form-payment.html'
        // });

    // catch all route
    // send users to the form page
    $urlRouterProvider.otherwise('/');
});

// ticketFixApp.config(function($routeProvider) {
//     $routeProvider.when('/', {
//         templateUrl: function($routeParams) {
//             // console.log("routing to home");
//             return 'app/components/home/homeView.html';
//         }
//     });
//     $routeProvider.when('/register', {
//         templateUrl: function($routeParams) {
//             // console.log("routing to register");
//             // return 'app/components/registration/registrationView.html';
//             return 'app/components/registration/reg-form.html';
//         }
//     });
//     $routeProvider.when('/registertwo', {
//         templateUrl: function($routeParams) {
//             // console.log("routing to register");
//             // return 'app/components/registration/registrationView.html';
//             return 'app/components/registration/reg-form-companyinfo.html';
//         }
//     });
//     $routeProvider.when('/registerthree', {
//         templateUrl: function($routeParams) {
//             // console.log("routing to register");
//             // return 'app/components/registration/registrationView.html';
//             return 'app/components/registration/reg-form-stepthree.html';
//         }
//     });
//     $routeProvider.when('/login', {
//         templateUrl: function($routeParams) {
//             // console.log("routing to login");
//             return 'app/components/login/loginView.html';
//         }
//     });
//     $routeProvider.otherwise({
//         redirectTo: '/'
//     });
// });
