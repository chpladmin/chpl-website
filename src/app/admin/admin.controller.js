(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('AdminController', AdminController);

    /** @ngInclude */
    function AdminController ($log, $state, $stateParams, authService, featureFlags) {
        var vm = this;

        vm.getFullname = authService.getFullname;
        vm.hasAnyRole = authService.hasAnyRole;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.navState = 'manage';

            if ($stateParams.subSection) {
                vm.navState = $stateParams.subSection;
            }
            if ($stateParams.productId) {
                if (featureFlags.isOn('listing-edit')) {
                    $state.go('listing', {id: $stateParams.productId});
                }
                vm.productId = $stateParams.productId;
            } else {
                if (featureFlags.isOn('organizations')) {
                    $state.go('organizations.developers');
                }
            }
        }
    }
})();
