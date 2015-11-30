;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('EditAcbController', ['$modalInstance', 'acb', 'action', 'isChplAdmin', 'commonService', function ($modalInstance, acb, action, isChplAdmin, commonService) {
            var vm = this;
            vm.acb = angular.copy(acb);
            vm.action = action;
            vm.isChplAdmin = isChplAdmin;

            vm.activate = activate;
            vm.save = save;
            vm.cancel = cancel;
            vm.deleteAcb = deleteAcb;
            vm.create = create;

            vm.activate();

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

            function deleteAcb () {
                commonService.deleteACB(vm.acb.id)
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

            function create () {
                commonService.createACB(vm.acb)
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
        }]);
})();
