(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('EditAtlController', EditAtlController);

    /** @ngInject */
    function EditAtlController ($uibModalInstance, atl, action, isChplAdmin, commonService) {
        var vm = this;
        vm.atl = angular.copy(atl);
        vm.action = action;
        vm.isChplAdmin = isChplAdmin;

        vm.save = save;
        vm.cancel = cancel;
        vm.create = create;
        vm.deleteAtl = deleteAtl;
        vm.undeleteAtl = undeleteAtl;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            if (vm.action === 'create') {
                vm.atl.address = {};
            }
        }

        function save () {
            commonService.modifyATL(vm.atl)
                .then(function (response) {
                    if (!response.status || response.status === 200) {
                        $uibModalInstance.close(response);
                    } else {
                        $uibModalInstance.dismiss('An error occurred');
                    }
                },function (error) {
                    $uibModalInstance.dismiss(error.data.error);
                });
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }

        function create () {
            commonService.createATL(vm.atl)
                .then(function (response) {
                    if (!response.status || response.status === 200) {
                        $uibModalInstance.close(response);
                    } else {
                        $uibModalInstance.dismiss('An error occurred');
                    }
                },function (error) {
                    $uibModalInstance.dismiss(error.data.error);
                });
        }

        function deleteAtl () {
            commonService.deleteATL(vm.atl.id)
                .then(function (response) {
                    if (!response.status || response.status === 200) {
                        $uibModalInstance.close('deleted');
                    } else {
                        $uibModalInstance.dismiss('An error occurred');
                    }
                },function (error) {
                    $uibModalInstance.dismiss(error.data.error);
                });
        }

        function undeleteAtl () {
            commonService.undeleteATL(vm.atl.id)
                .then(function (response) {
                    if (!response.status || response.status === 200) {
                        $uibModalInstance.close(response);
                    } else {
                        $uibModalInstance.dismiss('An error occurred');
                    }
                },function (error) {
                    $uibModalInstance.dismiss(error.data.error);
                });
        }
    }
})();
