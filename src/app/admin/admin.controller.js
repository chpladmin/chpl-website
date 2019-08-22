(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('AdminController', AdminController);

    /** @ngInclude */
    function AdminController ($filter, $log, $stateParams, authService) {
        var vm = this;

        vm.getFullname = authService.getFullname;
        vm.hasAnyRole = authService.hasAnyRole;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.navState = {};
            // base case
            if (vm.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'])) {
                vm.navState.screen = 'dpManagement';
            } else if (vm.hasAnyRole(['ROLE_ATL'])) {
                vm.navState.screen = 'userManagement';
            }
            if (!vm.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) {
                vm.navState.dpManagement = 'upload';
            } else {
                vm.navState.dpManagement = 'manage';
            }

            // chosen section
            if ($stateParams.section) {
                vm.navState.screen = $stateParams.section;
            }
            if ($stateParams.subSection) {
                vm.navState[vm.navState.screen] = $stateParams.subSection;
            }
            if ($stateParams.productId) {
                vm.productId = $stateParams.productId;
            }
        }
    }
})();
