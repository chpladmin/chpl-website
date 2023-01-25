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
  function CompareWidgetController ($analytics, $localStorage, $rootScope, $scope) {
    var vm = this;

    vm.isInList = isInList;
    vm.toggleProduct = toggleProduct;

    ////////////////////////////////////////////////////////////////////

    this.$onInit = function () {
      getWidget();
      var compareAll = $scope.$on('compare.compareAll', (evt, payload) => { // compares all in the CMS ID generator widget
        clearProducts();
        payload.forEach((item) => { vm.toggleProduct(item.id, item.name, item.chplProductNumber, true); });
      });
      $scope.$on('$destroy', compareAll);
      var removeAll = $scope.$on('compare.removeAll', (evt, payload) => {
        clearProducts();
      });
      $scope.$on('$destroy', removeAll);
      var addListing = $scope.$on('compare.addListing', (evt, listing) => {
        vm.toggleProduct(listing.id, listing.product, listing.chplProductNumber);
      });
      $scope.$on('$destroy', addListing);
      var removeListing = $scope.$on('compare.removeListing', (evt, listing) => {
        vm.toggleProduct(listing.id, listing.product, listing.chplProductNumber);
      });
      $scope.$on('$destroy', removeListing);
    };

    function isInList (id) {
      for (var i = 0; i < vm.compareWidget.products.length; i++) {
        if (parseInt(vm.compareWidget.products[i].id, 10) === parseInt(id, 10)) {
          return true;
        }
      }
      return false;
    }

    function toggleProduct (id, name, number, doNotTrack) {
      if (vm.isInList(parseInt(id, 10))) {
        removeProduct(parseInt(id, 10), number, doNotTrack);
      } else {
        addProduct(parseInt(id, 10), name, number, doNotTrack);
      }
      saveWidget();
    }

    ////////////////////////////////////////////////////////////////////

    function addProduct (id, name, number, doNotTrack) {
      if (!isInList(id)) {
        if (!doNotTrack) {
          $analytics.eventTrack('Add Listing', { category: 'Compare Widget', label: number });
        }
        vm.compareWidget.products.push({id, name, chplProductNumber: number});
        $rootScope.$broadcast('compare.addedListing', {id, name, chplProductNumber: number});
      }
    }

    function clearProducts () {
      vm.compareWidget?.products.forEach((listing) => {
        $rootScope.$broadcast('compare.removedListing', listing);
      });
      vm.compareWidget = {
        products: [],
      };
      saveWidget();
    }

    function getWidget () {
      if ($localStorage.compareWidget) {
        vm.compareWidget = $localStorage.compareWidget;
      } else {
        clearProducts();
      }
    }

    function removeProduct (id, number, doNotTrack) {
      if (number && !doNotTrack) {
        $analytics.eventTrack('Remove Listing', { category: 'Compare Widget', label: number });
      }
      for (var i = 0; i < vm.compareWidget.products.length; i++) {
        if (vm.compareWidget.products[i].id === id || parseInt(vm.compareWidget.products[i].id, 10) === parseInt(id, 10)) {
          vm.compareWidget.products.splice(i,1);
        }
      }
      $rootScope.$broadcast('compare.removedListing', {id});
    }

    function saveWidget () {
      $localStorage.compareWidget = vm.compareWidget;
    }
  }
})();
