ticketFixApp.config(['ChartJsProvider', function(ChartJsProvider) {
    // Configure all charts
    // ChartJsProvider.setOptions({
    // 	colours: ['#FF5252', '#FF8A80'],
    // 	responsive: true,
    // 	tooltips: true
    // });
    // // Configure all line charts
    // ChartJsProvider.setOptions('Line', {
    // 	datasetFill: true
    // });
}]);

ticketFixApp.controller('adminController', function($rootScope, $scope, $http, apiAjax) {

    $scope.page = {};

    $scope.page.currentPage = 1;
    $scope.page.pageSize = 10;

    var user = $rootScope.user;
    // console.log($rootScope.user);
    var email = user.email;

    getTicketsPerDay();
    
     // Pull all the tenants signed up on the site on the page.
    apiAjax.getalltenantsinfo(email).then(
        function(succ) {
            // console.log(succ);
            $scope.tenants = succ.data.info;
        },
        function(err) {
            // console.log(err);
        });

    // Pull all the managers signed up on the site on the page.
    apiAjax.getallmanagersinfo(email).then(
        function(succ) {
            console.log(succ);
            $scope.managers = succ.data.info;
        },
        function(err) {
            console.log(err);
        });

    // Pull all the contractors signed up on the site on the page.
    apiAjax.getallcontractorsinfo(email).then(
        function(succ) {
            console.log(succ);
            $scope.contractors = succ.data.info;
        },
        function(err) {
            console.log(err);
        });


    $scope.refresh = function() {
        getTicketsPerDay();
    };

    function getTicketsPerDay() {
        $scope.chartContent = {};
        labels = [];
        data = [];
        series = ['Tickets'];
        apiAjax.getTicketsPerDay(email).then(
            function(succ) {
                var ticksPerDay = succ.data.info;
                // console.log(succ);
                for (var i = 0; i < ticksPerDay.length; i++) {
                    var d = moment(ticksPerDay[i].DateOnly);
                    // console.log(d.format('YYYY-MM-DD'));
                    labels.push(d.format('YYYY-MM-DD'));
                    data.push(ticksPerDay[i].num);
                }
                var json = {
                    "series": ["Tickets"],
                    "data": data,
                    "labels": labels
                };
                $scope.chartContent = json;
            },
            function(err) {
                // console.log(err);
            });
    }
});
