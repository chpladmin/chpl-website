(function () {
    'use strict';

    angular.module('chpl')
        .controller('ViewSedParticipantsController', ViewSedParticipantsController);

    /** @ngInject */
    function ViewSedParticipantsController ($uibModal, $uibModalInstance, allParticipants, editMode, participants) {
        var vm = this;

        vm.addParticipant = addParticipant;
        vm.cancel = cancel;
        vm.editParticipant = editParticipant;
        vm.isAssigned = isAssigned;
        vm.save = save;
        vm.toggleParticipant = toggleParticipant;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.allParticipants = angular.copy(allParticipants);
            vm.editMode = editMode;
            vm.participants = angular.copy(participants);
        }

        function addParticipant () {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/admin/components/sed/editParticipant.html',
                controller: 'EditSedParticipantController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    participant: function () { return {}; },
                },
            });
            vm.modalInstance.result.then(function (result) {
                vm.participants.push(result.participant);
                vm.allParticipants.push(result.participant);
            });
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }

        function editParticipant (participant) {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/admin/components/sed/editParticipant.html',
                controller: 'EditSedParticipantController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    participant: function () { return participant; },
                },
            });
            vm.modalInstance.result.then(function (result) {
                var i, participant;
                participant = result.participant;
                for (i = 0; i < vm.participants.length; i++) {
                    if (participant.testParticipantId === vm.participants[i].testParticipantId) {
                        vm.participants[i] = participant;
                    }
                }
                for (i = 0; i < vm.allParticipants.length; i++) {
                    if (participant.testParticipantId === vm.allParticipants[i].testParticipantId) {
                        vm.allParticipants[i] = participant;
                    }
                }
            });
        }

        function isAssigned (participant) {
            return vm.participants.reduce(function (isIn, item) {
                return isIn || participant.testParticipantId === item.testParticipantId;
            }, false);
        }

        function save () {
            $uibModalInstance.close({
                allParticipants: vm.allParticipants,
                participants: vm.participants,
            });
        }

        function toggleParticipant (participant) {
            var adding = true;
            for (var i = 0; i < vm.participants.length; i++) {
                if (participant.testParticipantId === vm.participants[i].testParticipantId) {
                    vm.participants.splice(i, 1);
                    adding = false;
                }
            }
            if (adding) {
                vm.participants.push(participant);
            }
        }
    }
})();
