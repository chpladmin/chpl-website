;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('EditCertifiedProductController', ['$modalInstance', '$timeout', 'activeCP', 'commonService', 'classifications', 'practices', 'isAcbAdmin', 'isAcbStaff', 'isChplAdmin', 'bodies', 'statuses', 'workType', function ($modalInstance, $timeout, activeCP, commonService, classifications, practices, isAcbAdmin, isAcbStaff, isChplAdmin, bodies, statuses, workType) {

            var vm = this;
            vm.cp = angular.copy(activeCP);
            vm.cp.certDate = new Date(vm.cp.certificationDate);
            vm.classifications = classifications;
            vm.practices = practices;
            vm.isAcbAdmin = isAcbAdmin;
            vm.isAcbStaff = isAcbStaff;
            vm.isChplAdmin = isChplAdmin;
            vm.bodies = bodies;
            vm.statuses = statuses;
            vm.workType = workType;

            vm.handlers = [];
            vm.prep = prep;
            vm.save = save;
            vm.cancel = cancel;
            vm.attachModel = attachModel;
            vm.findModel = findModel;
            vm.directCertsDirective = directCertsDirective;
            vm.registerCerts = registerCerts;

            vm.attachModel();

            ////////////////////////////////////////////////////////////////////

            function directCertsDirective () {
                angular.forEach(vm.handlers, function (handler) {
                    handler();
                });
            }

            function registerCerts (handler) {
                vm.handlers.push(handler);
                var removeHandler = function () {
                    vm.handlers = vm.handlers.filter(function (aHandler) {
                        return aHandler !== handler;
                    });
                };
                return removeHandler;
            }

            function prep () {
                vm.directCertsDirective();
                $timeout(vm.save, 1000);
            }

            function save () {
                if (vm.workType === 'manage') {
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
