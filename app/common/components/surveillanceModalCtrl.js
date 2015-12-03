;(function () {
    'use strict';

    angular.module('app.common')
        .controller('EditSurveillanceController', ['$modalInstance', 'action', 'certifiedProductId', 'certificationResults', 'surveillance', 'commonService', function ($modalInstance, action, certifiedProductId, certificationResults, surveillance, commonService) {
            var vm = this;

            vm.activate = activate;
            vm.cancel = cancel;
            vm.certsChecked = certsChecked;
            vm.deleteSurveillance = deleteSurveillance;
            vm.save = save;

            vm.activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.action = action;
                vm.certificationResults = certificationResults;
                vm.uploadMessage = '';
                if (vm.action === 'initiate') {
                    vm.surveillance = {
                        certifiedProductId: certifiedProductId,
                        certifications: []
                    };
                    for (var i = 0; i < vm.certificationResults.length; i++) {
                        if (vm.certificationResults[i].success) {
                            vm.surveillance.certifications.push({
                                id: i,
                                number: vm.certificationResults[i].number,
                                title: vm.certificationResults[i].title,
                                certificationCriterionNumber: vm.certificationResults[i].number,
                                certificationCriterionTitle: vm.certificationResults[i].title,
                                error: false
                            });
                        }
                    }
                }
                if (vm.action === 'edit') {
                    vm.surveillance = surveillance;
                    for (var i = 0; i < vm.surveillance.certifications.length; i++) {
                        vm.surveillance.certifications[i].id = i;
                        vm.surveillance.certifications[i].number = vm.surveillance.certifications[i].certificationCriterionNumber;
                        vm.surveillance.certifications[i].title = vm.surveillance.certifications[i].certificationCriterionTitle;
                        vm.surveillance.certifications[i].error = true;
                    }
                    if (vm.surveillance.startDate) { vm.surveillance.startDate = new Date(vm.surveillance.startDate); }
                    if (vm.surveillance.endDate) { vm.surveillance.endDate = new Date(vm.surveillance.endDate); }
                }
            }

            function cancel () {
                $modalInstance.dismiss('cancelled');
            }

            function certsChecked () {
                for (var i = 0; i < vm.surveillance.certifications.length; i++) {
                    if (vm.surveillance.certifications[i].error) {
                        return true;
                    }
                }
                return false;
            }

            function deleteSurveillance () {
                commonService.deleteSurveillance(vm.surveillance.id)
                    .then(function (result) {
                        $modalInstance.close(result);
                    }), function (error) {
                        $modalInstance.dismss(error);
                    };
            }

            function save () {
                var tempCerts = angular.copy(vm.surveillance.certifications);
                vm.surveillance.certifications = [];
                for (var i = 0; i < tempCerts.length; i++) {
                    if (tempCerts[i].error) {
                        vm.surveillance.certifications.push(tempCerts[i]);
                    }
                }

                if (vm.action === 'initiate') {
                    commonService.initiateSurveillance(vm.surveillance)
                        .then(function (result) {
                            $modalInstance.close(result);
                        }), function (error) {
                            $modalInstance.dismss(error);
                        };
                } else if (vm.action === 'edit') {
                    commonService.updateSurveillance(vm.surveillance)
                        .then(function (result) {
                            $modalInstance.close(result);
                        }), function (error) {
                            $modalInstance.dismss(error);
                        };
                }
            }
        }]);
})();
