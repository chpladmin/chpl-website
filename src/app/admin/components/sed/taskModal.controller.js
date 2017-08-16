(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('EditSedTaskController', EditSedTaskController);

    /** @ngInject */
    function EditSedTaskController ($log, $uibModal, $uibModalInstance, criteria, task, utilService) {
        var vm = this;

        vm.cancel = cancel;
        vm.save = save;
        vm.sortCert = utilService.sortCert;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.criteria = criteria;
            vm.task = angular.copy(task);
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }

        function save () {
            $uibModalInstance.close({
                task: vm.task,
            });
        }
    }
})();
