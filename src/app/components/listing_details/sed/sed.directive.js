(function () {
    'use strict';

    angular
        .module('chpl')
        .directive('aiSed', aiSed)
        .controller('SedController', SedController);

    /** @ngInject */
    function aiSed () {
        var directive = {
            bindToController: {
                criteriaCount: '=?',
                listing: '=',
                taskCount: '=?',
            },
            controller: 'SedController',
            controllerAs: 'vm',
            replace: true,
            restrict: 'E',
            scope: {},
            templateUrl: 'app/components/listing_details/sed/sed.html',
        };
        return directive;
    }

    /** @ngInject */
    function SedController ($filter, $log, $uibModal, utilService) {
        var vm = this;

        vm.sortCert = utilService.sortCert;
        vm.sortProcesses = sortProcesses;
        vm.sortTasks = sortTasks;
        vm.viewDetails = viewDetails;
        vm.viewParticipants = viewParticipants;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            analyzeCriteria();
        }

        function sortProcesses (process) {
            return utilService.sortCerts(process.criteria);
        }

        function sortTasks (task) {
            return utilService.sortCerts(task.criteria);
        }

        function viewDetails (task) {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/components/listing_details/sed/view/taskModal.html',
                controller: 'ViewSedTaskController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    task: function () { return task; },
                },
            });
        }

        function viewParticipants (task) {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/components/listing_details/sed/view/participantsModal.html',
                controller: 'ViewSedParticipantsController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    participants: function () { return task.testParticipants; },
                },
            });
        }

        ////////////////////////////////////////////////////////////////////

        function analyzeCriteria () {
            var cert, i, j, object, process, task;
            object = {
                tasks: {},
                ucdProcesses: {},
            };
            vm.criteriaCount = 0;
            for (i = 0; i < vm.listing.certificationResults.length; i++) {
                cert = vm.listing.certificationResults[i];
                if (cert.success && cert.sed) {
                    vm.criteriaCount += 1;
                    cert.name = cert.number;

                    // compile criteria under tasks
                    for (j = 0; j < cert.testTasks.length; j++) {
                        task = cert.testTasks[j];
                        if (angular.isUndefined(object.tasks[task.testTaskId])) {
                            object.tasks[task.testTaskId] = task;
                            object.tasks[task.testTaskId].criteria = [];
                        }
                        object.tasks[task.testTaskId].criteria.push(cert.number);
                        object.tasks[task.testTaskId].criteria = $filter('orderBy')(object.tasks[task.testTaskId].criteria, vm.sortCert);
                    }

                    // compile criteria under ucdProcesses
                    for (j = 0; j < cert.ucdProcesses.length; j++) {
                        process = cert.ucdProcesses[j];
                        if (angular.isUndefined(object.ucdProcesses[process.ucdProcessId])) {
                            object.ucdProcesses[process.ucdProcessId] = process;
                            object.ucdProcesses[process.ucdProcessId].criteria = [];
                        }
                        object.ucdProcesses[process.ucdProcessId].criteria.push(cert.number);
                        object.ucdProcesses[process.ucdProcessId].criteria = $filter('orderBy')(object.ucdProcesses[process.ucdProcessId].criteria, vm.sortCert);
                    }
                }
            }

            vm.tasks = [];
            angular.forEach(object.tasks, function (task) {
                vm.tasks.push(task);
            });
            vm.taskCount = vm.tasks.length;

            vm.ucdProcesses = [];
            angular.forEach(object.ucdProcesses, function (process) {
                vm.ucdProcesses.push(process);
            });
        }
    }
})();
