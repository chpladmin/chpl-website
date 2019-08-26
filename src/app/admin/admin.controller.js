(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('AdminController', AdminController);

    /** @ngInclude */
    function AdminController ($filter, $log, $state, $stateParams, authService, featureFlags, networkService) {
        var vm = this;

        vm.getFullname = authService.getFullname;
        vm.handleAcb = handleAcb;
        vm.handleAtl = handleAtl;
        vm.hasAnyRole = authService.hasAnyRole;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            if (authService.hasAnyRole(['ROLE_ATL'])) {
                vm.navState = 'atlManagement';
            } else {
                vm.navState = $stateParams.section || 'manage';
            }

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
            } else {
                if (featureFlags.isOn('organizations')) {
                    $state.go('organizations.developers');
                }
            }

            // load editable acbs & atls
            networkService.getAcbs(true)
                .then(function (data) {
                    vm.acbs = $filter('orderBy')(data.acbs,'name');
                    vm.acb = vm.acbs[0];
                });
            networkService.getAtls(true)
                .then(function (data) {
                    vm.atls = $filter('orderBy')(data.atls,'name');
                    vm.atl = vm.atls[0];
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
