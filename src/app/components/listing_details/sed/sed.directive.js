(function () {
    'use strict';

    angular
        .module('chpl.components')
        .directive('aiSed', aiSed)
        .controller('SedController', SedController);

    /** @ngInject */
    function aiSed () {
        var directive = {
            bindToController: {
                criteriaCount: '=?',
                editMode: '=?',
                listing: '=',
                refresh: '&?',
                resources: '=?',
                taskCount: '=?',
            },
            controller: 'SedController',
            controllerAs: 'vm',
            link: function (scope, element, attr, ctrl) {
                if (ctrl.refresh) {
                    var handler = ctrl.refresh({
                        handler: function () {
                            ctrl._analyzeSed();
                        },
                    });
                    scope.$on('$destroy', handler);
                }
            },
            replace: true,
            restrict: 'E',
            scope: {},
            templateUrl: 'app/components/listing_details/sed/sed.html',
        };
        return directive;
    }

    /** @ngInject */
    function SedController ($filter, $log, $scope, $timeout, $uibModal, utilService) {
        var vm = this;

        vm.addTask = addTask;
        vm.editDetails = editDetails;
        vm.getCsv = getCsv;
        vm.sortCert = utilService.sortCert;
        vm.sortProcesses = sortProcesses;
        vm.sortTasks = sortTasks;
        vm.viewParticipants = viewParticipants;
        vm.viewTask = viewTask;

        

        ////////////////////////////////////////////////////////////////////

        this.$onInit = function () {
            _analyzeSed();
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
                vm.taskCount = vm.tasks.length;
            });
        }

        function editDetails () {
            _analyzeSed();
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
                    resources: function () { return vm.resources; },
                    ucdProcesses: function () { return vm.ucdProcesses; },
                },
            });
            vm.modalInstance.result.then(function (result) {
                vm.listing.sedReportFileLocation = result.listing.sedReportFileLocation;
                vm.listing.sedIntendedUserDescription = result.listing.sedIntendedUserDescription;
                vm.listing.sedTestingEndDate = result.listing.sedTestingEndDate;
                vm.listing.sed.ucdProcesses = result.ucdProcesses;
                vm.ucdProcesses = result.ucdProcesses;
            });
        }

        function getCsv () {
            utilService.makeCsv(vm.csvData);
        }

        function sortProcesses (process) {
            return utilService.sortCertArray(process.criteria.map(function (item) { return item.number; }));
        }

        function sortTasks (task) {
            return utilService.sortCertArray(task.criteria.map(function (item) { return item.number; }));
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
                    if (vm.tasks[i].id === task.id) {
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
                    if (vm.tasks[i].id === task.id) {
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

        vm._analyzeSed = _analyzeSed;

        function _analyzeSed () {
            if (!vm.listing.chplProductNumber ||
                !vm.listing.developer ||
                !vm.listing.product ||
                !vm.listing.version ||
                !vm.listing.certificationResults ||
                !vm.listing.sed) {
                $timeout(_analyzeSed, 500);
            } else {
                var csvRow, i, j, object, participant, task;
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
                };
                vm.csvData = {
                    name: vm.listing.chplProductNumber + '.sed.csv',
                    values: [[
                        'Unique CHPL ID', 'Developer', 'Product', 'Version', 'Certification Criteria',
                        'Task Description', 'Rating Scale', 'Task Rating', 'Task Rating - Standard Deviation', 'Task Time Mean (s)', 'Task Time - Standard Deviation (s)', 'Task Time Deviation - Observed (s)', 'Task Time Deviation - Optimal (s)', 'Task Success - Mean (%)', 'Task Success - Standard Deviation (%)', 'Task Errors - Mean (%)', 'Task Errors - Standard Deviation (%)', 'Task Path Deviation - Observed (# of Steps)', 'Task Path Deviation - Optimal (# of Steps)',
                        'Occupation', 'Education Type', 'Product Experience (Months)', 'Professional Experience (Months)', 'Computer Experience (Months)', 'Age (Years)', 'Gender', 'Assistive Technology Needs',
                    ]],
                };

                vm.sedCriteria = vm.listing.certificationResults
                    .filter(function (cert) { return cert.success && cert.sed; })
                    .map(function (cert) { cert.name = cert.number; return cert; });
                vm.criteriaCount = vm.sedCriteria.length;
                vm.sedCriteriaNumbers = vm.sedCriteria.map(function (cert) { return cert.number; });

                csvRow = angular.copy(ROW_BASE);

                vm.tasks = vm.listing.sed.testTasks;
                for (i = 0; i < vm.tasks.length; i++) {
                    task = vm.tasks[i];
                    if (!task.id) {
                        task.id = i * -1 - 1;
                    }
                    task.criteria = $filter('orderBy')(task.criteria.filter(function (cert) { return vm.sedCriteriaNumbers.indexOf(cert.number) > -1; }), vm.sortCert);

                    csvRow[4] = task.criteria.map(function (item) { return item.number; }).join(';');
                    csvRow[TASK_START + 0] = task.description;
                    csvRow[TASK_START + 1] = task.taskRatingScale;
                    csvRow[TASK_START + 2] = task.taskRating;
                    csvRow[TASK_START + 3] = task.taskRatingStddev;
                    csvRow[TASK_START + 4] = task.taskTimeAvg;
                    csvRow[TASK_START + 5] = task.taskTimeStddev;
                    csvRow[TASK_START + 6] = task.taskTimeDeviationObservedAvg;
                    csvRow[TASK_START + 7] = task.taskTimeDeviationOptimalAvg;
                    csvRow[TASK_START + 8] = task.taskSuccessAverage;
                    csvRow[TASK_START + 9] = task.taskSuccessStddev;
                    csvRow[TASK_START + 10] = task.taskErrors;
                    csvRow[TASK_START + 11] = task.taskErrorsStddev;
                    csvRow[TASK_START + 12] = task.taskPathDeviationObserved;
                    csvRow[TASK_START + 13] = task.taskPathDeviationOptimal;
                    for (j = 0; j < task.testParticipants.length; j++) {
                        participant = task.testParticipants[j];
                        if (!participant.id) {
                            participant.id = participant.uniqueId;
                        }

                        if (angular.isUndefined(object.participants[participant.id])) {
                            object.participants[participant.id] = participant;
                            object.participants[participant.id].tasks = [];
                        }
                        object.participants[participant.id].tasks.push(task.id);
                        csvRow[PART_START + 0] = participant.occupation;
                        csvRow[PART_START + 1] = participant.educationTypeName;
                        csvRow[PART_START + 2] = participant.productExperienceMonths;
                        csvRow[PART_START + 3] = participant.professionalExperienceMonths;
                        csvRow[PART_START + 4] = participant.computerExperienceMonths;
                        csvRow[PART_START + 5] = participant.ageRange;
                        csvRow[PART_START + 6] = participant.gender;
                        csvRow[PART_START + 7] = participant.assistiveTechnologyNeeds;

                        vm.csvData.values.push(angular.copy(csvRow));
                    }
                }

                vm.taskCount = vm.tasks.length;

                var partMap = {};
                vm.allParticipants = [];
                angular.forEach(object.participants, function (participant) {
                    var val = angular.copy(participant);
                    if (val.uniqueId) {
                        val.id = vm.allParticipants.length * -1 - 1;
                        partMap[val.uniqueId] = val.id
                    }
                    vm.allParticipants.push(val);
                });
                for (i = 0; i < vm.tasks.length; i++) {
                    task = vm.tasks[i];
                    for (j = 0; j < task.testParticipants.length; j++) {
                        participant = task.testParticipants[j];
                        if (participant.uniqueId) {
                            participant.id = partMap[participant.uniqueId];
                        }
                    }
                }

                vm.ucdProcesses = vm.listing.sed.ucdProcesses.map(function (item) {
                    item.criteria = $filter('orderBy')(item.criteria.filter(function (cert) {
                        var loc = vm.sedCriteriaNumbers.indexOf(cert.number);
                        if (loc > -1) {
                            vm.sedCriteria[loc].found = true;
                            return true;
                        }
                        return false;
                    }), vm.sortCert);
                    return item;
                }).concat([{
                    name: undefined,
                    details: undefined,
                    criteria: $filter('orderBy')(vm.sedCriteria.filter(function (cert) { return !cert.found; }), vm.sortCert),
                }]).filter(function (item) { return item.criteria.length > 0; });

                vm.csvData.values = csvSort(vm.csvData.values);
            }
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
