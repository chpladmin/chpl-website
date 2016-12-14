(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('EditAcbController', EditAcbController);

    /** @ngInject */
    function EditAcbController ($uibModalInstance, acb, action, isChplAdmin, commonService) {
        var vm = this;
        vm.acb = angular.copy(acb);
        vm.action = action;
        vm.isChplAdmin = isChplAdmin;

        vm.save = save;
        vm.cancel = cancel;
        vm.create = create;
        vm.deleteAcb = deleteAcb;
        vm.undeleteAcb = undeleteAcb;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            if (vm.action === 'create') {
                vm.acb.address = {};
            }
        }

        function save () {
            commonService.modifyACB(vm.acb)
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
            commonService.createACB(vm.acb)
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
            commonService.deleteACB(vm.acb.id)
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

        function undeleteAcb () {
            commonService.undeleteACB(vm.acb.id)
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
