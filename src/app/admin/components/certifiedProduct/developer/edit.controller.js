(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('EditDeveloperController', EditDeveloperController);

    /** @ngInject */
    function EditDeveloperController ($filter, $log, $uibModalInstance, activeAcbs, activeDeveloper, authService, featureFlags, networkService, utilService) {
        var vm = this;

        vm.addPreviousStatus = addPreviousStatus;
        vm.addressRequired = addressRequired;
        vm.cancel = cancel;
        vm.isOn = featureFlags.isOn;
        vm.hasAnyRole = authService.hasAnyRole;
        vm.hasDateMatches = hasDateMatches;
        vm.hasStatusMatches = hasStatusMatches;
        vm.isBeingActivatedFromOncInactiveStatus = isBeingActivatedFromOncInactiveStatus;
        vm.isMissingRequiredFields = isMissingRequiredFields;
        vm.isMissingReasonForBan = isMissingReasonForBan;
        vm.isTransparencyAttestationEditable = isTransparencyAttestationEditable;
        vm.matchesPreviousDate = matchesPreviousDate;
        vm.matchesPreviousStatus = matchesPreviousStatus;
        vm.removePreviousStatus = removePreviousStatus;
        vm.save = save;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.developer = angular.copy(activeDeveloper);
            vm.updateDeveloper = {developerIds: [vm.developer.developerId]};
            vm.activeAcbs = angular.copy(activeAcbs);
            if (angular.isUndefined(vm.developer.statusEvents)) {
                vm.developer.statusEvents = [];
            } else {
                for (var i = 0; i < vm.developer.statusEvents.length; i++) {
                    vm.developer.statusEvents[i].statusDateObject = new Date(vm.developer.statusEvents[i].statusDate);
                }
            }

            vm.showFormErrors = false;
            vm.loadedAsInactiveByOnc = (vm.developer.status.status === 'Suspended by ONC' || vm.developer.status.status === 'Under certification ban by ONC');
        }

        function addPreviousStatus () {
            vm.developer.statusEvents.push({statusDateObject: new Date()});
        }

        function addressRequired () {
            return utilService.addressRequired(vm.developer.address);
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }

        function hasDateMatches () {
            var ret = false;
            for (var i = 0; i < vm.developer.statusEvents.length; i++) {
                ret = ret || vm.matchesPreviousDate(vm.developer.statusEvents[i]);
            }
            return ret;
        }

        function hasStatusMatches () {
            var ret = false;
            for (var i = 0; i < vm.developer.statusEvents.length; i++) {
                ret = ret || vm.matchesPreviousStatus(vm.developer.statusEvents[i]);
            }
            return ret;
        }

        function isBeingActivatedFromOncInactiveStatus () {
            if (mostRecentStatus() !== null) {
                return vm.loadedAsInactiveByOnc && mostRecentStatus().status.status !== 'Suspended by ONC' && mostRecentStatus().status.status !== 'Under certification ban by ONC';
            } else {
                return false;
            }
        }

        function isMissingRequiredFields () {
            for (var i = 0; i < vm.developer.statusEvents.length; i++) {
                if (angular.isUndefined(vm.developer.statusEvents[i].status)) {
                    return true;
                }
            }
            return false;
        }

        function isMissingReasonForBan () {
            for (var i = 0; i < vm.developer.statusEvents.length; i++) {
                if (vm.developer.statusEvents[i].status.status === 'Under certification ban by ONC' &&
                     angular.isUndefined(vm.developer.statusEvents[i].reason)) {
                    return true;
                }
            }
            return false;
        }

        function isTransparencyAttestationEditable () {
            let isAcbAdmin = vm.hasAnyRole(['ROLE_ACB']);
            if (vm.isOn('effective-rule-date-plus-one-week')) {
                return !isAcbAdmin;
            }
            return isAcbAdmin;
        }

        function matchesPreviousDate (status) {
            var orderedStatus = $filter('orderBy')(vm.developer.statusEvents,'statusDateObject');
            var statusLoc = orderedStatus.indexOf(status);
            if (statusLoc > 0) {
                return ($filter('date')(status.statusDateObject, 'mediumDate', 'UTC') === $filter('date')(orderedStatus[statusLoc - 1].statusDateObject, 'mediumDate', 'UTC'));
            }
            return false;
        }

        function matchesPreviousStatus (status) {
            var orderedStatus = $filter('orderBy')(vm.developer.statusEvents,'statusDateObject');
            var statusLoc = orderedStatus.indexOf(status);
            if (statusLoc > 0) {
                return (status.status.status === orderedStatus[statusLoc - 1].status.status);
            }
            return false;
        }

        function removePreviousStatus (idx) {
            vm.developer.statusEvents.splice(idx, 1);
        }

        function save () {
            for (var i = 0; i < vm.developer.statusEvents.length; i++) {
                vm.developer.statusEvents[i].statusDate = vm.developer.statusEvents[i].statusDateObject.getTime();
            }
            vm.updateDeveloper.developer = vm.developer;
            angular.forEach(vm.developer.transMap, function (value, key) {
                var found = false;
                for (var i = 0; i < vm.developer.transparencyAttestations.length; i++) {
                    if (vm.developer.transparencyAttestations[i].acbName === key) {
                        vm.developer.transparencyAttestations[i].attestation = value;
                        found = true;
                    }
                }
                if (!found) {
                    vm.developer.transparencyAttestations.push({acbName: key, attestation: value});
                }
            });

            networkService.updateDeveloper(vm.updateDeveloper)
                .then(function (response) {
                    if (!response.status || response.status === 200 || angular.isObject(response.status)) {
                        $uibModalInstance.close(response);
                    } else {
                        if (response.data.errorMessages) {
                            vm.errorMessages = response.data.errorMessages;
                        } else if (response.data.error) {
                            vm.errorMessages = [];
                            vm.errorMessages.push(response.data.error);
                        }
                    }
                },function (error) {
                    if (error.data.errorMessages) {
                        vm.errorMessages = error.data.errorMessages;
                    } else if (error.data.error) {
                        vm.errorMessages = [];
                        vm.errorMessages.push(error.data.error);
                    }
                });
        }

        ////////////////////////////////////////////////////////////////////

        function mostRecentStatus () {
            if (vm.developer.statusEvents && vm.developer.statusEvents.length > 0) {
                var orderedStatus = $filter('orderBy')(vm.developer.statusEvents,'statusDateObject', true);
                return orderedStatus[0];
            } else {
                return null;
            }
        }
    }
})();
