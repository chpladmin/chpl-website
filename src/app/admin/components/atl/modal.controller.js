(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('ModalAtlController', ModalAtlController);

    /** @ngInject */
    function ModalAtlController ($uibModalInstance, action, atl, isChplAdmin, networkService) {
        var vm = this;

        vm.cancel = cancel;
        vm.create = create;
        vm.handleChange = handleChange;
        vm.save = save;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.atl = angular.copy(atl);
            vm.action = action;
            vm.isChplAdmin = isChplAdmin;
            if (vm.action === 'create') {
                vm.atl.address = {};
                vm.formIsValid = false;
            } else {
                vm.formIsValid = true;
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

        function handleChange (atl, valid) {
            vm.atl = atl;
            vm.formIsValid = valid;
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
    }
})();
