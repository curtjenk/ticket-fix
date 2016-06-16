//do not change the name of "items" and you must pass an object
ticketFixApp.controller('ModalEmailMgrInstanceCtrl', function ($scope, $uibModalInstance, items) {

	$scope.address1 = items.address1;
	$scope.address2 = items.address2;
	$scope.city = items.city;
	$scope.state = items.state;
	$scope.zip = items.zip;
	$scope.issue_description = items.issue_description;
	$scope.emailAddr = items.user_email;
	$scope.emailSubject = items.subject;
	$scope.modalHeading = items.modalHeading;
	var emailTo = items.emailTo + ',hello@ticketfixme.com,josh@ticketfixme.com,curtis@ticketfixme.com';
	// var emailTo = items.manager_email + ',hello@ticketfixme.com,josh@ticketfixme.com,curtis@ticketfixme.com';

	$scope.ok = function () {
		//capture data from the modal
		$scope.sendMailOptions = {
			from: $scope.emailAddr,
			to: emailTo,
			subject: $scope.emailSubject,
			text: $scope.emailBody,
			html: "<div>" + $scope.emailName + "</div>" + "<div>" + $scope.emailBody + "</div>"
		};
		$uibModalInstance.close($scope.sendMailOptions);
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
});

ticketFixApp.controller('contractorController', function ($rootScope, $scope, $http, $sce, $q, $state, $uibModal, $log, apiAjax, zipLookup) {

	var tenantinfo = {};
	var user = $rootScope.user; // this is the logged-in user
	var email = user.email;
	$scope.contractor_email = $rootScope.user.email;
	$scope.page = {};
	$scope.page.viewByOptions = [3, 5, 10];
	$scope.page.currentPage = 1;
	$scope.page.pageSize = 5;
	$scope.page.viewby = 5;

	$scope.page.setItemsPerPage = function (num) {
		$scope.page.pageSize = num;
		$scope.page.currentPage = 1; //reset to first page
	};

	runGetContractorTickets(email);

	$scope.transitionToTicket = function (item) {
		console.log(item);
		//alert("Show ticket details");
		$rootScope.ticket_id = item.ticket_id;
		$rootScope.next_state = 'contractor.tickets';
		$state.transitionTo('view-ticket');

	};

	//$scope.items = user.email;
	// $scope.open = function (size) {
	$scope.activateEmailModal = function (item) {
		//add the contractor's email address to the item object.
		item.user_email = user.email;
		item.emailTo = item.manager_email;
		item.modalHeading = "Contact the property manager for";
		item.subject = "Contractor requests additional information regarding ticket #" + item.ticket_id;
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'ModalEmailManager.html',
			controller: 'ModalEmailMgrInstanceCtrl',
			size: 'lg',
			resolve: {
				items: function () {
					return item;
				}
			}
		});

		modalInstance.result.then(function (emailOptions) {
			console.log(emailOptions);
			apiAjax.sendmail(user.email, emailOptions).then(
				function (succ) {
					console.log(succ);
				},
				function (err) {
					console.log(err);
				});
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};




	//   Custom orderby function for applying a different sort rule for the click_count column
	//without this function the "click count" would be sorted as string instead of a number
	//have to know which column is being sorted
	// returns a closure of the orignal function
	$scope.orderByFunction = function (sortType) {
		return function (item) {

			if (sortType === 'zip') { //sorting on the click_count. force integer comparison versus default string compare
				console.log(sortType);
				return parseInt(item.zip);
			} else if (sortType === 'address1') {
				return item.address1;
			} else if (sortType === 'address2') {
				return item.address2;
			} else {
				return item.city;
			}
		};
	};


	//helper functions below ----------
	//allow the contractor to send an email to the manager
	function doSendEmail() {

		var emailHtml =
			"<div><h1>Location</h1>" +
			"    <p>" + tenantinfo.address1 + tenantinfo.address2 + "</p>" +
			"    <p>" + tenantinfo.city + "," + tenantinfo.state + " " + tenantinfo.zip + "</p>" +
			"</div>" +
			"<div><h1>Description Of Issue and Special Instructions</h1>" +
			"    <p>" + ticket.issue_description + "</p>" +
			"    <p>" + ticket.entry_point + "</p>" +
			"    <p> <h4>Pet(s)? :" + ticket.pet + "</h4></p>" +
			"    <p> <h4>Contact :</h4> " +
			"    <p>" + ticket.contact_first_name + " " + ticket.contact_last_name + "</p>" +
			"    <p>" + formatPhone(ticket.contact_phone) + " " + formatPhone(ticket.contact_mobile) + " " + ticket.contact_email + "</p>" +
			"    <p> <h4>Alternate Contact :</h4>" +
			"    <p>" + ticket.alt_first_name + " " + ticket.alt_last_name + "</p>" +
			"    <p>" + formatPhone(ticket.alt_phone) + " " + ticket.alt_email + "</p>" +
			"</div>";
		var emailText = emailHtml;

		var sendMailOptions = {
			from: user.email,
			to: 'hello@ticketfixme.com,josh@ticketfixme.com,curtis@ticketfixme.com',
			subject: "Tenant requires attention",
			text: emailText,
			html: emailHtml
		};
		apiAjax.sendmail(user.email, sendMailOptions).then(
			function (succ) {
				console.log(succ);
			},
			function (err) {
				console.log(err);
			});
	}

	function runGetContractorTickets(email) {
		$scope.errorMessage = "";
		apiAjax.getContractorTickets(email).then(
			function (succ) {
				console.log(succ);
				var c = succ.data;
				if (c.success === true) {
					$scope.tickets = c.info;
					for (i = 0; i < c.info.length; i++) {
						//console.log($scope.tickets[i].ticket_status);  //item.ticket_status
						$scope.tickets[i].ticket_date = formatDateYYYYMMDD($scope.tickets[i].client_datetime_string);
					}
				} else {
					$scope.errorMessage = "Sorry, we didn't find anything in your region(s)";
				}
			},
			function (err) {
				console.log(err);
			});
	}
});
