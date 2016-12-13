(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('NonconformityInspectController', NonconformityInspectController);

    /** @ngInject */
    function NonconformityInspectController ($uibModalInstance, $uibModal, nonconformities) {
        var vm = this;

        vm.cancel = cancel;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.nonconformities = angular.copy(nonconformities);
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }
    }
})();
