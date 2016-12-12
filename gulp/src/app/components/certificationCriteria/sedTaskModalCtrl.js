(function () {
    'use strict';

    angular.module('chpl.common')
        .controller('EditSedTaskController', EditSedTaskController);

    /** @ngInject */
    function EditSedTaskController ($modalInstance, $modal, $log, task) {
        var vm = this;

        vm.task = task.task;

        vm.addParticipant = addParticipant;
        vm.cancel = cancel;
        vm.changed = changed;
        vm.editParticipant = editParticipant;
        vm.removeParticipant = removeParticipant
        vm.save = save;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
        }

        function addParticipant () {
            vm.editModalInstance = $modal.open({
                templateUrl: 'app/components/certificationCriteria/sedParticipantModal.html',
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
                if (vm.task.testParticipants === null || angular.isUndefined(vm.task.testParticipants))
                    vm.task.testParticipants = [];
                vm.task.testParticipants.push(result);
            }, function (result) {
                if (result !== 'cancelled') {
                    $log.debug('dismissed', result);
                }
            });
        }

        function cancel () {
            if (vm.task.changed) {
                delete (vm.task.changed);
            }
            $modalInstance.dismiss('cancelled');
        }

        function changed () {
            if (vm.task.id) {
                vm.task.changed = true;
            }
        }

        function editParticipant (participant, idx) {
            vm.editModalInstance = $modal.open({
                templateUrl: 'common/components/certificationCriteria/sedParticipantModal.html',
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
                    $log.debug('dismissed', result);
                }
            });
        }

        function removeParticipant (idx) {
            vm.task.testParticipants.splice(idx,1);
        }

        function save () {
            $modalInstance.close(vm.task);
        }
    }
})();
