;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('EditCertifiedProductController', ['$modalInstance', 'activeCP', 'commonService', 'classifications', 'practices', 'isAcbAdmin', 'isChplAdmin', 'bodies', 'statuses', function ($modalInstance, activeCP, commonService, classifications, practices, isAcbAdmin, isChplAdmin, bodies, statuses) {

            var vm = this;
            vm.cp = angular.copy(activeCP);
            vm.updateCP = {};
            vm.classifications = classifications;
            vm.practices = practices;
            vm.isAcbAdmin = isAcbAdmin;
            vm.isChplAdmin = isChplAdmin;
            vm.bodies = bodies;
            vm.statuses = statuses;

            vm.save = save;
            vm.cancel = cancel;

            ////////////////////////////////////////////////////////////////////

            function save () {
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
            }

            function cancel () {
                $modalInstance.dismiss('cancelled');
            }
        }]);
})();
