(function () {
  'use strict';

  angular.module('chpl.components')
    .controller('EditSedTaskController', EditSedTaskController);

  /** @ngInject */
  function EditSedTaskController ($log, $uibModal, $uibModalInstance, criteria, participants, task, utilService) {
    var vm = this;

    vm.cancel = cancel;
    vm.save = save;
    vm.sortCert = utilService.sortCert;
    vm.viewParticipants = viewParticipants;

    activate();

    ////////////////////////////////////////////////////////////////////

    function activate () {
      vm.criteria = criteria;
      vm.participants = angular.copy(participants);
      vm.task = angular.copy(task);
      if (!vm.task.testParticipants) {
        vm.task.testParticipants = [];
      }
    }

    function cancel () {
      $uibModalInstance.dismiss('cancelled');
    }

    function save () {
      $uibModalInstance.close({
        participants: vm.participants,
        task: vm.task,
      });
    }

    function viewParticipants () {
      vm.modalInstance = $uibModal.open({
        templateUrl: 'chpl.components/listing/details/sed/participants-modal.html',
        controller: 'ViewSedParticipantsController',
        controllerAs: 'vm',
        animation: false,
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        resolve: {
          allParticipants: function () { return vm.participants; },
          editMode: function () { return true; },
          participants: function () { return vm.task.testParticipants; },
        },
      });
      vm.modalInstance.result.then(function (result) {
        vm.task.testParticipants = result.participants;
        vm.participants = result.allParticipants;
      });
    }
  }
})();
