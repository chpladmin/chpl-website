(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('AdminController', AdminController);

    /** @ngInclude */
    function AdminController ($filter, $log, $stateParams, authService, networkService) {
        var vm = this;

        vm.getFullname = authService.getFullname;
        vm.handleAcb = handleAcb;
        vm.handleAtl = handleAtl;
        vm.hasAnyRole = authService.hasAnyRole;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.navState = {
                reports: 'cp-upload',
            };

            // base case
            if (vm.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'])) {
                vm.navState.screen = 'dpManagement';
            } else if (vm.hasAnyRole(['ROLE_ATL'])) {
                vm.navState.screen = 'atlManagement';
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
                vm.navState.reports = '';
                vm.productId = $stateParams.productId;
            }

            // load editable acbs & atls
            networkService.getAcbs(true)
                .then(function (data) {
                    vm.acbs = $filter('orderBy')(data.acbs,'name');
                    vm.acb = vm.acbs[0];
                    vm.navState.acbManagement = vm.acb;
                });
            networkService.getAtls(true)
                .then(function (data) {
                    vm.atls = $filter('orderBy')(data.atls,'name');
                    vm.atl = vm.atls[0];
                    vm.navState.atlManagement = vm.atl;
                });
        }

        function handleAcb (newAcb) {
            vm.acb = newAcb;
            vm.acbs = vm.acbs.map(acb => {
                if (acb.id === newAcb.id) {
                    return newAcb;
                } else {
                    return acb;
                }
            });
        }

        function handleAtl (newAtl) {
            vm.atl = newAtl;
            vm.atls = vm.atls.map(atl => {
                if (atl.id === newAtl.id) {
                    return newAtl;
                } else {
                    return atl;
                }
            });
        }
    }
})();
