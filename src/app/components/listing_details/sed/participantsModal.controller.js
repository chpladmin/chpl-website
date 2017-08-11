(function () {
    'use strict';

    angular.module('chpl')
        .controller('ViewSedParticipantsController', ViewSedParticipantsController);

    /** @ngInject */
    function ViewSedParticipantsController ($uibModal, $uibModalInstance, editMode, participants) {
        var vm = this;

        vm.cancel = cancel;
        vm.editParticipant = editParticipant;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.editMode = editMode;
            vm.participants = participants;
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }

        function editParticipant (participant) {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/admin/components/sed/participantModal.html',
                controller: 'EditSedParticipantController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    participant: function () { return participant; },
                },
            });
        }
    }
})();
