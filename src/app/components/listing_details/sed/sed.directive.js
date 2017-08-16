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
                editMode: '=?',
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
    function SedController ($filter, $log, $scope, $uibModal, utilService) {
        var vm = this;

        vm.addTask = addTask;
        vm.editDetails = editDetails;
        vm.getCsv = getCsv;
        vm.sortCert = utilService.sortCert;
        vm.sortProcesses = sortProcesses;
        vm.sortTasks = sortTasks;
        vm.viewParticipants = viewParticipants;
        vm.viewTask = viewTask;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            analyzeCriteria();
        }

        function addTask () {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/admin/components/sed/editTask.html',
                controller: 'EditSedTaskController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    criteria: function () { return vm.sedCriteria; },
                    participants: function () { return vm.allParticipants; },
                    task: function () { return {}; },
                },
            });
            vm.modalInstance.result.then(function (result) {
                vm.allParticipants = result.participants;
                vm.tasks.push(result.task);
            });
        }

        function editDetails () {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/admin/components/sed/editDetails.html',
                controller: 'EditSedDetailsController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    criteria: function () { return vm.sedCriteria; },
                    listing: function () { return vm.listing; },
                    ucdProcesses: function () { return vm.ucdProcesses; },
                },
            });
            vm.modalInstance.result.then(function (result) {
                vm.listing = result.listing;
                vm.ucdProcesses = result.ucdProcesses;
            });
        }

        function getCsv () {
            utilService.makeCsv(vm.csvData);
        }

        function sortProcesses (process) {
            return utilService.sortCertArray(process.criteria);
        }

        function sortTasks (task) {
            return utilService.sortCertArray(task.criteria);
        }

        function viewParticipants (task) {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/components/listing_details/sed/participantsModal.html',
                controller: 'ViewSedParticipantsController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    allParticipants: function () { return vm.allParticipants; },
                    editMode: function () { return vm.editMode; },
                    participants: function () { return task.testParticipants; },
                },
            });
            vm.modalInstance.result.then(function (result) {
                for (var i = 0; i < vm.tasks.length; i++) {
                    if (vm.tasks[i].testTaskId === task.testTaskId) {
                        vm.tasks[i].testParticipants = result.participants;
                    }
                }
                vm.allParticipants = result.allParticipants;
            });
        }

        function viewTask (task) {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/components/listing_details/sed/taskModal.html',
                controller: 'ViewSedTaskController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    criteria: function () { return vm.sedCriteria; },
                    editMode: function () { return vm.editMode; },
                    participants: function () { return vm.allParticipants; },
                    task: function () { return task; },
                },
            });
            vm.modalInstance.result.then(function (result) {
                for (var i = 0; i < vm.tasks.length; i++) {
                    if (vm.tasks[i].testTaskId === task.testTaskId) {
                        if (result.deleted) {
                            vm.tasks.splice(i, 1);
                            vm.taskCount = vm.tasks.length;
                        } else {
                            vm.tasks[i] = result.task;
                        }
                    }
                }
                vm.allParticipants = result.participants;
            });
        }

        ////////////////////////////////////////////////////////////////////

        function analyzeCriteria () {
            var cert, csvRow, i, j, k, object, participant, process, task;
            var TASK_START = 5;
            var PART_START = TASK_START + 14;
            var ROW_BASE = [
                vm.listing.chplProductNumber,
                vm.listing.developer.name,
                vm.listing.product.name,
                vm.listing.version.version,
            ];
            object = {
                participants: {},
                tasks: {},
                ucdProcesses: {},
            };
            vm.csvData = {
                name: vm.listing.chplProductNumber + '.sed.csv',
                values: [[
                    'Unique CHPL ID', 'Developer', 'Product', 'Version', 'Certification Criteria',
                    'Task Description', 'Task Errors', 'Task Errors Standard Deviation', 'Path Deviation Observed', 'Path Deviation Optimal', 'Task Rating', 'Task Rating Standard Deviation', 'Rating Scale', 'Task Success Average', 'Task Success Standard Deviation', 'Time Average', 'Time Deviation Observed Average', 'Time Deviation Optimal Average', 'Time Standard Deviation',
                    'Age', 'Assistive Technology Needs', 'Computer Experience (Months)', 'Education Type', 'Gender', 'Occupation', 'Product Experience (Months)', 'Professional Experience (Months)',
                ]],
            };

            vm.sedCriteria = vm.listing.certificationResults
                .filter(function (cert) { return cert.success && cert.sed; })
                .map(function (cert) { cert.name = cert.number; return cert; });
            vm.criteriaCount = vm.sedCriteria.length;

            for (i = 0; i < vm.sedCriteria.length; i++) {
                cert = vm.sedCriteria[i];

                // compile criteria under tasks
                for (j = 0; j < cert.testTasks.length; j++) {
                    task = cert.testTasks[j];

                    if (angular.isUndefined(object.tasks[task.testTaskId])) {
                        object.tasks[task.testTaskId] = task;
                        object.tasks[task.testTaskId].criteria = [];
                    }
                    object.tasks[task.testTaskId].criteria.push(cert.number);

                    for (k = 0; k < task.testParticipants.length; k++) {
                        participant = task.testParticipants[k];

                        if (angular.isUndefined(object.participants[participant.testParticipantId])) {
                            object.participants[participant.testParticipantId] = participant;
                            object.participants[participant.testParticipantId].tasks = [];
                        }
                        object.participants[participant.testParticipantId].tasks.push(task.testTaskId);
                    }
                }

                // compile criteria under ucdProcesses
                for (j = 0; j < cert.ucdProcesses.length; j++) {
                    process = cert.ucdProcesses[j];
                    if (angular.isUndefined(object.ucdProcesses[process.ucdProcessId])) {
                        object.ucdProcesses[process.ucdProcessId] = process;
                        object.ucdProcesses[process.ucdProcessId].criteria = [];
                    }
                    object.ucdProcesses[process.ucdProcessId].criteria.push(cert.number);
                }
            }

            csvRow = angular.copy(ROW_BASE);
            vm.tasks = [];
            angular.forEach(object.tasks, function (task) {
                task.criteria = $filter('orderBy')(task.criteria, vm.sortCert);

                csvRow[4] = task.criteria.join(';');
                csvRow[TASK_START + 0] = task.description;
                csvRow[TASK_START + 1] = task.taskErrors;
                csvRow[TASK_START + 2] = task.taskErrorsStddev;
                csvRow[TASK_START + 3] = task.taskPathDeviationObserved;
                csvRow[TASK_START + 4] = task.taskPathDeviationOptimal;
                csvRow[TASK_START + 5] = task.taskRating;
                csvRow[TASK_START + 6] = task.taskRatingStddev;
                csvRow[TASK_START + 7] = task.taskRatingScale;
                csvRow[TASK_START + 8] = task.taskSuccessAverage;
                csvRow[TASK_START + 9] = task.taskSuccessStddev;
                csvRow[TASK_START + 10] = task.taskTimeAvg;
                csvRow[TASK_START + 11] = task.taskTimeDeviationObservedAvg;
                csvRow[TASK_START + 12] = task.taskTimeDeviationOptimalAvg;
                csvRow[TASK_START + 13] = task.taskTimeStddev;

                for (var k = 0; k < task.testParticipants.length; k++) {
                    participant = task.testParticipants[k];
                    csvRow[PART_START + 0] = participant.ageRange;
                    csvRow[PART_START + 1] = participant.assistiveTechnologyNeeds;
                    csvRow[PART_START + 2] = participant.computerExperienceMonths;
                    csvRow[PART_START + 3] = participant.educationTypeName;
                    csvRow[PART_START + 4] = participant.gender;
                    csvRow[PART_START + 5] = participant.occupation;
                    csvRow[PART_START + 6] = participant.productExperienceMonths;
                    csvRow[PART_START + 7] = participant.professionalExperienceMonths;

                    vm.csvData.values.push(angular.copy(csvRow));
                }
                vm.tasks.push(task);
            });
            vm.taskCount = vm.tasks.length;

            vm.allParticipants = [];
            angular.forEach(object.participants, function (participant) {
                vm.allParticipants.push(participant);
            });

            vm.ucdProcesses = [];
            angular.forEach(object.ucdProcesses, function (process) {
                process.criteria = $filter('orderBy')(process.criteria, vm.sortCert);
                vm.ucdProcesses.push(process);
            });

            vm.csvData.values = csvSort(vm.csvData.values);
        }

        function csvSort (data) {
            var mapped = data.map(function (el, i) {
                if (i === 0) {
                    return {
                        index: 0,
                        value: Number.MIN_VALUE,
                    }
                } else {
                    var vals = el[4].split(';');
                    return {
                        index: i,
                        value: vals.reduce(function (sum, cur) { return sum + vm.sortCert(cur); }, 0),
                    }
                }
            });

            mapped.sort(function (a, b) {
                if (a.value < b.value) {
                    return -1;
                }
                if (a.value > b.value) {
                    return 1;
                }
                return 0;
            });

            var ret = mapped.map(function (el) {
                return data[el.index];
            });

            return ret;
        }
    }
})();
