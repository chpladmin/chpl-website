;(function () {
    'use strict';

    angular.module('app.common')
        .controller('EditSedTaskController', ['$modalInstance', '$modal', 'task', function ($modalInstance, $modal, task) {
            var vm = this;

            vm.task = task.task;

            vm.addParticipant = addParticipant;
            vm.cancel = cancel;
            vm.editParticipant = editParticipant;
            vm.removeParticipant = removeParticipant
            vm.save = save;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
            }

            function addParticipant () {
                vm.editModalInstance = $modal.open({
                    templateUrl: 'common/components/sedParticipantModal.html',
                    controller: 'EditSedParticipantController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        participant: function () { return { participant: {} }; }
                    }
                });
                vm.editModalInstance.result.then(function (result) {
                    if (vm.task.testParticipants === null || vm.task.testParticipants === undefined)
                        vm.task.testParticipants = [];
                    vm.task.testParticipants.push(result);
                }, function (result) {
                    if (result !== 'cancelled') {
                        console.debug('dismissed', result);
                    }
                });
            }

            function cancel () {
                $modalInstance.dismiss('cancelled');
            }

            function editParticipant (participant, idx) {
                vm.editModalInstance = $modal.open({
                    templateUrl: 'common/components/sedParticipantModal.html',
                    controller: 'EditSedParticipantController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        participant: function () { return {'participant': participant}; }
                    }
                });
                vm.editModalInstance.result.then(function (result) {
                    vm.task.testParticipants[idx] = result;
                }, function (result) {
                    if (result !== 'cancelled') {
                        console.debug('dismissed', result);
                    }
                });
            }

            function removeParticipant (idx) {
                vm.task.testParticipants.splice(idx,1);
            }

            function save () {
                $modalInstance.close(vm.task);
            }
        }]);
})();
