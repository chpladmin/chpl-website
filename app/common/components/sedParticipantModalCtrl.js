;(function () {
    'use strict';

    angular.module('app.common')
        .controller('EditSedParticipantController', ['$modalInstance', 'participant', function ($modalInstance, participant) {
            var vm = this;

            vm.participant = participant.participant;

            vm.cancel = cancel;
            vm.save = save;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
            }

            function cancel () {
                $modalInstance.dismiss('cancelled');
            }

            function save () {
                $modalInstance.close(vm.participant);
            }
        }]);
})();
