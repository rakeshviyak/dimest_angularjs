// instatiate the FirebaseSimpleLogin and monitor the user's auth state
var chatRef = new Firebase('https://blinding-fire-2115.firebaseio.com/');
var currentUser;
var auth = new FirebaseSimpleLogin(chatRef, function(error, user) {
  if (error) {
    // an error occurred while attempting login
    console.log(error);
  } else if (user) {
    // user authenticated with Firebase
    // console.log(user);
    console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
    currentUser=user.id;
  } else {
    // user is logged out
  }
});

// attempt to log the user in with your preferred authentication provider
auth.login('anonymous');


/**
*  Module
*
* Description
*/
var app=angular.module('dimestApp', ['ngRoute','firebase','components']);

app.value('fbURL', 'https://blinding-fire-2115.firebaseio.com/');
	 
app.factory('Products', function($firebase, fbURL) {
  return $firebase(new Firebase(fbURL));
});

app.factory('ProductTypes',function(){
	var producttypes=[
		{name:'Music/mp3', class:'music-mp3'},
		{name:'Video/flv', class:'video-flv'},
		{name:'Ebook/pdf', class:'ebook-pdf'},
		{name:'Image/PNG', class:'image-png'},
	];
	return producttypes;
});

app.factory('mySharedService', function($rootScope) {
    var sharedService = {};
    
    sharedService.product = '';

    sharedService.prepForBroadcast = function(pdt) {
        this.product = pdt;
        this.broadcastItem();
    };

    sharedService.broadcastItem = function() {
        $rootScope.$broadcast('handleBroadcast');
    };
    return sharedService;
});


app.controller('ProductController',function($scope,Products,mySharedService){
	$scope.products=Products;
	$scope.pdtUsage='product';
	$scope.add=function(product){
		mySharedService.prepForBroadcast(product);
	};
});

app.controller('CreateController', function($scope, $location, $timeout, Products,ProductTypes) {
	$scope.producttypes=ProductTypes;
	$scope.save = function() {
		$scope.product=Products.$add($scope.product);
		$location.path('/');
	};
});

app.controller('EditController', function($scope, $location, $routeParams, $firebase, fbURL,ProductTypes,mySharedService) {
    var productUrl = fbURL + $routeParams.productId;
    $scope.product = $firebase(new Firebase(productUrl));
    console.log($scope.product);
	$scope.producttypes=ProductTypes;
	
    $scope.destroy = function() {
      $scope.product.$remove();
      $location.path('/');
    };
 
    $scope.save = function() {
      $scope.product.$save();
      // mySharedService.prepForBroadcast($scope.product);
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