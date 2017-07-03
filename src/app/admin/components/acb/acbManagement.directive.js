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
    function AcbManagementController ($log, $uibModal, authService, commonService) {
        var vm = this;

        vm.doWork = doWork;
        vm.activateAcb = activateAcb;
        vm.loadData = loadData;
        vm.createAcb = createAcb;
        vm.editAcb = editAcb;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.isChplAdmin = authService.isChplAdmin();
            vm.isAcbAdmin = authService.isAcbAdmin();
            vm.acbs = [];
            vm.workType = 'acb';
        }

        function doWork (workType) {
            if (workType === 'newAcb') {
                vm.activeAcb = null;
            }
            vm.workType = workType;
        }

        function activateAcb (acb) {
            vm.workType = 'acb';
            vm.activeAcb = acb;
        }

        function loadData () {
            return commonService.getAcbs()
                .then(function (data) {
                    vm.acbs = data.acbs;
                });
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
            vm.modalInstance.result.then(function () {
                vm.activate();
            }, function (result) {
                if (result !== 'cancelled') {
                    $log.debug(result);
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
                    vm.activate();
                }
            }, function (result) {
                if (result !== 'cancelled') {
                    $log.debug(result);
                }
            });
        }

        vm.cancelACB = function () {
            vm.loadData();
        };

        vm.deleteACB = function (acb) {
            commonService.deleteACB(acb.id)
                .then(function () {
                    vm.activate();
                });
        };

        vm.addressRequired = function (acb) {
            if (acb) {
                return commonService.addressRequired(acb.address);
            }
        };
    }
})();
