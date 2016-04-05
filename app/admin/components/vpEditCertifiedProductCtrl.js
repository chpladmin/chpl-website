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
                if (vm.cp.chplProductNumber.length > 12) {
                    var idFields = vm.cp.chplProductNumber.split('.');
                    vm.idFields = {
                        prefix: idFields[0] + '.' + idFields[1] + '.' + idFields[2] + '.' + idFields[3],
                        prod: idFields[4],
                        ver: idFields[5],
                        ics: idFields[6],
                        suffix: idFields[7] + '.' + idFields[8]
                    };
                }

                vm.handlers = [];
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
                if (vm.cp.chplProductNumber.length > 12) {
                    vm.cp.chplProductNumber =
                        vm.idFields.prefix + '.' +
                        vm.idFields.prod + '.' +
                        vm.idFields.ver + '.' +
                        vm.idFields.ics + '.' +
                        vm.idFields.suffix;
                }
                if (vm.workType === 'manage') {
                    commonService.updateCP(vm.cp)
                        .then(function (response) {
                            if (!response.status || response.status === 200) {
                                $modalInstance.close(response);
                            } else {
                                vm.errors = [response.error];
                            }
                        },function (error) {
                            vm.errors = [];
                            if (error.data) {
                                if (error.data.error && error.data.error.length > 0)
                                    vm.errors.push(error.data.error);
                                if (error.data.errorMessages && error.data.errorMessages.length > 0)
                                    vm.errors = vm.errors.concat(error.data.errorMessages);
                                if (error.data.warningMessage && error.data.warningMessage.length > 0)
                                    vm.errors = vm.errors.concat(error.data.warningMessage);
                            }
                        });
                } else if (vm.workType === 'confirm') {
                    $modalInstance.close(vm.cp);
                }

            }
        }]);
})();
