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
        vm.editTrigger = editTrigger;
        vm.loadScheduledTriggers = loadScheduledTriggers;
        vm.loadScheduleJobs = loadScheduleJobs;

        ////////////////////////////////////////////////////////////////////

        this.$onInit = function () {
            vm.loadScheduledTriggers();
            vm.loadScheduleJobs();
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
                    scheduleJobs: function () { return vm.scheduleJobs; },
                },
            });
            
            vm.editTriggerInstance.result.then(function (result) {
                if (result.status === 'created') {
                    vm.loadScheduledTriggers();
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
                    scheduleJobs: function () { return vm.scheduleJobs; },
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

        function loadScheduleJobs () {
            networkService.getScheduleJobs()
                .then(function (result) {
                    vm.scheduleJobs = result.results;
                }, function (error) {
                    $log.warn('error in schedule.controller loadSubscriptionReportTypes', error);
                });
        }
    }
})();
