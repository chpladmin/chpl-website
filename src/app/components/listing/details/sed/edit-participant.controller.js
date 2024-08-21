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
      networkService.getAgeRanges()
        .then(function (result) {
          vm.ageRanges = result;
        });
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
      $uibModalInstance.close({
        participant: vm.participant,
      });
    }
  }
})();
