;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('EditCertifiedProductController', ['$modalInstance', 'activeCP', 'commonService', 'classifications', 'practices', 'isAcbAdmin', 'isChplAdmin', 'bodies', 'statuses', 'workType', function ($modalInstance, activeCP, commonService, classifications, practices, isAcbAdmin, isChplAdmin, bodies, statuses, workType) {

            var vm = this;
            vm.cp = angular.copy(activeCP);
            vm.updateCP = {};
            vm.classifications = classifications;
            vm.practices = practices;
            vm.isAcbAdmin = isAcbAdmin;
            vm.isChplAdmin = isChplAdmin;
            vm.bodies = bodies;
            vm.statuses = statuses;
            vm.workType = workType;

            vm.save = save;
            vm.cancel = cancel;
            vm.attachModel = attachModel;
            vm.findModel = findModel;

            vm.attachModel();

            ////////////////////////////////////////////////////////////////////

            function save () {
                if (vm.workType === 'manage') {
                    vm.updateCP.id = vm.cp.id;
                    vm.updateCP.certificationBodyId = vm.cp.certifyingBody.id;
                    vm.updateCP.practiceTypeId = vm.cp.practiceType.id;
                    vm.updateCP.productClassificationTypeId = vm.cp.classificationType.id;
                    vm.updateCP.certificationStatus = vm.cp.certificationStatus.id;
                    vm.updateCP.chplProductNumber = vm.cp.chplProductNumber;
                    vm.updateCP.reportFileLocation = vm.cp.reportFileLocation;
                    vm.updateCP.qualityManagementSystemAtt = vm.cp.qualityManagementSystemAtt;
                    vm.updateCP.acbCertificationId = vm.cp.acbCertificationId;
                    vm.updateCP.otherAcb = vm.cp.otherAcb;
                    vm.updateCP.testingLabId = vm.cp.testingLabId;
                    vm.updateCP.isChplVisible = vm.cp.visibleOnChpl;

                    commonService.updateCP(vm.cp)
                        .then(function (response) {
                            if (!response.status || response.status === 200) {
                                $modalInstance.close(response);
                            } else {
                                $modalInstance.dismiss('An error occurred');
                            }
                        },function (error) {
                            $modalInstance.dismiss(error.data.error);
                        });
                } else if (vm.workType === 'confirm') {
                    console.debug(vm.cp.cqmResults);
                    $modalInstance.close(vm.cp);
                }
            }

            function cancel () {
                $modalInstance.dismiss('cancelled');
            }

            function attachModel () {
                vm.cp.classificationType = vm.findModel(vm.cp.classificationType, vm.classifications);
                vm.cp.practiceType = vm.findModel(vm.cp.practiceType, vm.practices);
                vm.cp.certifyingBody = vm.findModel(vm.cp.certifyingBody, vm.bodies);
                vm.cp.certificationStatus = vm.findModel(vm.cp.certificationStatus, vm.statuses);
            }

            function findModel (id, array) {
                var i;
                for (i = 0; i < array.length; i++) {
                    if (id.id === array[i].id) {
                        id = array[i];
                    }
                };
                return id;
            };
        }]);
})();
