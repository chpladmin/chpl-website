(function () {
    'use strict';

    angular
        .module('chpl.components')
        .controller('CertificationStatusController', CertificationStatusController);

    /** @ngInject */
    function CertificationStatusController ($log, $uibModalInstance, utilService) {
        var vm = this;

        vm.cancel = cancel;
        vm.statusFont = utilService.statusFont;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
        }

        function cancel () {
            $uibModalInstance.dismiss('certification status');
        }
    }
})();
