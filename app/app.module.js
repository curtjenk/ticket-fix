var ticketFixApp = angular.module('ticketFixApp', ['ui.router', 'ui.bootstrap', 'ngMessages', 'LocalStorageModule', 'ngMaterial']);

// ticketFixApp.config(['$compileProvider', function ($compileProvider) {
//   $compileProvider.debugInfoEnabled(false);
// }]);//"run" executes once all modules have been loaded.
ticketFixApp.run(function ($rootScope, $location) {

	$rootScope.$watch(
		//This is the watch value function. It should return the value which is being watched.
		//In this case, we're watching the path.
		function () {
			return $location.path();
		},
		//This is the watch listener function.  It will should "do" something when the
		//watched value has changed.  In this case, if the path changed to something
		//other than the home page and the user is not logged in pushed them to the home page.
		function (a) {

			if (a !== '/') {
				console.log('url has changed : ' + a);
				//Put some code in here to check if they are logged in!
				//If not... send them home.
				// if (!sharedData.isLoggedIn()) {
				//     console.log(' ... but the user is not logged in');
				//      $location.path('/');
				// }
			}
		});
});

//disable submit button if form is invalid
// add attribute "disable-btn"
ticketFixApp.directive('disableBtn', function () {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var $el = $(element);
			var submitBtn = $el.find('button[type="submit"]');
			var _name = attrs.name;
			scope.$watch(_name + '.$valid', function (val) {
				if (val) {
					submitBtn.removeAttr('disabled');
				} else {
					submitBtn.attr('disabled', 'disabled');
				}
			});
		}
	};
});

/*  Usage for compareTo directive
<div role="alert" class="error-message"
ng-messages="userRegistrationForm.conf.$error"
ng-show="userRegistrationForm.conf.$touched">
  <p ng-message="required">This field is required</p>
  <p ng-message="compareTo">Password not matching!</p>
</div>

 see components/registration/partials/reg-form-profile.html for live example.
*/
ticketFixApp.directive('compareTo', function() {
  return {
    require: "ngModel",
    scope: {
      otherModelValue: "=compareTo"
    },
    link: function(scope, element, attributes, ngModel) {

      ngModel.$validators.compareTo = function(modelValue) {
          console.log("model value");
          console.log(modelValue);
          console.log("other model value");
          console.log(scope.otherModelValue);
        return modelValue === scope.otherModelValue.$modelValue;
      };

      scope.$watch("otherModelValue", function() {
        ngModel.$validate();
      });
    }
  };

});

//add  "check-image" (without quotes) attribute to the img element
ticketFixApp.directive('checkImage', function ($http) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			attrs.$observe('ngSrc', function (ngSrc) {
				$http.get(ngSrc).success(function () {
					// alert('image exists');
				}).error(function () {
					// alert('image does not exist');
					element.attr('src', 'assets/img/placeholder.jpg'); // set default image
				});
			});
		}
	};
});
