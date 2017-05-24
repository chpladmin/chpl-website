(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('CompareSurveillanceRequirementsController', CompareSurveillanceRequirementsController);

    /** @ngInject */
    function CompareSurveillanceRequirementsController ($uibModalInstance, newSurveillance, oldSurveillance) {
        var vm = this;

        vm.cancel = cancel;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.oldSurveillance = oldSurveillance;
            vm.newSurveillance = newSurveillance;
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }
    }
})();
