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
          participant: function () { return {
            cuid: Date.now(),
          }; },
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
          if ((participant.id && vm.participants[i].id === participant.id) || (participant.cuid && vm.participants[i].cuid === participant.cuid)) {
            vm.participants[i] = {...participant};
            vm.participants[i].active = false;
          }
        }
        for (i = 0; i < vm.allParticipants.length; i++) {
          if ((participant.id && vm.allParticipants[i].id === participant.id) || (participant.cuid && vm.allParticipants[i].cuid === participant.cuid)) {
            vm.allParticipants[i] = {...participant};
            vm.allParticipants[i].active = false;
          }
        }
      });
    }

    function isAssigned (participant) {
      return vm.participants.reduce((isIn, item) => {
        return isIn || (participant.id === item.id || participant.cuid === item.cuid);
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
        if ((participant.id && vm.participants[i].id === participant.id) || (participant.cuid && vm.participants[i].cuid === participant.cuid)) {
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
