(function () {
  'use strict';

  angular.module('chpl.components')
    .directive('aiCmsWidget', aiCmsWidget)
    .controller('CmsWidgetController', CmsWidgetController);

  /** @ngInject */
  function aiCmsWidget () {
    return {
      bindToController: {
        widget: '=?',
      },
      controller: CmsWidgetController,
      controllerAs: 'vm',
      scope: {},
    };
  }

  /** @ngInject */
  function CmsWidgetController ($analytics, $localStorage, $rootScope, $scope) {
    var vm = this;

    vm.isInList = isInList;
    vm.toggleProduct = toggleProduct;

    ////////////////////////////////////////////////////////////////////

    this.$onInit = function () {
      getWidget();
      var removeAll = $scope.$on('cms.removeAll', (evt, payload) => {
        clearProducts();
      });
      $scope.$on('$destroy', removeAll);
      var addListing = $scope.$on('cms.addListing', (evt, listing) => {
        vm.toggleProduct(listing.id, listing.product, listing.chplProductNumber);
      });
      $scope.$on('$destroy', addListing);
      var removeListing = $scope.$on('cms.removeListing', (evt, listing) => {
        vm.toggleProduct(listing.id, listing.product, listing.chplProductNumber);
      });
      $scope.$on('$destroy', removeListing);
    };

    function isInList (id) {
      for (var i = 0; i < vm.cmsWidget.products.length; i++) {
        if (parseInt(vm.cmsWidget.products[i].id, 10) === parseInt(id, 10)) {
          return true;
        }
      }
      return false;
    }

    function toggleProduct (id, name, number) {
      if (vm.isInList(parseInt(id, 10))) {
        removeProduct(parseInt(id, 10), number);
      } else {
        addProduct(parseInt(id, 10), name, number);
      }
      saveWidget();
    }

    ////////////////////////////////////////////////////////////////////

    function addProduct (id, name, number) {
      if (!isInList(id)) {
        $analytics.eventTrack('Add Listing', { category: 'CMS Widget', label: number });
        vm.cmsWidget.products.push({id, name, chplProductNumber: number});
        $rootScope.$broadcast('cms.addedListing', {id, name, chplProductNumber: number});
      }
    }

    function clearProducts () {
      vm.cmsWidget?.products.forEach((listing) => {
        $rootScope.$broadcast('cms.removedListing', listing);
      });
      vm.cmsWidget = {
        products: [],
      };
      saveWidget();
    }

    function getWidget () {
      if ($localStorage.cmsWidget) {
        vm.cmsWidget = $localStorage.cmsWidget;
      } else {
        clearProducts();
      }
    }

    function removeProduct (id, number) {
      $analytics.eventTrack('Remove Listing', { category: 'CMS Widget', label: number });
      for (var i = 0; i < vm.cmsWidget.products.length; i++) {
        if (vm.cmsWidget.products[i] === id || parseInt(vm.cmsWidget.products[i], 10) === parseInt(id, 10)) {
          vm.cmsWidget.products.splice(i,1);
        }
      }
      $rootScope.$broadcast('cms.removedListing', {id});
    }

    function saveWidget () {
      $localStorage.cmsWidget = vm.cmsWidget;
    }
  }
})();
