(function () {
    'use strict';

    angular.module('chpl')
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
            vm.task = task;
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
                templateUrl: 'app/admin/components/sed/taskModal.html',
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
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/components/listing_details/sed/participantsModal.html',
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
            vm.modalInstance.result.then(function (result) {
                vm.task.testParticipants = result.participants;
                vm.participants = result.allParticipants;
            });
        }
    }
})();
