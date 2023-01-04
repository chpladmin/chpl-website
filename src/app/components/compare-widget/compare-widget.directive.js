(function () {
  'use strict';

  angular.module('chpl.components')
    .directive('aiCompareWidget', aiCompareWidget)
    .controller('CompareWidgetController', CompareWidgetController);

  /** @ngInject */
  function aiCompareWidget () {
    return {
      bindToController: {
        compareWidget: '=?',
      },
      controller: 'CompareWidgetController',
      controllerAs: 'vm',
      scope: {},
    };
  }
  /** @ngInject */
  function CompareWidgetController ($analytics, $localStorage, $log, $rootScope, $scope) {
    var vm = this;

    vm.clearProducts = clearProducts;
    vm.isInList = isInList;
    vm.queryUrl = queryUrl;
    vm.saveProducts = saveProducts;
    vm.toggleProduct = toggleProduct;

    ////////////////////////////////////////////////////////////////////

    this.$onInit = function () {
      getWidget();
      var compareAll = $scope.$on('compareAll', (evt, payload) => {
        vm.clearProducts();
        payload.forEach((item) => { vm.toggleProduct(item.productId, item.name, item.chplProductNumber, true); });
      });
      $scope.$on('$destroy', compareAll);
      var addListing = $scope.$on('addListing', (evt, listing) => {
        addProduct(listing.id, listing.product, listing.chplProductNumber);
      });
      $scope.$on('$destroy', addListing);
      var removeListing = $scope.$on('removeListing', (evt, listing) => {
        removeProduct(listing.id, listing.chplProductNumber);
      });
      $scope.$on('$destroy', removeListing);
    };

    function clearProducts () {
      $analytics.eventTrack('Remove all Listings', { category: 'Compare Widget' });
      vm.compareWidget = {
        products: [],
        productIds: [],
      };
      saveWidget();
    }

    function isInList (id) {
      for (var i = 0; i < vm.compareWidget.products.length; i++) {
        if (vm.compareWidget.products[i].id === id) {
          return true;
        }
      }
      return false;
    }

    function queryUrl () {
      return vm.compareWidget.productIds.join('&');
    }

    function saveProducts () {
      $analytics.eventTrack('Compare Listings', { category: 'Compare Widget' });
      var previously = $localStorage.previouslyCompared;
      if (!previously) {
        previously = [];
      }
      for (var i = 0; i < vm.compareWidget.productIds.length; i++) {
        if (previously.indexOf(vm.compareWidget.productIds[i]) === -1) {
          previously.push(vm.compareWidget.productIds[i]);
        }
      }
      while (previously.length > 20) {
        previously.shift();
      }
      $localStorage.previouslyCompared = previously;
    }

    function toggleProduct (id, name, number, doNotTrack) {
      if (vm.isInList(id)) {
        removeProduct(id, number);
      } else {
        addProduct(id, name, number, doNotTrack);
      }
      vm.compareWidget.productIds = [];
      for (var i = 0; i < vm.compareWidget.products.length; i++) {
        vm.compareWidget.productIds.push(vm.compareWidget.products[i].id);
      }
      saveWidget();
    }

    ////////////////////////////////////////////////////////////////////

    function addProduct (id, name, number, doNotTrack) {
      if (!isInList(id)) {
        if (!doNotTrack) {
          $analytics.eventTrack('Add Listing', { category: 'Compare Widget', label: number });
        }
        vm.compareWidget.products.push({id: id, name: name, chplProductNumber: number});
        $rootScope.$broadcast('addedListing', {id: parseInt(id, 10), chplProductNumber: number});
      }
    }

    function getWidget () {
      if ($localStorage.compareWidget) {
        vm.compareWidget = $localStorage.compareWidget;
      } else {
        vm.clearProducts();
      }
    }

    function removeProduct (id, number) {
      if (number) {
        $analytics.eventTrack('Remove Listing', { category: 'Compare Widget', label: number });
      }
      for (var i = 0; i < vm.compareWidget.products.length; i++) {
        if (vm.compareWidget.products[i].id === id || parseInt(vm.compareWidget.products[i].id) === parseInt(id)) {
          vm.compareWidget.products.splice(i,1);
        }
      }
      $rootScope.$broadcast('removedListing', {id: parseInt(id, 10), chplProductNumber: number});
    }

    function saveWidget () {
      $localStorage.compareWidget = vm.compareWidget;
    }
  }
})();
