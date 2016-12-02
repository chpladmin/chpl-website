;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('SurveillanceInspectController', ['$modalInstance', '$modal', '$log', 'surveillance', 'commonService', 'utilService', function ($modalInstance, $modal, $log, surveillance, commonService, utilService) {
            var vm = this;

            vm.cancel = cancel;
            vm.confirm = confirm;
            vm.editSurveillance = editSurveillance;
            vm.inspectNonconformities = inspectNonconformities;
            vm.reject = reject;
            vm.sortRequirements = utilService.sortRequirements;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.surveillance = angular.copy(surveillance);
                vm.errorMessages = [];
                vm.surveillanceTypes = commonService.getSurveillanceLookups();
            }

            function cancel () {
                $modalInstance.dismiss('cancelled');
            }

            function confirm () {
                commonService.confirmPendingSurveillance(vm.surveillance)
                    .then(function (result) {
                        $modalInstance.close({status: 'confirmed'});
                    }, function (error) {
                        if (error.data.messages) {
                            vm.errorMessages = error.data.errorMessages;
                        } else {
                            vm.errorMessages = [error.statusText];
                        }
                    });
            }

            function editSurveillance () {
                fixRequirementOptions();
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
                        surveillanceTypes: function () { return vm.surveillanceTypes; },
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

            function inspectNonconformities (noncons) {
                vm.modalInstance = $modal.open({
                    templateUrl: 'admin/components/surveillance/nonconformityInspect.html',
                    controller: 'NonconformityInspectController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        nonconformities: function () { return noncons; }
                    },
                    size: 'lg'
                });
                vm.modalInstance.result.then(function (response) {
                    noncons = response;
                }, function (result) {
                    $log.info(result);
                });
            }

            function reject () {
                commonService.rejectPendingSurveillance(vm.surveillance.id)
                    .then(function () {
                        $modalInstance.dismiss('rejected');
                    },function (error) {
                        vm.errorMessages = [error.statusText]
                    });
            }

            ////////////////////////////////////////////////////////////////////

            function fixRequirementOptions () {
                if (vm.surveillance.certifiedProduct.edition === '2015') {
                    vm.surveillanceTypes.surveillanceRequirements.criteriaOptions = vm.surveillanceTypes.surveillanceRequirements.criteriaOptions2015;
                } else if (vm.surveillance.certifiedProduct.edition === '2014') {
                    vm.surveillanceTypes.surveillanceRequirements.criteriaOptions = vm.surveillanceTypes.surveillanceRequirements.criteriaOptions2014;
                }
            }
        }]);
})();
