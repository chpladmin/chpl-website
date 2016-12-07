;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('CompareSurveillanceRequirementsController', ['$modalInstance', 'oldSurveillance', 'newSurveillance', function ($modalInstance, oldSurveillance, newSurveillance) {
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
        }]);
})();
