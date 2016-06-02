ticketFixApp.controller('registrationController', function($scope, $http) {
var apiUrl = "http://localhost:3000";


$scope.registerForm = function() {
    var url = apiUrl + "/register";
    var user = new User({
      // type_user_id: 1,
      email: $scope.email,
      first_name: $scope.firstname,
      last_name: $scope.lastname,
      password: $scope.password,
      property_code: $scope.propertycode,
      home_phone: $scope.phone,
      mobile_phone: $scope.mobile
    });
    
    $http.post(url, user).then(
      function(success){
        console.log(success);
      }, function(err){
        console.log(err);
      });
  };

});



