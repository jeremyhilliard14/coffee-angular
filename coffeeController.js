var coffeeApp = angular.module('coffeeApp', ['ngRoute']);

coffeeApp.config(function($routeProvider) {
	$routeProvider.when('/', {
		controller: 'coffeeController',
		templateUrl: function($routeParams) {
			console.log('routing to home');
			return 'pages/homeView.html';
		}
	});
});


coffeeApp.controller('coffeeController', function($scope, $http, $route){
	$scope.message = "HELLO!!!!"

});