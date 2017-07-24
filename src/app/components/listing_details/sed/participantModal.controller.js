(function () {
    'use strict';

    angular.module('chpl')
        .controller('EditSedParticipantController', EditSedParticipantController);

    /** @ngInject */
    function EditSedParticipantController ($uibModalInstance, commonService, participant) {
        var vm = this;

        vm.participant = participant.participant;

        vm.cancel = cancel;
        vm.changed = changed;
        vm.orderAges = orderAges;
        vm.save = save;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            commonService.getEducation()
                .then(function (result) {
                    vm.education = result;
                });
            vm.participant.education = {
                name: vm.participant.educationTypeName,
                id: vm.participant.educationTypeId,
            };
            commonService.getAgeRanges()
                .then(function (result) {
                    vm.ageRanges = result;
                });
            vm.participant.ageRangeObj = {
                name: vm.participant.ageRange,
                id: vm.participant.ageRangeId,
            };
        }

        function cancel () {
            if (vm.participant.changed) {
                delete (vm.participant.changed);
            }
            $uibModalInstance.dismiss('cancelled');
        }

        function changed () {
            if (vm.participant.testParticipantId) {
                vm.participant.changed = true;
            }
        }

        function orderAges (ageRange) {
            if (ageRange.name.length === 3) {
                return 0;
            } else if (ageRange.name.length === 4) {
                return 10;
            } else {
                return parseInt(ageRange.name.charAt(0));
            }
        }

        function save () {
            vm.participant.educationTypeName = vm.participant.education.name;
            vm.participant.educationTypeId = vm.participant.education.id;
            vm.participant.ageRange = vm.participant.ageRangeObj.name;
            vm.participant.ageRangeId = vm.participant.ageRangeObj.id;
            $uibModalInstance.close(vm.participant);
        }
    }
})();
