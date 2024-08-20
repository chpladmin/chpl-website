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
      vm.participant.education = {
        name: vm.participant.educationTypeName,
        id: vm.participant.educationTypeId,
      };
      networkService.getAgeRanges()
        .then(function (result) {
          vm.ageRanges = result;
        });
      vm.participant.ageRangeObj = {
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
        return parseInt(ageRange.name.charAt(0));
      }
    }

    function save () {
      vm.participant.educationTypeName = vm.participant.education.name;
      vm.participant.educationTypeId = vm.participant.education.id;
      vm.participant.ageRange = vm.participant.ageRangeObj.name;
      vm.participant.ageRangeId = vm.participant.ageRangeObj.id;
      $uibModalInstance.close({
        participant: vm.participant,
      });
    }
  }
})();
