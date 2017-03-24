(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('EditDeveloperController', EditDeveloperController);

    /** @ngInject */
    function EditDeveloperController ($uibModalInstance, $filter, $log, activeDeveloper, activeAcbs, commonService, authService) {
        var vm = this;

        vm.addPreviousStatus = addPreviousStatus;
        vm.addressRequired = addressRequired;
        vm.hasMatches = hasMatches;
        vm.isBeingActivatedFromOncInactiveStatus = isBeingActivatedFromOncInactiveStatus;
        vm.isMissingRequiredFields = isMissingRequiredFields;
        vm.matchesPrevious = matchesPrevious;
        vm.removePreviousStatus = removePreviousStatus;
        vm.save = save;
        vm.cancel = cancel;

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

            vm.isAcbAdmin = authService.isAcbAdmin();
            vm.isChplAdmin = authService.isChplAdmin();
            vm.showFormErrors = false;
            vm.loadedAsInactiveByOnc = (vm.developer.status.status === 'Suspended by ONC' || vm.developer.status.status === 'Under certification ban by ONC');
        }

        function addPreviousStatus () {
            vm.developer.statusEvents.push({statusDateObject: new Date()});
        }

        function addressRequired () {
            return commonService.addressRequired(vm.developer.address);
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }

        function hasMatches () {
            var ret = false;
            for (var i = 0; i < vm.developer.statusEvents.length; i++) {
                ret = ret || vm.matchesPrevious(vm.developer.statusEvents[i]);
            }
            return ret;
        }

        function isBeingActivatedFromOncInactiveStatus () {
            return vm.loadedAsInactiveByOnc && mostRecentStatus() && mostRecentStatus().status.status !== 'Suspended by ONC' && mostRecentStatus().status.status !== 'Under certification ban by ONC';
        }

        function isMissingRequiredFields () {
            for (var i = 0; i < vm.developer.statusEvents.length; i++) {
                if (angular.isUndefined(vm.developer.statusEvents[i].status)) {
                    return true;
                }
            }
            return false;
        }

        function matchesPrevious (status) {
            var orderedStatus = $filter('orderBy')(vm.developer.statusEvents,'statusDateObject', true);
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
            commonService.updateDeveloper(vm.updateDeveloper)
                .then(function (response) {
                    if (!response.status || response.status === 200 || angular.isObject(response.status)) {
                        $uibModalInstance.close(response);
                    } else {
                        $uibModalInstance.dismiss('An error occurred');
                    }
                },function (error) {
                    $uibModalInstance.dismiss(error.data.error);
                });
        }

        ////////////////////////////////////////////////////////////////////

        function mostRecentStatus () {
            if (vm.developer.statusEvents && vm.developer.statusEvents.length > 0) {
                if (vm.developer.statusEvents.length > 1) {
                    var status = vm.developer.statusEvents[0];
                    for (var i = 1; i < vm.developer.statusEvents.length; i++) {
                        if (status.statusDateObject < vm.developer.statusEvents[i].statusDateObject) {
                            status = vm.developer.statusEvents[i];
                        }
                    }
                } else {
                    return vm.developer.statusEvents[0];
                }
            } else {
                return null;
            }
        }
    }
})();
