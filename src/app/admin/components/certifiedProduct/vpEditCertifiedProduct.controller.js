(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('EditCertifiedProductController', EditCertifiedProductController);

    /** @ngInject */
    function EditCertifiedProductController ($uibModalInstance, $timeout, activeCP, commonService, utilService, isAcbAdmin, isAcbStaff, isChplAdmin, resources, workType) {

        var vm = this;
        vm.addNewValue = addNewValue;
        vm.attachModel = attachModel;
        vm.cancel = cancel;
        vm.directCertsDirective = directCertsDirective;
        vm.disabledStatus = disabledStatus;
        vm.extendSelect = extendSelect;
        vm.findModel = findModel;
        vm.prep = prep;
        vm.registerCerts = registerCerts;
        vm.save = save;
        vm.willCauseSuspension = willCauseSuspension;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.cp = angular.copy(activeCP);
            vm.cp.certDate = new Date(vm.cp.certificationDate);
            vm.cp.sedTestingEndDate = new Date(vm.cp.sedTestingEnd);
            vm.isAcbAdmin = isAcbAdmin;
            vm.isAcbStaff = isAcbStaff;
            vm.isChplAdmin = isChplAdmin;
            vm.bodies = resources.bodies;
            vm.classifications = resources.classifications;
            vm.practices = resources.practices;
            vm.qmsStandards = resources.qmsStandards;
            vm.accessibilityStandards = resources.accessibilityStandards;
            vm.targetedUsers = resources.targetedUsers;
            vm.statuses = resources.statuses;
            vm.testingLabs = resources.testingLabs;
            vm.resources = resources;
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

        function addNewValue (array, object) {
            if (!array) {
                array = [];
            }
            if (object && object !== {}) {
                array.push(angular.copy(object));
            }
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
            $uibModalInstance.dismiss('cancelled');
        }

        function directCertsDirective () {
            angular.forEach(vm.handlers, function (handler) {
                handler();
            });
        }

        function disabledStatus (name) {
            return ((name === 'Pending' && vm.workType === 'manage') || (name !== 'Pending' && vm.workType === 'confirm'));
        }

        function extendSelect (options, value) {
            options = utilService.extendSelect(options, value);
        }

        function findModel (id, array) {
            for (var i = 0; i < array.length; i++) {
                if (id.id === array[i].id) {
                    id = array[i];
                }
            }
            return id;
        }

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
            vm.cp.certificationDate = vm.cp.certDate.getTime();
            vm.cp.sedTestingEnd = vm.cp.sedTestingEndDate.getTime();
            if (vm.workType === 'manage') {
                vm.isSaving = true;
                commonService.updateCP(vm.cp)
                    .then(function (response) {
                        if (!response.status || response.status === 200) {
                            $uibModalInstance.close(response);
                        } else {
                            vm.errors = [response.error];
                            vm.isSaving = false;
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
                        vm.isSaving = false;
                    });
            } else if (vm.workType === 'confirm') {
                $uibModalInstance.close(vm.cp);
            }
        }

        function willCauseSuspension (name) {
            switch (name) {
                case('Active'):
                case('Retired'):
                case('Suspended by ONC-ACB'):
                case('Suspended by ONC'):
                case('Withdrawn by Developer'):
                case('Withdrawn by ONC-ACB'):
                return false;
                case('Terminated by ONC'):
                case('Withdrawn by Developer Under Surveillance/Review'):
                return true;
            }
        }
    }
})();
