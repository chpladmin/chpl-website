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
            templateUrl: 'app/admin/components/schedules/schedules.html',
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

        vm.loadScheduledTriggers = loadScheduledTriggers;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.loadScheduledTriggers();
        }

        function loadScheduledTriggers () {
            vm.scheduledTrigers = [];
            networkService.getScheduleTriggers()
                .then(function (result) {
                    vm.scheduledTriggers = result.results.map(function (result) {
                        result.details = ['Schedule: ' + result.cronSchedule, 'Type: Cache Status Age Notification'];
                        return result;
                    });
                });
        }
    }
})();
