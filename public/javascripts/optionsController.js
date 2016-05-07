coffeeApp.controller('optionsController', function($scope, $http, $route, $location, $cookies){

	$http.get(apiUrl + 'getUserData?token=' + $cookies.get('token'), {
	}).then(function successCallback(response){
		console.log(response)
		if (response.data.failure == 'noToken' || response.data.failure == 'badToken'){
		//redirect to login page
			$location.path('/login');
		} else {
			$scope.userOptions = response.data;
		}

		//var userOptions = response.data;
	}, function errorCallback(response){
		console.log(response);
	});

	$scope.grinds = [

		{option: "Very Fine"},
		{option: "Fine"},
		{option: "Medium"},
		{option: "Coarse"},
		{option: "Very Course"}

	];

	$scope.frequencies = [

		{option: "Weekly"},
		{option: "Every other week"},
		{option: "Monthly"}

	];

	$scope.optionsForm = function(planType){
		console.log('hi');		

		if (!$scope.grind){
			// make the user select a grind type before submitting the form
			return 'no grind selected.';
		}

		if(planType == 'idividual'){
			var grind = $scope.grind1;
			var quantity = 2;
			var frequency = "Weekly";
			console.log('individual');
		}else if(planType == 'family'){
			var grind = $scope.grind2;
			var quantity = 2;
			var frequency = "Weekly";
			console.log('family');
		}else if(planType == 'custom'){
			var grind = $scope.grind3;
			var quantity = $scope.quantity;
			var frequency = $scope.frequency.option;
			console.log('custom');
		};

		$http.post(apiUrl + 'options', {
			grind: grind,
			quantity: quantity,
			frequency: frequency,
			token: $cookies.get('token'),
			plan: planType
		}).then(function successCallback(response){
			console.log(response.data);
			if(response.data.success == 'updated'){
				$cookies.put('grind', $scope.grind.option);
				$cookies.put('quantity', $scope.quantity);
				$cookies.put('plan', $scope.planType);
				$cookies.put('frequency', $scope.frequency.option);
				$location.path('/delivery');
			}else if(response.data.failure == 'noMatch'){
				$location.path('/login');
			}
		}, function errorCallback(response){
			console.log("ERROR");
		});
	}
});