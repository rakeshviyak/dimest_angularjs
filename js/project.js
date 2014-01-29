/**
*  Module
*
* Description
*/
var app=angular.module('dimestApp', ['ngRoute','firebase']);

app.value('fbURL', 'https://blinding-fire-2115.firebaseio.com/');
 
app.factory('Products', function($firebase, fbURL) {
  return $firebase(new Firebase(fbURL));
});

app.controller('ProductController',function($scope,Products){
	console.log(Products);
	$scope.products=Products;
});

app.controller('CreateController', function($scope, $location, $timeout, Products) {
  $scope.save = function() {
	console.log($scope.product);
    Products.$add($scope.product);
    $location.path('/');
  };
});

app.controller('EditController', function($scope, $location, $routeParams, $firebase, fbURL) {
    var productUrl = fbURL + $routeParams.productId;
    $scope.product = $firebase(new Firebase(productUrl));
 
    $scope.destroy = function() {
      $scope.product.$remove();
      $location.path('/');
    };
 
    $scope.save = function() {
      $scope.product.$save();
      $location.path('/');
    };
});

app.config(function($routeProvider){
	$routeProvider
		.when('/', {templateUrl: '/AngularJS Test/views/products.html', controller: 'ProductController'})
		.when('/new', {templateUrl: '/AngularJS Test/views/upload.html', controller: 'CreateController' })
		.when('/edit/:productId', {templateUrl: '/AngularJS Test/views/upload.html', controller: 'EditController' })
		.otherwise({ redirectTo:'/'});
});

