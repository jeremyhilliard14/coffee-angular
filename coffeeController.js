var coffeeApp = angular.module('coffeeApp', ['ngRoute']);

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

});


coffeeApp.controller('coffeeController', function($scope, $http, $route){
	$scope.message = "HELLO!!!!"

});