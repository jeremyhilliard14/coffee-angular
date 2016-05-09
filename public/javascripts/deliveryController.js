coffeeApp.controller('deliveryController', function($scope, $http, $route, $location, $cookies){
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
				$cookies.put('fullName', $scope.fullName, {expires: new Date() * 900000});
				$cookies.put('address1', $scope.address1, {expires: new Date() * 900000});
				$cookies.put('address2', $scope.address2, {expires: new Date() * 900000});
				$cookies.put('city', $scope.city, {expires: new Date() * 900000});
				$cookies.put('state', $scope.state, {expires: new Date() * 900000});
				$cookies.put('zipCode', $scope.zipCode, {expires: new Date() * 900000});
				$cookies.put('deliveryDate', $scope.deliveryDate, {expires: new Date() * 900000});
				$location.path('/payments');
			}else if(response.data.failure == 'noMatch'){
				console.log('error');
			}
		}, function errorCallback(response){
				console.log('ERROR');
		});
	}
});