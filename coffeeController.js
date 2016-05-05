var coffeeApp = angular.module('coffeeApp', ['ngRoute']);
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
});


coffeeApp.controller('coffeeController', function($scope, $http, $route, $location){
	$scope.message = "HELLO!!!!"

	$scope.registerForm = function(form){
		console.log($scope.username);
		$http.post(apiUrl + 'register', {
			username: $scope.username,
			password: $scope.password,
			password2: $scope.password2,
			email: $scope.email
		}).then(function successCallback(response){
			console.log(response.data.failure);
			if(response.data.failure == 'passwordMatch'){
				$scope.errorMessage = 'Your passwords must match.';
			}else if(response.data.success == 'added'){
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
			console.log(response.data);
			if(response.data.success == 'found'){
				$location.path('/options');
			}else if(response.data.failure == 'noUser'){
				$scope.errorMessage = 'No such user in the database.';
			}else if(response.data.failure == 'badPassword'){
				$scope.errorMessage = 'Bad password for this user.';
			}
		}, function errorCallback(response){

		});
	}

});