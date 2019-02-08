(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('SurveillanceInspectController', SurveillanceInspectController);

    /** @ngInject */
    function SurveillanceInspectController ($log, $uibModal, $uibModalInstance, networkService, surveillance, utilService) {
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
            vm.surveillanceTypes = networkService.getSurveillanceLookups();
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }

        function confirm () {
            networkService.confirmPendingSurveillance(vm.surveillance)
                .then(function () {
                    $uibModalInstance.close({status: 'confirmed'});
                }, function (error) {
                    if (error.data.contact) {
                        $uibModalInstance.close({
                            contact: error.data.contact,
                            objectId: error.data.objectId,
                            status: 'resolved',
                        });
                    } else {
                        if (error.data.errorMessages) {
                            vm.errorMessages = error.data.errorMessages;
                        } else {
                            vm.errorMessages = [error.statusText];
                        }
                    }
                });
        }

        function editSurveillance () {
            fixRequirementOptions();
            vm.editModalInstance = $uibModal.open({
                component: 'aiSurveillanceEdit',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    surveillance: function () { return vm.surveillance; },
                    surveillanceTypes: function () { return vm.surveillanceTypes; },
                    workType: function () { return 'confirm'; },
                },
            });
            vm.editModalInstance.result.then(function (result) {
                vm.surveillance = result;
            }, function (result) {
                if (result !== 'cancelled') {
                    $log.info('dismissed', result);
                }
            });
        }

        function inspectNonconformities (noncons) {
            vm.modalInstance = $uibModal.open({
                component: 'aiSurveillanceNonconformityInspect',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    nonconformities: () => noncons,
                },
                size: 'lg',
            });
        }

        function reject () {
            networkService.rejectPendingSurveillance(vm.surveillance.id)
                .then(function () {
                    $uibModalInstance.close({status: 'rejected'});
                },function (error) {
                    if (error.data.contact) {
                        $uibModalInstance.close({
                            contact: error.data.contact,
                            objectId: error.data.objectId,
                            status: 'resolved',
                        });
                    } else {
                        vm.errorMessages = error.data.errorMessages;
                    }
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
    }
})();
