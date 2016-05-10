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

	$scope.payOrder = function(userOptions) {
        $scope.errorMessage = "";
        var handler = StripeCheckout.configure({
            key: 'pk_test_rWLa6iTLc7PEWPlIsrkXjHyN',
            image: '',
            locale: 'auto',
            token: function(token) {
                console.log("The token Id is: ");
                console.log(token.id);

                $http.post(apiUrl + 'payments', {
                    amount: $scope.total * 100,
                    stripeToken: token.id,
                    token: $cookies.get('token')
                        //This will pass amount, stripeToken, and token to /payment
                }).then(function successCallback(response) {
                    console.log(response.data);
                    if (response.data.success) {
                        //Say thank you
                        $location.path('/receipt');
                    } else {
                        $scope.errorMessage = response.data.message;
                        
                    }
                }, function errorCallback(response) {});
            }
        });
        handler.open({
            name: 'DC Roasters',
            description: 'Your Order',
            amount: $scope.total * 100
        });
    };

});