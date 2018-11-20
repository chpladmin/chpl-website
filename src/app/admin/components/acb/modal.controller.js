(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('ModalAcbController', ModalAcbController);

    /** @ngInject */
    function ModalAcbController ($log, $uibModalInstance, acb, action, isChplAdmin, networkService) {
        var vm = this;

        vm.cancel = cancel;
        vm.create = create;
        vm.handleChange = handleChange;
        vm.save = save;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.acb = angular.copy(acb);
            vm.action = action;
            vm.isChplAdmin = isChplAdmin;
            if (vm.action === 'create') {
                vm.acb.address = {};
                vm.formIsValid = false;
            } else {
                vm.formIsValid = true;
            }
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }

        function create () {
            networkService.createACB(vm.acb)
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

        function handleChange (acb, valid) {
            vm.acb = acb;
            vm.formIsValid = valid;
        }

        function save () {
            networkService.modifyACB(vm.acb)
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
