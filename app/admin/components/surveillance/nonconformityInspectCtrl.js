;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('NonconformityInspectController', ['$modalInstance', '$modal', 'nonconformities', function ($modalInstance, $modal, nonconformities) {
            var vm = this;

            vm.cancel = cancel;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.nonconformities = angular.copy(nonconformities);
            }

            function cancel () {
                $modalInstance.dismiss('cancelled');
            }
        }]);
})();
