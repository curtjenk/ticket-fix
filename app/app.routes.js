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
        })
        .state('manager', {
            url: '/manager',
            abstract: true,
            templateUrl: 'app/components/manager/partials/manager-view.html',
            controller: 'managerController'
        })
        .state('manager.properties', {
            parent: 'manager',
            url: '',
            templateUrl: 'app/components/manager/partials/manager-view-properties.html'
        })
        .state('manager.createticket', {
            parent: 'manager',
            url: '/mgrticket',
            templateUrl: 'app/components/manager/partials/manager-ticket.html'
        })
        .state('manager.tickets', {
            parent: 'manager',
            url: '/tickets',
            templateUrl: 'app/components/manager/partials/manager-view-tickets.html'
        })
        .state('contractor', {
            url: '/contractor',
            abstract: true,
            templateUrl: 'app/components/manager/partials/manager-view.html',
            controller: 'contractorController'
        })
        .state('contractor.tickets', {
            parent: 'contractor',
            url: '',
            templateUrl: 'app/components/contractor/partials/contractor-view-tickets.html'
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
