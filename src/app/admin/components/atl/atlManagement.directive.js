(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('AtlManagementController', AtlManagementController)
        .directive('aiAtlManagement', aiAtlManagement);

    /** @ngInject */
    function aiAtlManagement () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/admin/components/atl/atlManagement.html',
            bindToController: {
                workType: '=?',
                activeAtl: '=?',
            },
            scope: {},
            controllerAs: 'vm',
            controller: 'AtlManagementController',
        };
    }

    /** @ngInject */
    function AtlManagementController ($log, $uibModal, authService, utilService) {
        var vm = this;

        vm.createAtl = createAtl;
        vm.editAtl = editAtl;
        vm.checkHttp = utilService.checkHttp;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.isChplAdmin = authService.isChplAdmin();
            vm.isAtlAdmin = authService.isAtlAdmin();
            if (angular.isUndefined(vm.workType)) {
                vm.workType = 'atl';
            }
        }

        function createAtl () {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/admin/components/atl/atlEdit.html',
                controller: 'EditAtlController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    atl: function () { return {}; },
                    action: function () { return 'create'; },
                    isChplAdmin: function () { return vm.isChplAdmin; },
                },
            });
            vm.modalInstance.result.then(function (result) {
                vm.activeAtl = result;
            }, function (result) {
                if (result !== 'cancelled') {
                    $log.info(result);
                }
            });
        }

        function editAtl (atl) {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/admin/components/atl/atlEdit.html',
                controller: 'EditAtlController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    atl: function () { return atl; },
                    action: function () { return 'edit'; },
                    isChplAdmin: function () { return vm.isChplAdmin; },
                },
            });
            vm.modalInstance.result.then(function (result) {
                if (result !== 'deleted') {
                    vm.activeAtl = result;
                } else {
                    vm.activeAtl = null;
                }
            }, function (result) {
                if (result !== 'cancelled') {
                    $log.info(result);
                }
            });
        }
    }
})();
