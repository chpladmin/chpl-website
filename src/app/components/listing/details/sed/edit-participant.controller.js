(function () {
  'use strict';

  angular.module('chpl.components')
    .controller('EditSedParticipantController', EditSedParticipantController);

  /** @ngInject */
  function EditSedParticipantController ($uibModalInstance, networkService, participant) {
    var vm = this;

    vm.cancel = cancel;
    vm.orderAges = orderAges;
    vm.save = save;

    activate();

    ////////////////////////////////////////////////////////////////////

    function activate () {
      vm.participant = angular.copy(participant);

      networkService.getEducation()
        .then(function (result) {
          vm.education = result;
        });
      vm.participant.educationType = {
        name: vm.participant.educationTypeName,
        id: vm.participant.educationTypeId,
      };
      networkService.getAgeRanges()
        .then(function (result) {
          vm.ageRanges = result;
        });
      vm.participant.age = {
        name: vm.participant.ageRange,
        id: vm.participant.ageRangeId,
      };
    }

    function cancel () {
      $uibModalInstance.dismiss('cancelled');
    }

    function orderAges (ageRange) {
      if (ageRange.name.length === 3) {
        return 0;
      } else if (ageRange.name.length === 4) {
        return 10;
      } else {
        return parseInt(ageRange.name.charAt(0), 10);
      }
    }

    function save () {
      vm.participant.educationTypeName = vm.participant.educationType.name;
      vm.participant.educationTypeId = vm.participant.educationType.id;
      vm.participant.ageRange = vm.participant.age.name;
      vm.participant.ageRangeId = vm.participant.age.id;
      $uibModalInstance.close({
        participant: vm.participant,
      });
    }
  }
})();
