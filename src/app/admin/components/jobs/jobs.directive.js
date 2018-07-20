(function () {
    'use strict';

    angular
        .module('chpl.admin')
        .directive('aiJobsManagement', aiJobsManagement)
        .controller('JobsManagementController', JobsManagementController);

    /** @ngInject */
    function aiJobsManagement () {
        var directive = {
            bindToController: {},
            controller: 'JobsManagementController',
            controllerAs: 'vm',
            replace: true,
            restrict: 'E',
            scope: {},
            templateUrl: 'chpl.admin/components/jobs/jobs.html',
        };
        return directive;
    }

    /** @ngInject */
    function JobsManagementController ($log, $scope, $timeout, networkService) {
        var vm = this;

        vm.JOB_REFRESH_TIMEOUT_INACTIVE = 30; // seconds
        vm.JOB_REFRESH_TIMEOUT_ACTIVE = 5; // seconds

        

        ////////////////////////////////////////////////////////////////////

        this.$onInit = function () {
            networkService.getJobTypes().then(function (response) {
                vm.jobTypes = response;
            });
            _getJobs();
        }

        ////////////////////////////////////////////////////////////////////

        function _getJobs () {
            networkService.getJobs().then(function (response) {
                vm.jobs = response.results;
                var hasActive = vm.jobs.reduce(function (hasActive, item) { return hasActive || !item.status || item.status.status === 'In Progress'; }, false);
                if (hasActive) {
                    vm.jobRefresh = $timeout(_getJobs, vm.JOB_REFRESH_TIMEOUT_ACTIVE * 1000);
                } else {
                    vm.jobRefresh = $timeout(_getJobs, vm.JOB_REFRESH_TIMEOUT_INACTIVE * 1000);
                }
            });
            $scope.$on('$destroy', function () {
                $timeout.cancel(vm.jobRefresh);
            });
        }
    }
})();
