(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('AcbManagementController', AcbManagementController)
        .directive('aiAcbManagement', aiAcbManagement);

    /** @ngInject */
    function aiAcbManagement () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/admin/components/acb/acbManagement.html',
            bindToController: {
                workType: '=?',
                activeAcb: '=?',
            },
            scope: {},
            controllerAs: 'vm',
            controller: 'AcbManagementController',
        };
    }

    /** @ngInject */
    function AcbManagementController ($log, $uibModal, authService, utilService) {
        var vm = this;

        vm.createAcb = createAcb;
        vm.editAcb = editAcb;
        vm.checkHttp = utilService.checkHttp;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.isAcbAdmin = authService.isAcbAdmin();
            vm.isChplAdmin = authService.isChplAdmin();
            if (angular.isUndefined(vm.workType)) {
                vm.workType = 'acb';
            }
        }

        function createAcb () {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/admin/components/acb/acbEdit.html',
                controller: 'EditAcbController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    acb: function () { return {}; },
                    action: function () { return 'create'; },
                    isChplAdmin: function () { return vm.isChplAdmin; },
                },
            });
            vm.modalInstance.result.then(function (result) {
                vm.activeAcb = result;
            }, function (result) {
                if (result !== 'cancelled') {
                    $log.info(result);
                }
            });
        }

        function editAcb (acb) {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/admin/components/acb/acbEdit.html',
                controller: 'EditAcbController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    acb: function () { return acb; },
                    action: function () { return 'edit'; },
                    isChplAdmin: function () { return vm.isChplAdmin; },
                },
            });
            vm.modalInstance.result.then(function (result) {
                if (result !== 'deleted') {
                    vm.activeAcb = result;
                } else {
                    vm.activeAcb = null;
                }
            }, function (result) {
                if (result !== 'cancelled') {
                    $log.info(result);
                }
            });
        }
    }
})();
