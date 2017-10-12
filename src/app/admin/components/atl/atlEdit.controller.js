(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('EditAtlController', EditAtlController);

    /** @ngInject */
    function EditAtlController ($uibModalInstance, action, atl, isChplAdmin, networkService) {
        var vm = this;

        vm.cancel = cancel;
        vm.create = create;
        vm.deleteAtl = deleteAtl;
        vm.save = save;
        vm.undeleteAtl = undeleteAtl;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.atl = angular.copy(atl);
            vm.action = action;
            vm.isChplAdmin = isChplAdmin;
            if (vm.action === 'create') {
                vm.atl.address = {};
            }
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }

        function create () {
            networkService.createATL(vm.atl)
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
            networkService.deleteATL(vm.atl.id)
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

        function save () {
            networkService.modifyATL(vm.atl)
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

        function undeleteAtl () {
            networkService.undeleteATL(vm.atl.id)
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
