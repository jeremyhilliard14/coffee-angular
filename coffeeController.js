var coffeeApp = angular.module('coffeeApp', ['ngRoute', 'ngCookies']);
var apiUrl = 'http://www.jeremyhilliard.com:3000/'

coffeeApp.config(function($routeProvider) {
	$routeProvider.when('projects/coffee/index.html#/', {
		controller: 'coffeeController',
		templateUrl: function($routeParams) {
			console.log('routing to home');
			return 'pages/homeView.html';
		}
	});

	$routeProvider.when('projects/coffee/index.html#/register', {
		controller: 'coffeeController',
		templateUrl: function($routeParams) {
			console.log('routing to registration');
			return 'pages/registrationView.html';
		}
	});

	$routeProvider.when('projects/coffee/index.html#/login', {
		controller: 'coffeeController',
		templateUrl: function($routeParams) {
			console.log('routing to login');
			return 'pages/loginView.html';
		}

	});

	$routeProvider.when('projects/coffee/index.html#/options', {
		controller: 'optionsController',
		templateUrl: function($routeParams) {
			console.log('routing to options');
			return 'pages/optionsView.html';
		}

	});

	$routeProvider.when('projects/coffee/index.html#/delivery', {
		controller: 'deliveryController',
		templateUrl: function($routeParams) {
			console.log('routing to delivery');
			return 'pages/deliveryView.html';
		}

	});

	$routeProvider.when('projects/coffee/index.html#/payments', {
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



// Test Secret Key: sk_test_f8WmD3UEdPs75vFvC5CJBzaQ Roll Key
// Test Publishable Key: pk_test_rWLa6iTLc7PEWPlIsrkXjHyN 
});

