;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('EditCorrectiveActionPlanController', ['$modalInstance', 'software', 'commonService', function ($modalInstance, software, commonService) {
            var vm = this;
            vm.sw = angular.copy(software);

            vm.save = save;
            vm.cancel = cancel;

            ////////////////////////////////////////////////////////////////////

            function save () {
                $modalInstance.close(vm.sw);
            }

            function cancel () {
                $modalInstance.dismiss('cancelled');
            }
        }]);
})();
