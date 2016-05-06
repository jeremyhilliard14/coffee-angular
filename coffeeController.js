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
		controller: 'coffeeController',
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
		controller: 'coffeeController',
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

	$scope.optionsForm = function(planType){
		console.log($scope.grind1);
		$http.post(apiUrl + 'options', {
			grind: $scope.grind1,
			quantity: $scope.quantity,
			token: $cookies.get('token'),
			plan: planType
		}).then(function successCallback(response){
			console.log(response.data);
			if(response.data.success == 'updated'){
				$location.path('/delivery');
			}else if(response.data.failure == 'noMatch'){
				$location.path('/login');
			}
		}, function errorCallback(response){
			console.log("ERROR");
		});
	}

	// $scope.deliveryForm = function(form){
	// 	$http.post(apiUrl + 'delivery', {
	// 		fullName: $scope.fullName,
	// 		address1: $scope.address1,
	// 		address2: $scope.address2,
	// 		city: $scope.city,
	// 		state: $scope.selectedState,
	// 		zipCode: $scope.zipCode,
	// 		date: $scope.date
	// 	}).then(function successCallback(response){
	// 		console.log(response.data);

	// 	})
	// }

});