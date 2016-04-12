;(function () {
    'use strict';

    angular.module('app.common')
        .controller('EditSedParticipantController', ['$modalInstance', 'participant', 'commonService', function ($modalInstance, participant, commonService) {
            var vm = this;

            vm.participant = participant.participant;

            vm.cancel = cancel;
            vm.changed = changed;
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
                    id: vm.participant.educationTypeId
                };
            }

            function cancel () {
                if (vm.participant.changed) {
                    delete (vm.participant.changed);
                }
                $modalInstance.dismiss('cancelled');
            }

            function changed () {
                if (vm.participant.testParticipantId) {
                    vm.participant.changed = true;
                }
            }

            function save () {
                vm.participant.educationTypeName = vm.participant.education.name;
                vm.participant.educationTypeId = vm.participant.education.id;
                $modalInstance.close(vm.participant);
            }
        }]);
})();
