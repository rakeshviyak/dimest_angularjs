// instatiate the FirebaseSimpleLogin and monitor the user's auth state
var currentUser;
// var chatRef = new Firebase('https://blinding-fire-2115.firebaseio.com/');
// var auth = new FirebaseSimpleLogin(chatRef, function(error, user) {
//   if (error) {
//     // an error occurred while attempting login
//     console.log(error);
//   } else if (user) {
//     // user authenticated with Firebase
//     // console.log(user);
//     console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
//     currentUser=user.id;
//   } else {
//     // user is logged out
//   }
// });

// attempt to log the user in with your preferred authentication provider
// auth.login('anonymous');

/**
*  Module
*
* Description
*/
var app=angular.module('dimestApp', ['ngRoute','firebase','components']);

app.value('fbURL', 'https://blinding-fire-2115.firebaseio.com/');


app.factory('Products', function($firebase, fbURL) {
  return function(productIdUrl){
    finalURL=fbURL+productIdUrl;
    console.log(finalURL);
    return $firebase(new Firebase(finalURL));
  };
});

app.factory('ProductCart',function(Products){
  return function(product,productId,cartFlag,cartValue){
    product = Products(productId);
    console.log(product);
    var userString=currentUser+",";
    if(cartFlag===true){
      product.cart=cartValue+userString;
    }else{
      product.cart=cartValue.split(userString).join("");
    }
    product.$save('cart');
    console.log(product);
  };
});

app.factory('ProductTypes',function(){
  var producttypes=[
    {name:'Music/mp3', class:'music-mp3', title:'Music'},
    {name:'Video/flv', class:'video-flv', title:'Video'},
    {name:'Ebook/pdf', class:'ebook-pdf', title:'Ebook'},
    {name:'Image/PNG', class:'image-png', title:'Other'},
  ];
  return producttypes;
});


app.controller('ProductController',function($scope,$rootScope,$location,Products,ProductCart,ProductTypes){
  $scope.products=Products('');
  $scope.pdtUsage='product';
  $scope.userid=currentUser;
  console.log($scope);
  $scope.filterProducts= function(){
    if ($scope.searchAllProduct) return;
    return $scope.searchText;
  };

  $scope.add=function(product,productId){
    ProductCart($scope.product,productId,true,product.cart);
  };
  
  $scope.delete=function(product,productId){
    ProductCart($scope.product,productId,false,product.cart);
  };
  $rootScope.$on("login", function(event, user) {
    console.log("UserId:"+user.id);
    $scope.userid = user.id;
    // alert("The user is logged in"+$scope.userid);
    // $location.path('/new');
  });


});

app.controller('CreateController', function($scope, $location, Products,ProductTypes) {
  $scope.producttypes=ProductTypes;
  
  $scope.save = function() {
    console.log($scope);
    $scope.product.user=currentUser;
    $scope.product.cart="1";
    $scope.product=Products('').$add($scope.product);
    $location.path('/');
  };
});

app.controller('EditController', function($scope, $location, $routeParams,Products,ProductTypes) {
    $scope.product = Products($routeParams.productId);
    $scope.producttypes=ProductTypes;
  
    $scope.destroy = function() {
      $scope.product.$remove();
      $location.path('/');
    };
 
    $scope.save = function() {
      $scope.product.$save();
      $location.path('/');
    };
});

app.controller('myCtrl', ["$scope", "$rootScope", "myAuthService", function($scope, $rootScope, myAuthService) {
    $scope.signin = function() {
        console.log("Signing In..");
        myAuthService.auth.login('anonymous');

    };
    // listen for user auth events
    $rootScope.$on("login", function(event, user) {
        // do login things
        console.log('userid:'+user.id);
        $scope.userid = user.id;
        currentUser=user.id;
    });
    $rootScope.$on("loginError", function(event, error) {
        // tell the user about the error
    });
    $rootScope.$on("logout", function(event) {
        // do logout things
    });
}]);

app.service('myAuthService', ["$rootScope","$route", function($rootScope,$route) {
    // console.log(fbURL);
    var ref = new Firebase('https://blinding-fire-2115.firebaseio.com/');
    this.auth = new FirebaseSimpleLogin(ref, function(error, user) {
        if (user) {
            console.log("Loginin In....");
            $rootScope.$emit("login", user);
            $route.reload();
        }
        else if (error) {
            $rootScope.$emit("loginError", error);
        }
        else {
            $rootScope.$emit("logout");
        }
    });
}]);

app.config(function($routeProvider){
  $routeProvider
    .when('/', {templateUrl: '/AngularJS Test/views/products.html', controller: 'ProductController'})
    .when('/new', {templateUrl: '/AngularJS Test/views/upload.html', controller: 'CreateController' })
    .when('/edit/:productId', {templateUrl: '/AngularJS Test/views/upload.html', controller: 'EditController' })
    .otherwise({ redirectTo:'/'});
});