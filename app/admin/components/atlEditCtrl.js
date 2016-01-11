;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('EditAtlController', ['$modalInstance', 'atl', 'action', 'isChplAdmin', 'commonService', function ($modalInstance, atl, action, isChplAdmin, commonService) {
            var vm = this;
            vm.atl = angular.copy(atl);
            vm.action = action;
            vm.isChplAdmin = isChplAdmin;

            vm.activate = activate;
            vm.save = save;
            vm.cancel = cancel;
            vm.deleteAtl = deleteAtl;
            vm.create = create;

            vm.activate();

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
        }]);
})();
