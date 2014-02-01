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
        this.$scope=$scope;
 
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
          console.log(panes);
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
      scope:true,
      link: function(scope, element, attrs, tabsCtrl) {
        console.log(scope);
        scope.title=element.attr('title');
        scope.pdtUsage='file';
        tabsCtrl.addPane(scope);
      },
      templateUrl: '/AngularJS Test/views/product-pane.html'
    };
  });