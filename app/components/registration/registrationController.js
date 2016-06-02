ticketFixApp.controller('registrationController', function($scope, $http) {
var apiUrl = "http://localhost:3000";


$scope.registerForm = function() {
    var url = apiUrl + "/register";
    var user = new User({
      // type_user_id: 1,
      email: $scope.email,
      first_name: $scope.firstname,
      password: $scope.password
    });
    $http.post(url, user).then(
      function(success){
        console.log(success);
      }, function(err){
        console.log(err);
      });
  };

});



