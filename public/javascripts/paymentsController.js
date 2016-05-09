coffeeApp.controller('paymentsController', function($scope, $http, $route, $location, $cookies){

	$http.get(apiUrl + 'getUserData?token=' + $cookies.get('token'), {
	}).then(function successCallback(response){
		console.log(response)
		// if(response.data.failure == 'badToken'){
		// 	//user needs to log in
		// 	$location.path('/register')
		//}
		//console.log(response.data);
		var userOptions = response.data;
	}, function errorCallback(response){
		console.log(response);
	});

	$http.get("http://localhost:3000/getUserData?token=" + $cookies.get('token'),{
		}).then(function successCallback(response){
			if(response.data.failure == 'noToken'){
				$location.path('/login');
			}else if(response.data.failure =='badToken'){
				$location.path('/login');
			}else{
				var userOptions = response.data;
				console.log(response.data);
				$scope.fullName = userOptions.fullName;
				$scope.address = userOptions.address1;
				$scope.address2 = userOptions.address2;
				$scope.city = userOptions.city;
				$scope.state = userOptions.state;
				$scope.zip = userOptions.zipCode;
				$scope.deliveryDate = userOptions.deliveryDate;
				$scope.plan = userOptions.plan;
				$scope.grind = userOptions.grind;
				$scope.quantity = userOptions.quantity;
				$scope.frequency = userOptions.frequency;
				$scope.total = (userOptions.quantity * 20);
			}
			}, function errorCallback(response){
			console.log("ERROR");
			}
	);

	// function enableStripe(total){
	// 	var total = total * 100;
	// 	var handler = StripeCheckout.configure({
	//     	key: 'pk_test_rWLa6iTLc7PEWPlIsrkXjHyN',
	//     	image: '',
	//     	locale: 'auto',
	//     	token: function(token) {
	//       	// You can access the token ID with `token.id`.
	//       	// Get the token ID to your server-side code for use.
	//     	}	
	// 	});	
	// 	$('#place-order').on('click', function(e) {
	// 	    // Open Checkout with further options:
	// 	    handler.open({
	// 	    	name: 'DC Roasters',
	// 	      	description: 'Coffee Order',
	// 	      	amount: total
	// 	    });
	// 	    e.preventDefault();
	// 	});	
	//   	// Close Checkout on page navigation:
	//   	$(window).on('popstate', function() {
	//     	handler.close();
	//   	});
	// };

});