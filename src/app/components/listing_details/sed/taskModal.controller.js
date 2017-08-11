(function () {
    'use strict';

    angular.module('chpl')
        .controller('ViewSedTaskController', ViewSedTaskController);

    /** @ngInject */
    function ViewSedTaskController ($log, $uibModal, $uibModalInstance, task) {
        var vm = this;

        vm.task = task;

        vm.cancel = cancel;
        vm.viewParticipants = viewParticipants;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }

        function viewParticipants () {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/components/listing_details/sed/participantsModal.html',
                controller: 'ViewSedParticipantsController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    participants: function () { return vm.task.testParticipants; },
                },
            });
        }
    }
})();
