(function () {
  'use strict';

  angular.module('chpl.components')
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
        templateUrl: 'chpl.components/listing/details/sed/edit-participant.html',
        controller: 'EditSedParticipantController',
        controllerAs: 'vm',
        animation: false,
        backdrop: 'static',
        keyboard: false,
        resolve: {
          participant: function () { return {}; },
        },
      });
      vm.modalInstance.result.then((result) => {
        vm.participants.push(result.participant);
        vm.allParticipants.push(result.participant);
      });
    }

    function cancel () {
      $uibModalInstance.dismiss('cancelled');
    }

    function editParticipant (participant) {
      vm.modalInstance = $uibModal.open({
        templateUrl: 'chpl.components/listing/details/sed/edit-participant.html',
        controller: 'EditSedParticipantController',
        controllerAs: 'vm',
        animation: false,
        backdrop: 'static',
        keyboard: false,
        resolve: {
          participant: function () { return participant; },
        },
      });
      vm.modalInstance.result.then((result) => {
        var i, participant;
        participant = {...result.participant};
        for (i = 0; i < vm.participants.length; i++) {
          if (vm.participants[i].id = participant.id) {
            console.log('found');
            vm.participants[i] = {...participant};
            vm.participants[i].active = false;
          }
        }
        for (i = 0; i < vm.allParticipants.length; i++) {
          if (participant.id === vm.allParticipants[i].id) {
            vm.allParticipants[i] = {...participant};
            vm.allParticipants[i].active = false;
          }
        }
        console.log('par-mod', participant, vm.participants, vm.allParticipants);
      });
    }

    function isAssigned (participant) {
      return vm.participants.reduce((isIn, item) => {
        return isIn || participant.friendlyId === item.friendlyId;
      }, false);
    }

    function save () {
      console.log('par-mod - sazve', vm.allParticipants, vm.participants);
      $uibModalInstance.close({
        allParticipants: vm.allParticipants,
        participants: vm.participants,
      });
    }

    function toggleParticipant (participant) {
      var adding = true;
      for (var i = 0; i < vm.participants.length; i++) {
        if (participant.friendlyId === vm.participants[i].friendlyId) {
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
