(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('EditAdditionalSoftwareController', EditAdditionalSoftwareController);

    /** @ngInject */
    function EditAdditionalSoftwareController ($uibModalInstance, software) {
        var vm = this;
        vm.sw = angular.copy(software);

        vm.save = save;
        vm.cancel = cancel;

        ////////////////////////////////////////////////////////////////////

        function save () {
            $uibModalInstance.close(vm.sw);
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }
    }
})();
