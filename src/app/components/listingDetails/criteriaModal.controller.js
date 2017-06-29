(function () {
    'use strict';

    angular.module('chpl')
        .controller('EditCertificationCriteriaController', EditCertificationCriteriaController);

    /** @ngInject */
    function EditCertificationCriteriaController ($log, $uibModal, $uibModalInstance, cert, hasIcs, resources, utilService) {
        var vm = this;

        vm.cert = cert;

        vm.addNewValue = addNewValue;
        vm.addTask = addTask;
        vm.cancel = cancel;
        vm.editTask = editTask;
        vm.extendSelect = extendSelect;
        vm.isToolAvailable = isToolAvailable;
        vm.save = save;
        vm.removeTask = removeTask;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.options = [
                {name: 'True', value: true},
                {name: 'False', value: false},
                {name: 'N/A', value: null},
            ];
            vm.allMeasures = [
                {abbreviation: 'MD'},
                {abbreviation: 'LP'},
            ];
            vm.cert.metViaAdditionalSoftware = vm.cert.additionalSoftware && vm.cert.additionalSoftware.length > 0;
            vm.hasIcs = hasIcs;
            vm.resources = resources;
        }

        function addNewValue (array, object) {
            if (!array) {
                array = [];
            }
            if (object && object !== {}) {
                array.push(angular.copy(object));
            }
        }

        function addTask () {
            vm.editUibModalInstance = $uibModal.open({
                templateUrl: 'app/components/listingDetails/sed/taskModal.html',
                controller: 'EditSedTaskController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    task: function () { return { task: {} }; },
                },
            });
            vm.editUibModalInstance.result.then(function (result) {
                if (vm.cert.testTasks === null) {
                    vm.cert.testTasks = [];
                }
                vm.cert.testTasks.push(result);
            }, function (result) {
                if (result !== 'cancelled') {
                    $log.debug('dismissed', result);
                }
            });
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }

        function editTask (task, idx) {
            vm.editUibModalInstance = $uibModal.open({
                templateUrl: 'app/components/listingDetails/sed/taskModal.html',
                controller: 'EditSedTaskController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    task: function () { return {'task': task}; },
                },
            });
            vm.editUibModalInstance.result.then(function (result) {
                vm.cert.testTasks[idx] = result;
            }, function (result) {
                if (result !== 'cancelled') {
                    $log.debug('dismissed', result);
                }
            });
        }

        function extendSelect (options, value) {
            options = utilService.extendSelect(options, value);
        }

        function isToolAvailable (tool) {
            return vm.hasIcs || !tool.retired;
        }

        function removeTask (idx) {
            vm.cert.testTasks.splice(idx,1);
        }

        function save () {
            $uibModalInstance.close(vm.cert);
        }
    }
})();
