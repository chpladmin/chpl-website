(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('AdminController', AdminController);

    /** @ngInclude */
    function AdminController ($filter, $log, $state, $stateParams, authService, featureFlags) {
        var vm = this;

        vm.getFullname = authService.getFullname;
        vm.hasAnyRole = authService.hasAnyRole;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.navState = $stateParams.section || 'manage';

            if ($stateParams.subSection) {
                vm.navState = $stateParams.subSection;
            } else if (vm.navState === 'dpManagement') {
                vm.navState = 'manage';
            }
            if ($stateParams.productId) {
                if (featureFlags.isOn('listing-edit')) {
                    $state.go('listing', {id: $stateParams.productId});
                }
                vm.productId = $stateParams.productId;
            }
        }
    }
})();
