angular.module('components', [])
	.directive('productRow', function() {
		return {
			restrict:'E',
			templateUrl:'/AngularJS Test/views/product-row.html'
		};
	})
	.directive('productTabs', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      controller: function($scope) {
        var panes = $scope.panes = [];

 
        $scope.select = function(pane) {
          angular.forEach(panes, function(pane) {
            pane.selected = false;
          });
          pane.selected = true;
        };
 
        this.addPane = function(pane) {
          if (panes.length === 0) {
            $scope.select(pane);
          }
          panes.push(pane);
        };
      },
      templateUrl: '/AngularJS Test/views/product-tabs.html'
    };
  })
  .directive('productPane', function() {
    return {
      require: '^productTabs',
      restrict: 'E',
      transclude: false,
      scope: {
        title: '@'
      },
      controller:CartController,
      link: function(scope, element, attrs, tabsCtrl) {
        tabsCtrl.addPane(scope);
      },
      templateUrl: '/AngularJS Test/views/product-pane.html'
    };
  });

function CartController($scope,mySharedService){
	$scope.products=[];
	$scope.pdtUsage='file';
	
	$scope.$on('handleBroadcast', function() {
		$scope.products.push(mySharedService.product);
		console.log('product'+$scope);
		console.log('broadcast message :  '+ mySharedService.product.name);
	});

	$scope.delete=function(product){
		$scope.products.splice($scope.products.indexOf(product),1);
		console.log("removed");
	};

	$scope.edit=function(product){
		console.log("edit");
		$scope.product=product;
	};
}

