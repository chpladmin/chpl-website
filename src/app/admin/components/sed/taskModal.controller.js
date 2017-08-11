(function () {
    'use strict';

    angular.module('chpl')
        .controller('EditSedTaskController', EditSedTaskController);

    /** @ngInject */
    function EditSedTaskController ($log, $uibModal, $uibModalInstance, task) {
        var vm = this;

        vm.addParticipant = addParticipant;
        vm.cancel = cancel;
        vm.changed = changed;
        vm.editParticipant = editParticipant;
        vm.removeParticipant = removeParticipant
        vm.save = save;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.task = task;
        }

        function addParticipant () {
            vm.editModalInstance = $uibModal.open({
                templateUrl: 'app/admin/components/sed/participantModal.html',
                controller: 'EditSedParticipantController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    participant: function () { return {}; },
                },
            });
            vm.editModalInstance.result.then(function (result) {
                if (vm.task.testParticipants === null || angular.isUndefined(vm.task.testParticipants)) {
                    vm.task.testParticipants = [];
                }
                vm.task.testParticipants.push(result);
            }, function (result) {
                if (result !== 'cancelled') {
                    $log.info('dismissed', result);
                }
            });
        }

        function cancel () {
            if (vm.task.changed) {
                delete (vm.task.changed);
            }
            $uibModalInstance.dismiss('cancelled');
        }

        function changed () {
            if (vm.task.id) {
                vm.task.changed = true;
            }
        }

        function editParticipant (participant, idx) {
            vm.editModalInstance = $uibModal.open({
                templateUrl: 'app/admin/components/sed/participantModal.html',
                controller: 'EditSedParticipantController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    participant: function () { return participant; },
                },
            });
            vm.editModalInstance.result.then(function (result) {
                vm.task.testParticipants[idx] = result;
            }, function (result) {
                if (result !== 'cancelled') {
                    $log.info('dismissed', result);
                }
            });
        }

        function removeParticipant (idx) {
            vm.task.testParticipants.splice(idx,1);
        }

        function save () {
            $uibModalInstance.close(vm.task);
        }
    }
})();
