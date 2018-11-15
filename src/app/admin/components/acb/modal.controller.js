(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('EditAcbController', EditAcbController);

    /** @ngInject */
    function EditAcbController ($uibModalInstance, acb, action, isChplAdmin, networkService) {
        var vm = this;

        vm.cancel = cancel;
        vm.create = create;
        vm.deleteAcb = deleteAcb;
        vm.handleChange = handleChange;
        vm.save = save;
        vm.undeleteAcb = undeleteAcb;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.acb = angular.copy(acb);
            vm.action = action;
            vm.isChplAdmin = isChplAdmin;
            if (vm.action === 'create') {
                vm.acb.address = {};
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

        function deleteAcb () {
            networkService.deleteACB(vm.acb.id)
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

        function handleChange (acb, form) {
            vm.acb = angular.copy(acb);
            vm.editForm = angular.copy(form);
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

        function undeleteAcb () {
            networkService.undeleteACB(vm.acb.id)
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
