;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('SurveillanceInspectController', ['$modalInstance', '$modal', 'surveillance', 'commonService', function ($modalInstance, $modal, surveillance, commonService) {
            var vm = this;

            vm.cancel = cancel;
            vm.confirm = confirm;
            vm.editSurveillance = editSurveillance;
            vm.reject = reject;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.surveillance = angular.copy(surveillance);
                vm.errorMessages = [];
            }

            function cancel () {
                $modalInstance.dismiss('cancelled');
            }

            function confirm () {
                commonService.confirmPendingSurveillance(vm.surveillance)
                    .then(function (result) {
                        $modalInstance.close({status: 'confirmed'});
                    }, function (error) {
                        vm.errorMessages = error.data.errorMessages;
                    });
            }

            function editSurveillance () {
                vm.editModalInstance = $modal.open({
                    templateUrl: 'admin/components/surveillance/editSurveillance.html',
                    controller: 'EditSurveillanceController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        surveillance: function () { return vm.surveillance; },
                        workType: function () { return 'confirm'; }
                    }
                });
                vm.editModalInstance.result.then(function (result) {
                    vm.surveillance = result;
                }, function (result) {
                    if (result !== 'cancelled') {
                        console.debug('dismissed', result);
                    }
                });
            }

            function reject () {
                commonService.rejectPendingSurveillance(vm.surveillance.id)
                    .then(function () {
                        $modalInstance.dismiss('rejected');
                    });
            }
        }]);
})();
