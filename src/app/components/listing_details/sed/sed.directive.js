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

        vm.getCsv = getCsv;
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

        function getCsv () {
            utilService.makeCsv(vm.csvData);
        }

        function sortProcesses (process) {
            return utilService.sortCertArray(process.criteria);
        }

        function sortTasks (task) {
            return utilService.sortCertArray(task.criteria);
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
            var cert, csvRow, i, j, k, object, participant, process, task;
            var TASK_START = 2;
            var PART_START = TASK_START + 14;
            var ROW_BASE = [vm.listing.chplProductNumber];
            object = {
                tasks: {},
                ucdProcesses: {},
            };
            vm.csvData = {
                name: vm.listing.chplProductNumber + '.sed.csv',
                values: [[
                    'CHPL Product Number', 'Certification Criteria',
                    'Task Description', 'Task Errors', 'Task Errors Standard Deviation', 'Path Deviation Observed', 'Path Deviation Optimal', 'Task Rating', 'Task Rating Standard Deviation', 'Rating Scale', 'Task Success Average', 'Task Success Standard Deviation', 'Time Average', 'Time Deviation Observed Average', 'Time Deviation Optimal Average', 'Time Standard Deviation',
                    'Age', 'Assistive Technology Needs', 'Computer Experience (Months)', 'Education Type', 'Gender', 'Occupation', 'Product Experience (Months)', 'Professional Experience (Months)',
                ]],
            };
            csvRow = angular.copy(ROW_BASE);

            vm.listing.certificationResults = vm.listing.certificationResults
                .filter(function (cert) { return cert.success && cert.sed; })
                .map(function (cert) { cert.name = cert.number; return cert; });
            vm.criteriaCount = vm.listing.certificationResults.length;

            for (i = 0; i < vm.listing.certificationResults.length; i++) {
                cert = vm.listing.certificationResults[i];
                csvRow[1] = cert.name;

                // compile criteria under tasks
                for (j = 0; j < cert.testTasks.length; j++) {
                    task = cert.testTasks[j];
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

                    if (angular.isUndefined(object.tasks[task.testTaskId])) {
                        object.tasks[task.testTaskId] = task;
                        object.tasks[task.testTaskId].criteria = [];
                    }
                    object.tasks[task.testTaskId].criteria.push(cert.number);

                    for (k = 0; k < task.testParticipants.length; k++) {
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

            vm.tasks = [];
            angular.forEach(object.tasks, function (task) {
                task.criteria = $filter('orderBy')(task.criteria, vm.sortCert);
                vm.tasks.push(task);
            });
            vm.taskCount = vm.tasks.length;

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
                    return {
                        index: i,
                        value: vm.sortCert(el[1]),
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
