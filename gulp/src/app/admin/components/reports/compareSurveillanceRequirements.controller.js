(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('CompareSurveillanceRequirementsController', CompareSurveillanceRequirementsController);

    /** @ngInject */
    function CompareSurveillanceRequirementsController ($modalInstance, oldSurveillance, newSurveillance) {
        var vm = this;

        vm.cancel = cancel;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.oldSurveillance = oldSurveillance;
            vm.newSurveillance = newSurveillance;
        }

        function cancel () {
            $modalInstance.dismiss('cancelled');
        }
    }
})();
