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
            templateUrl: 'app/admin/components/jobs/jobs.html',
        };
        return directive;
    }

    /** @ngInject */
    function JobsManagementController ($log, networkService) {
        var vm = this;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            networkService.getJobs().then(function (response) {
                vm.jobs = response.results;
            });
            networkService.getJobTypes().then(function (response) {
                vm.jobTypes = response;
            });
        }
    }
})();
