(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('EditAtlController', EditAtlController);

    /** @ngInject */
    function EditAtlController ($modalInstance, atl, action, isChplAdmin, commonService) {
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
                        $modalInstance.close(response);
                    } else {
                        $modalInstance.dismiss('An error occurred');
                    }
                },function (error) {
                    $modalInstance.dismiss(error.data.error);
                });
        }

        function cancel () {
            $modalInstance.dismiss('cancelled');
        }

        function create () {
            commonService.createATL(vm.atl)
                .then(function (response) {
                    if (!response.status || response.status === 200) {
                        $modalInstance.close(response);
                    } else {
                        $modalInstance.dismiss('An error occurred');
                    }
                },function (error) {
                    $modalInstance.dismiss(error.data.error);
                });
        }

        function deleteAtl () {
            commonService.deleteATL(vm.atl.id)
                .then(function (response) {
                    if (!response.status || response.status === 200) {
                        $modalInstance.close('deleted');
                    } else {
                        $modalInstance.dismiss('An error occurred');
                    }
                },function (error) {
                    $modalInstance.dismiss(error.data.error);
                });
        }

        function undeleteAtl () {
            commonService.undeleteATL(vm.atl.id)
                .then(function (response) {
                    if (!response.status || response.status === 200) {
                        $modalInstance.close(response);
                    } else {
                        $modalInstance.dismiss('An error occurred');
                    }
                },function (error) {
                    $modalInstance.dismiss(error.data.error);
                });
        }
    }
})();
