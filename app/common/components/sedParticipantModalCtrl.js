;(function () {
    'use strict';

    angular.module('app.common')
        .controller('EditSedParticipantController', ['$modalInstance', 'participant', 'commonService', function ($modalInstance, participant, commonService) {
            var vm = this;

            vm.participant = participant.participant;

            vm.cancel = cancel;
            vm.save = save;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                commonService.getEducation()
                    .then(function (result) {
                        vm.education = result;
                    });
            }

            function cancel () {
                $modalInstance.dismiss('cancelled');
            }

            function save () {
                vm.participant.educationTypeName = vm.participant.education.name;
                vm.participant.educationTypeId = vm.participant.education.id;
                $modalInstance.close(vm.participant);
            }
        }]);
})();
