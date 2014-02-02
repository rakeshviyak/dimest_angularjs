
//Main Controller to handle the root. Used to query and display the products,add/remove the products in the store.  
app.controller('ProductController',function($scope,$rootScope,$location,Products,ProductCart,ProductTypes){
  //query all products
  $scope.products=Products('');
  $scope.pdtUsage='product';
  $scope.userid=currentUser;
  $scope.producttypes=ProductTypes;

  //To not search all products regarless of user id if 'Only show my own products' checkbox is enabled
  $scope.filterProducts= function(){
    if ($scope.searchAllProduct) return;
    return $scope.searchText;
  };

  $scope.currentPage = 0;
  $scope.pageSize = 10;

  $scope.numberOfPages=function(){
      return Math.ceil((Object.keys($scope.products).length-11)/$scope.pageSize);
  };

  // add products to the store
  $scope.add=function(product,productId){
    ProductCart($scope.product,productId,true,product.cart);
  };
  
  //remove product from the store
  $scope.delete=function(product,productId){
    ProductCart($scope.product,productId,false,product.cart);
  };

  //listening to the broadcast cast event 'login'. Login is callback function return value if the login is succesfull
  $rootScope.$on("login", function(event, user) {
    $scope.userid = user.id;
  });


});

//to upload to new products
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

//to edit or delete the products create
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


//to perform aauthentification.Uses firebase simpleauthenfication API. 
//Uses the login credentials to personalize the my products and store
app.controller('myCtrl', ["$scope", "$rootScope", "myAuthService", function($scope, $rootScope, myAuthService) {
    $scope.signin = function() {
        console.log("Signing In..");
        // attempt to log the user in with anonymous login. no user name or email needed
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