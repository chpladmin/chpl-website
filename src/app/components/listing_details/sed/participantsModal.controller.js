(function () {
    'use strict';

    angular.module('chpl')
        .controller('ViewSedParticipantsController', ViewSedParticipantsController);

    /** @ngInject */
    function ViewSedParticipantsController ($uibModalInstance, participants) {
        var vm = this;

        vm.participants = participants;

        vm.cancel = cancel;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }
    }
})();
