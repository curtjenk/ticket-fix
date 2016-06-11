ticketFixApp.controller('ticketController', function($rootScope, $scope, $http, $location, $sce, apiAjax, localStore) {

    var counter = 0;
    $scope.totalMarkers = "";
    $scope.markerArray = [];

    $scope.addMarker = function($event) {
        counter++;
        console.log(counter);
        console.log('WOW YOU CLICKED IT!');
        console.log($event);
        var xClick = $event.offsetX - 10;
        var yClick = $event.offsetY - 10;
        var newHtml = '<div class="marker text-center" style="position: absolute; top: ' + yClick + 'px; left: ' + xClick + 'px;">' + counter + '</div>';
        $scope.totalMarkers += newHtml;
        $scope.newMarker = $sce.trustAsHtml($scope.totalMarkers);
        $scope.markerArray.push($scope.totalMarkers);
        console.log($scope.markerArray);

    };

    $scope.removeMarkers = function(){
        $scope.newMarker = "";
    };

    var descMax = 1000;
    var entryMax = 240;
    $scope.count = descMax;
    $scope.countTwo = entryMax;
    $scope.textFunc = function(){
        $scope.count = descMax - $scope.formData.desc.length;
    };

    $scope.textFuncTwo = function(){
        $scope.countTwo = entryMax - $scope.formData.entry.length; 
    };
    

    $scope.formData = {};
    var d = new Date();
    $scope.formData.date = d.toDateString();
    var user = $rootScope.user;
    var localData;

    onload();

    // ---- helper functions below ----
    function onload() {
        if (user && user.email) {
            localData = localStore.get(user.email);
        } else {
            //user not logged in.  Just show an empty page for now!
            return;
        }
        console.log(' -----------------------------------------------');
        console.log(localData);
        if (localData.userType == 3) {
            /* returns
            email, first_name, last_name, home_phone, mobile_phone,
              code, address1, address2, city, state, zip
            */
            apiAjax.gettenantinfo(user.email).then(function(res) {
                console.log(res);

                if (res.data.success === true) {
                    $scope.formData.firstname = res.data.info.first_name;
                    $scope.formData.lastname = res.data.info.last_name;
                    $scope.formData.email = res.data.info.email;
                    $scope.formData.phone = res.data.info.home_phone;
                    $scope.formData.mobile = res.data.info.mobile_phone;

                }
            }, function(err) {

            });
        } else if (localData.userType == 4) { //manager
            apiAjax.getmanagerinfo(user.email).then(function(res) {
                console.log(res);

                if (res.data.success === true) {
                    $scope.formData.firstname = res.data.info.first_name;
                    $scope.formData.lastname = res.data.info.last_name;
                    $scope.formData.email = res.data.info.email;
                    $scope.formData.phone = res.data.info.home_phone;
                    $scope.formData.mobile = res.data.info.mobile_phone;

                }
            }, function(err) {

            });
        }
    }

});
