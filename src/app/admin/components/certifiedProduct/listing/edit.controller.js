(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('EditCertifiedProductController', EditCertifiedProductController);

    /** @ngInject */
    function EditCertifiedProductController ($log, $timeout, $uibModalInstance, activeCP, isAcbAdmin, isAcbStaff, isChplAdmin, networkService, resources, utilService, workType) {

        var vm = this;

        vm.addNewValue = utilService.addNewValue;
        vm.attachModel = attachModel;
        vm.cancel = cancel;
        vm.directCertsDirective = directCertsDirective;
        vm.disabledParent = disabledParent;
        vm.disabledStatus = disabledStatus;
        vm.extendSelect = utilService.extendSelect;
        vm.prep = prep;
        vm.requiredIcsCode = requiredIcsCode;
        vm.registerCerts = registerCerts;
        vm.save = save;
        vm.willCauseSuspension = willCauseSuspension;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.cp = angular.copy(activeCP);
            vm.cp.certDate = new Date(vm.cp.certificationDate);
            vm.isAcbAdmin = isAcbAdmin;
            vm.isAcbStaff = isAcbStaff;
            vm.isChplAdmin = isChplAdmin;
            vm.bodies = resources.bodies;
            vm.accessibilityStandards = resources.accessibilityStandards;
            vm.classifications = resources.classifications;
            vm.practices = resources.practices;
            vm.qmsStandards = resources.qmsStandards;
            vm.statuses = resources.statuses;
            vm.targetedUsers = resources.targetedUsers;
            vm.testingLabs = resources.testingLabs;
            vm.resources = resources;
            vm.workType = workType;
            vm.showFormErrors = false;
            vm.message = '';
            if (angular.isUndefined(vm.cp.ics.parents)) {
                vm.cp.ics.parents = [];
            }
            if (vm.cp.chplProductNumber.length > 12) {
                var idFields = vm.cp.chplProductNumber.split('.');
                vm.idFields = {
                    prefix: idFields[0] + '.' + idFields[1] + '.' + idFields[2] + '.' + idFields[3],
                    prod: idFields[4],
                    ver: idFields[5],
                    ics: idFields[6],
                    suffix: idFields[7] + '.' + idFields[8],
                };
            }

            vm.handlers = [];
            vm.attachModel();
            loadFamily();
        }

        function attachModel () {
            vm.cp.practiceType = utilService.findModel(vm.cp.practiceType, vm.practices);
            vm.cp.classificationType = utilService.findModel(vm.cp.classificationType, vm.classifications);
            vm.cp.certifyingBody = utilService.findModel(vm.cp.certifyingBody, vm.bodies);
            if (vm.cp.testingLab) {
                vm.cp.testingLab = utilService.findModel(vm.cp.testingLab, vm.testingLabs);
            }
            vm.cp.certificationStatus = utilService.findModel(vm.cp.certificationStatus, vm.statuses);
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }

        function directCertsDirective () {
            angular.forEach(vm.handlers, function (handler) {
                handler();
            });
        }

        function disabledParent (listing) {
            var ret = false;
            ret = ret || vm.cp.chplProductNumber === listing.chplProductNumber;
            for (var i = 0; i < vm.cp.ics.parents.length; i++) {
                ret = ret || vm.cp.ics.parents[i].chplProductNumber === listing.chplProductNumber;
            }
            return ret;
        }

        function disabledStatus (name) {
            return ((name === 'Pending' && vm.workType === 'manage') || (name !== 'Pending' && vm.workType === 'confirm'));
        }

        function prep () {
            vm.directCertsDirective();
            $timeout(vm.save, 1000);
        }

        function requiredIcsCode () {
            var code = vm.cp.ics.parents
                .map(function (item) { return parseInt(item.chplProductNumber.split('.')[6], 10); })
                .reduce(function (max, cur) { return Math.max(max, cur); }, -1)
                + 1;
            return (code > 9 || code < 0) ? '' + code : '0' + code;
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
            if (vm.workType === 'manage') {
                vm.isSaving = true;
                networkService.updateCP({
                    listing: vm.cp,
                    banDeveloper: vm.banDeveloper,
                }).then(function (response) {
                    if (!response.status || response.status === 200) {
                        $uibModalInstance.close(response);
                    } else {
                        vm.errors = [response.error];
                        vm.isSaving = false;
                    }
                },function (error) {
                    vm.errors = [];
                    vm.warnings = [];
                    if (error.data) {
                        if (error.data.error && error.data.error.length > 0) {
                            vm.errors.push(error.data.error);
                        }
                        if (error.data.errorMessages && error.data.errorMessages.length > 0) {
                            vm.errors = vm.errors.concat(error.data.errorMessages);
                        }
                        if (error.data.warningMessages && error.data.warningMessages.length > 0) {
                            vm.warnings = vm.warnings.concat(error.data.warningMessages);
                        }
                    }
                    vm.isSaving = false;
                });
            } else if (vm.workType === 'confirm') {
                $uibModalInstance.close(vm.cp);
            } else {
                $log.info('Cannot save; no work type found');
            }
        }

        function willCauseSuspension (name) {
            switch (name) {
            case ('Active'):
            case ('Retired'):
            case ('Suspended by ONC-ACB'):
            case ('Suspended by ONC'):
            case ('Withdrawn by Developer'):
            case ('Withdrawn by ONC-ACB'):
                return false;
            case ('Terminated by ONC'):
            case ('Withdrawn by Developer Under Surveillance/Review'):
                return true;
            default: return false;
            }
        }

        ////////////////////////////////////////////////////////////////////

        function loadFamily () {
            if (vm.cp.product && vm.cp.product.productId && vm.cp.certificationEdition.name === '2015') {
                networkService.getRelatedListings(vm.cp.product.productId)
                    .then(function (family) {
                        vm.relatedListings = family.filter(function (item) { return item.edition === '2015' });
                    });
            }
        }
    }
})();
