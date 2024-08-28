(function () {
  'use strict';

  angular.module('chpl.components')
    .controller('ViewSedTaskController', ViewSedTaskController);

  /** @ngInject */
  function ViewSedTaskController ($log, $uibModal, $uibModalInstance, criteria, editMode, participants, task, utilService) {
    var vm = this;

    vm.cancel = cancel;
    vm.deleteTask = deleteTask;
    vm.editTask = editTask;
    vm.save = save;
    vm.sortCert = utilService.sortCert;
    vm.viewParticipants = viewParticipants;

    activate();

    ////////////////////////////////////////////////////////////////////

    function activate () {
      vm.criteria = criteria;
      vm.editMode = editMode;
      vm.participants = participants;
      console.log('task-mod.init', participants);
      vm.task = task;
      parseParticipants();
    }

    function cancel () {
      $uibModalInstance.dismiss('cancelled');
    }

    function deleteTask () {
      $uibModalInstance.close({
        deleted: true,
        participants: vm.participants,
      });
    }

    function editTask () {
      vm.modalInstance = $uibModal.open({
        templateUrl: 'chpl.components/listing/details/sed/edit-task.html',
        controller: 'EditSedTaskController',
        controllerAs: 'vm',
        animation: false,
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        resolve: {
          criteria: function () { return vm.criteria; },
          participants: function () { return vm.participants; },
          task: function () { return vm.task; },
        },
      });
      vm.modalInstance.result.then(function (result) {
        vm.participants = result.participants;
        vm.task = result.task;
      }, function (result) {
        if (result !== 'cancelled') {
          $log.info('dismissed', result);
        }
      });
    }

    function save () {
      $uibModalInstance.close({
        task: vm.task,
        participants: vm.participants,
      });
    }

    function viewParticipants () {
      console.log('task-mod.start', vm.participants, vm.task.testParticipants);
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
          editMode: function () { return vm.editMode; },
          participants: function () { return vm.task.testParticipants; },
        },
      });
      vm.modalInstance.result.then((result) => {
        console.log('task-mod', result);
        vm.task.testParticipants = result.participants;
        vm.participants = result.allParticipants;
      });
    }

    ////////////////////////////////////////////////////////////////////

    function parseParticipants () {
      vm.occupations = [];
      var prodExpTotal = 0;
      var occupationObj = {};
      angular.forEach(vm.task.testParticipants, function (part) {
        prodExpTotal += part.productExperienceMonths;
        if (angular.isUndefined(occupationObj[part.occupation])) {
          occupationObj[part.occupation] = 0;
        }
        occupationObj[part.occupation] += 1;
      });
      angular.forEach(occupationObj, function (value, key) {
        vm.occupations.push({
          name: key,
          count: value,
        });
      });
      vm.meanProductExperience = prodExpTotal / vm.task.testParticipants.length;
    }
  }
})();
