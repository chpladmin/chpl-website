(function () {
    'use strict';

    angular.module('chpl.admin')
        .directive('aiScheduledJobs', aiScheduledJobs)
        .controller('ScheduledJobsController', ScheduledJobsController);

    /** @ngInject */
    function aiScheduledJobs () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'chpl.admin/components/schedules/schedules.html',
            scope: {},
            bindToController: {
                acbs: '=',
            },
            controllerAs: 'vm',
            controller: 'ScheduledJobsController',
        };
    }

    /** @ngInject */
    function ScheduledJobsController ($log, $uibModal, networkService) {
        var vm = this;

        vm.createTrigger = createTrigger;
        vm.editJob = editJob;
        vm.editTrigger = editTrigger;
        vm.loadScheduledTriggers = loadScheduledTriggers;
        vm.loadScheduledJobs = loadScheduledJobs;

        ////////////////////////////////////////////////////////////////////

        this.$onInit = function () {
            vm.loadScheduledTriggers();
            vm.loadScheduledJobs();
        }

        function createTrigger () {
            vm.editTriggerInstance = $uibModal.open({
                templateUrl: 'chpl.admin/components/schedules/schedule.html',
                controller: 'ScheduleController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'md',
                resolve: {
                    trigger: function () { return {}; },
                    scheduleJobs: function () { return vm.scheduleJobs.filter(function (item) { return item.frequency; }) },
                },
            });
            vm.editTriggerInstance.result.then(function (result) {
                if (result.status === 'created') {
                    vm.loadScheduledTriggers();
                }
            });
        }

        function editJob (job) {
            vm.editJobInstance = $uibModal.open({
                templateUrl: 'chpl.admin/components/schedules/job.html',
                controller: 'JobController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'md',
                resolve: {
                    job: function () { return job; },
                },
            });
            vm.editJobInstance.result.then(function (result) {
                if (result.status === 'updated') {
                    vm.loadScheduledJobs();
                }
            });
        }

        function editTrigger (trigger) {
            vm.editTriggerInstance = $uibModal.open({
                templateUrl: 'chpl.admin/components/schedules/schedule.html',
                controller: 'ScheduleController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'md',
                resolve: {
                    trigger: function () { return trigger; },
                    scheduleJobs: function () { return vm.scheduleJobs.filter(function (item) { return item.frequency; }) },
                },
            });
            vm.editTriggerInstance.result.then(function (result) {
                if (result.status === 'updated') {
                    vm.loadScheduledTriggers();
                } else if (result.status === 'deleted') {
                    for (var i = 0; i < vm.scheduledTriggers.length; i++) {
                        if (trigger.name === vm.scheduledTriggers[i].name) {
                            vm.scheduledTriggers.splice(i,1);
                        }
                    }
                }
            });
        }

        function loadScheduledTriggers () {
            vm.scheduledTrigers = [];
            networkService.getScheduleTriggers()
                .then(function (result) {
                    vm.scheduledTriggers = result.results.map(function (result) {
                        result.details = ['Schedule: ' + result.cronSchedule, 'Type: ' + result.job.name];
                        return result;
                    });
                });
        }

        function loadScheduledJobs () {
            networkService.getScheduleJobs()
                .then(function (result) {
                    vm.scheduleJobs = result.results;
                }, function (error) {
                    $log.warn('error in schedule.controller loadSubscriptionReportTypes', error);
                });
        }
    }
})();
