(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('AdminController', AdminController);

    /** @ngInclude */
    function AdminController ($log, $stateParams, authService) {
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
                vm.productId = $stateParams.productId;
            }
        }
    }
})();
