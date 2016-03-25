;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('EditCertifiedProductController', ['$modalInstance', '$timeout', 'activeCP', 'commonService', 'practices', 'classifications', 'isAcbAdmin', 'isAcbStaff', 'isChplAdmin', 'bodies', 'testingLabs', 'statuses', 'workType', '$log', function ($modalInstance, $timeout, activeCP, commonService, practices, classifications, isAcbAdmin, isAcbStaff, isChplAdmin, bodies, testingLabs, statuses, workType, $log) {

            var vm = this;
            vm.attachModel = attachModel;
            vm.cancel = cancel;
            vm.directCertsDirective = directCertsDirective;
            vm.findModel = findModel;
            vm.prep = prep;
            vm.registerCerts = registerCerts;
            vm.save = save;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.cp = angular.copy(activeCP);
                vm.cp.certDate = new Date(vm.cp.certificationDate);
                vm.practices = practices;
                vm.classifications = classifications;
                vm.isAcbAdmin = isAcbAdmin;
                vm.isAcbStaff = isAcbStaff;
                vm.isChplAdmin = isChplAdmin;
                vm.bodies = bodies;
                vm.testingLabs = testingLabs;
                vm.statuses = statuses;
                vm.workType = workType;
                vm.showFormErrors = false;
                vm.message = '';

                vm.handlers = [];

                if (vm.cp.certificationEdition.name === '2015') {
                    var idFields = vm.cp.chplProductNumber.split('.');
                    vm.cp.chplId = {
                        acb: idFields[0],
                        atl: idFields[1],
                        dev: idFields[2],
                        prod: idFields[3],
                        ver: idFields[4],
                        ics: idFields[5],
                        adds: idFields[6],
                        date: idFields[7]
                    }
                }
                vm.attachModel();
            }

            function attachModel () {
                vm.cp.practiceType = vm.findModel(vm.cp.practiceType, vm.practices);
                vm.cp.classificationType = vm.findModel(vm.cp.classificationType, vm.classifications);
                vm.cp.certifyingBody = vm.findModel(vm.cp.certifyingBody, vm.bodies);
                if (vm.cp.testingLab) {
                    vm.cp.testingLab = vm.findModel(vm.cp.testingLab, vm.testingLabs);
                }
                vm.cp.certificationStatus = vm.findModel(vm.cp.certificationStatus, vm.statuses);
            }

            function cancel () {
                $modalInstance.dismiss('cancelled');
            }

            function directCertsDirective () {
                angular.forEach(vm.handlers, function (handler) {
                    handler();
                });
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

            function prep () {
                vm.directCertsDirective();
                $timeout(vm.save, 1000);
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

            function save () {
                if (vm.workType === 'manage') {
                    commonService.updateCP(vm.cp)
                        .then(function (response) {
                            if (!response.status || response.status === 200) {
                                $modalInstance.close(response);
                            } else {
                                vm.message = response;
                            }
                        },function (error) {
                            vm.message = response;
                        });
                } else if (vm.workType === 'confirm') {
                    $modalInstance.close(vm.cp);
                }

            }
        }]);
})();
