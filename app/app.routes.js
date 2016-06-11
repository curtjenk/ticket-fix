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
        .state('tenant', {
            url: '/viewtenants',
            templateUrl: 'app/components/admin/view-tenant.html',
            controller: 'tenantController'
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
        .state('register.regions', {
            parent: 'register',
            url: '/regions',
            templateUrl: 'app/components/registration/partials/reg-form-contractorregions.html'
        })
        .state('register.floorplan', {
            parent: 'register',
            url: '/floorplan',
            templateUrl: 'app/components/registration/partials/reg-form-floorplan.html'
        })
        .state('ticket', {
            url: '/ticket',
            abstract: true,
            templateUrl: 'app/components/ticket/partials/ticket-form.html',
            controller: 'ticketController'
        })
        .state('ticket.create', {
            parent: 'ticket',
            url: '',
            templateUrl: 'app/components/ticket/partials/ticket-form-create.html'
        })
        .state('ticket.approval', {
            parent: 'ticket',
            url: '/approval',
            templateUrl: 'app/components/ticket/partials/ticket-form-approval.html'
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
