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
    function AtlManagementController ($log, $uibModal, authService, commonService) {
        var vm = this;

        vm.doWork = doWork;
        vm.activate = activate;
        vm.activateAtl = activateAtl;
        vm.loadData = loadData;
        vm.createAtl = createAtl;
        vm.editAtl = editAtl;

        vm.activate();

        ////////////////////////////////////////////////////////////////////

        function doWork (workType) {
            if (workType === 'newAtl') {
                vm.activeAtl = null;
            }
            vm.workType = workType;
        }

        function activate () {
            vm.isChplAdmin = authService.isChplAdmin();
            vm.isAtlAdmin = authService.isAtlAdmin();
            vm.atls = [];
            vm.workType = 'atl';
        }

        function activateAtl (atl) {
            vm.workType = 'atl';
            vm.activeAtl = atl;
        }

        function loadData () {
            return commonService.getAtls()
                .then(function (data) {
                    vm.atls = data.atls;
                });
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
            vm.modalInstance.result.then(function () {
                vm.activate();
            }, function (result) {
                if (result !== 'cancelled') {
                    $log.debug(result);
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
                    vm.activate();
                }
            }, function (result) {
                if (result !== 'cancelled') {
                    $log.debug(result);
                }
            });
        }

        vm.cancelATL = function () {
            vm.loadData();
        };

        vm.deleteATL = function (atl) {
            commonService.deleteATL(atl.id)
                .then(function () {
                    vm.activate();
                });
        };

        vm.addressRequired = function (atl) {
            if (atl) {
                return commonService.addressRequired(atl.address);
            }
        };
    }
})();
