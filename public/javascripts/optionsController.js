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
		if (!$scope.grind){
			// make the user select a grind type before submitting the form
			return 'no grind selected.';
		}

		if (planType == 'idividual'){
			$scope.quantity = 0.50;
			$scope.frequency = { option: "Monthly" }
			$scope.unitCost = 20.00;
		} else if (planType == 'family'){
			$scope.quantity = 1.00;
			$scope.frequency = { option: "Every other week" }
			$scope.unitCost = 17.00;
		} else {
			$scope.unitCost = 20.00;
		}

		$http.post(apiUrl + 'options', {
			grind: $scope.grind,
			quantity: $scope.quantity,
			token: $cookies.get('token'),
			plan: planType
		}).then(function successCallback(response){
			console.log(response.data);
			if(response.data.success == 'updated'){
				$cookies.put('grind', $scope.grind.option);
				$cookies.put('quantity', $scope.quantity);
				$cookies.put('planType', $scope.planType);
				$cookies.put('frequency', $scope.frequency.option);
				$cookies.put('unitCost', $scope.unitCost);
				$location.path('/delivery');
			}else if(response.data.failure == 'noMatch'){
				$location.path('/login');
			}
		}, function errorCallback(response){
			console.log("ERROR");
		});
	}
});