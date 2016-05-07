var coffeeApp = angular.module('coffeeApp', ['ngRoute', 'ngCookies']);
var apiUrl = 'http://localhost:3000/'

coffeeApp.config(function($routeProvider) {
	$routeProvider.when('/', {
		controller: 'coffeeController',
		templateUrl: function($routeParams) {
			console.log('routing to home');
			return 'pages/homeView.html';
		}
	});

	$routeProvider.when('/register', {
		controller: 'coffeeController',
		templateUrl: function($routeParams) {
			console.log('routing to registration');
			return 'pages/registrationView.html';
		}
	});

	$routeProvider.when('/login', {
		controller: 'coffeeController',
		templateUrl: function($routeParams) {
			console.log('routing to login');
			return 'pages/loginView.html';
		}

	});

	$routeProvider.when('/options', {
		controller: 'optionsController',
		templateUrl: function($routeParams) {
			console.log('routing to options');
			return 'pages/optionsView.html';
		}

	});

	$routeProvider.when('/delivery', {
		controller: 'coffeeController',
		templateUrl: function($routeParams) {
			console.log('routing to delivery');
			return 'pages/deliveryView.html';
		}

	});

	$routeProvider.when('/payments', {
		controller: 'paymentsController',
		templateUrl: function($routeParams) {
			console.log('routing to payments');
			return 'pages/paymentsView2.html';
		}

	});
});


coffeeApp.controller('coffeeController', function($scope, $http, $route, $location, $cookies){
	$scope.message = "HELLO!!!!"

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

	$scope.registerForm = function(form){
		console.log($scope.username);
		$http.post(apiUrl + 'register', {
			username: $scope.username,
			password: $scope.password,
			password2: $scope.password2,
			email: $scope.email
		}).then(function successCallback(response){
			//console.log(response.data.failure);
			if(response.data.failure == 'passwordMatch'){
				$scope.errorMessage = 'Your passwords must match.';
			}else if(response.data.success == 'added'){
				$cookies.put('token', response.data.token);
				$cookies.put('username', $scope.username);
				$location.path('/options');
			}
		}, function errorCallback(response){

		});

	}

	$scope.loginForm = function(form){
		$http.post(apiUrl + 'login', {
			username: $scope.username,
			password: $scope.password
		}).then(function successCallback(response){
			//console.log(response.data);
			if(response.data.success == 'found'){
				$cookies.put('token', response.data.token);
				$cookies.put('username', $scope.username);
				$location.path('/options');
			}else if(response.data.failure == 'noUser'){
				$scope.errorMessage = 'No such user in the database.';
			}else if(response.data.failure == 'badPassword'){
				$scope.errorMessage = 'Bad password for this user.';
			}
		}, function errorCallback(response){

		});
	}

	// $scope.optionsForm = function(planType){
	// 	console.log($scope.grind);

	// 	if (!$scope.grind){
	// 		// make the user select a grind type before submitting the form
	// 		return 'no grind selected.';
	// 	}

	// 	if (planType == 'idividual'){
	// 		$scope.quantity = 0.50;
	// 		$scope.frequency = { option: "Monthly" }
	// 		$scope.unitCost = 20.00;
	// 	} else if (planType == 'family'){
	// 		$scope.quantity = 1.00;
	// 		$scope.frequency = { option: "Every other week" }
	// 		$scope.unitCost = 17.00;
	// 	} else {
	// 		$scope.unitCost = 20.00;
	// 	}

	// 		$http.post(apiUrl + 'options', {
	// 			grind: $scope.grind,
	// 			quantity: $scope.quantity,
	// 			token: $cookies.get('token'),
	// 			plan: planType
	// 		}).then(function successCallback(response){
	// 			console.log(response.data);
	// 			if(response.data.success == 'updated'){
	// 				$cookies.put('grind', $scope.grind1);
	// 				$cookies.put('quantity', $scope.quantity);
	// 				$cookies.put('planType', $scope.planType);
	// 				$cookies.put('frequency', $scope.frequency);
	// 				$cookies.put('unitCost', $scope.unitCost);
	// 				$location.path('/delivery');
	// 			}else if(response.data.failure == 'noMatch'){
	// 				$location.path('/login');
	// 			}
	// 		}, function errorCallback(response){
	// 			console.log("ERROR");
	// 		});
	// }

	$scope.deliveryForm = function(form){
		console.log('delivery');
		$http.post(apiUrl + 'delivery', {
			token: $cookies.get('token'),
			fullName: $scope.fullName,
			address1: $scope.address1,
			address2: $scope.address2,
			city: $scope.city,
			state: $scope.state,
			zipCode: $scope.zipCode,
			deliveryDate: $scope.deliveryDate
		}).then(function successCallback(response){
			console.log(response.data);
			if(response.data.success == 'updated') {
				$cookies.put('fullName', $scope.fullName);
				$cookies.put('address1', $scope.address1);
				$cookies.put('address2', $scope.address2);
				$cookies.put('city', $scope.city);
				$cookies.put('state', $scope.state);
				$cookies.put('zipCode', $scope.zipCode);
				$cookies.put('deliveryDate', $scope.deliveryDate)
				$location.path('/payments');
			}else if(response.data.failure == 'noMatch'){
				console.log('error');
			}
		}, function errorCallback(response){
			console.log('ERROR');
		});
	}



// Test Secret Key: sk_test_f8WmD3UEdPs75vFvC5CJBzaQ Roll Key
// Test Publishable Key: pk_test_rWLa6iTLc7PEWPlIsrkXjHyN 
});

coffeeApp.controller('paymentsController', function($scope, $http, $location, $cookies){
	
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
			}
			}, function errorCallback(response){
			console.log("ERROR");
			}
		);
	});