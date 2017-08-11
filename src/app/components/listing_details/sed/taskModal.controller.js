(function () {
    'use strict';

    angular.module('chpl')
        .controller('ViewSedTaskController', ViewSedTaskController);

    /** @ngInject */
    function ViewSedTaskController ($log, $uibModal, $uibModalInstance, editMode, participants, task) {
        var vm = this;

        vm.cancel = cancel;
        vm.editTask = editTask;
        vm.viewParticipants = viewParticipants;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.editMode = editMode;
            vm.participants = participants;
            vm.task = task;
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }

        function editTask () {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/admin/components/sed/taskModal.html',
                controller: 'EditSedTaskController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
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
                    editMode: function () { return vm.editMode; },
                    participants: function () { return vm.task.testParticipants; },
                },
            });
        }
    }
})();
