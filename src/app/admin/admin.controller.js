(function () {
  'use strict';

  angular.module('chpl.admin')
    .controller('AdminController', AdminController);

  /** @ngInclude */
  function AdminController ($filter, $log, $state, $stateParams, authService, featureFlags) {
    var vm = this;

    vm.isOn = featureFlags.isOn;
    vm.getFullname = authService.getFullname;
    vm.hasAnyRole = authService.hasAnyRole;

    activate();

    ////////////////////////////////////////////////////////////////////

    function activate () {
      if ($stateParams.productId) {
        if (vm.isOn('listing-edit')) {
          $state.go('listing', {id: $stateParams.productId});
        }
        vm.productId = $stateParams.productId;
      }
    }
  }
})();
