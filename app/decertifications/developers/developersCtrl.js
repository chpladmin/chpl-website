;(function () {
    'use strict';

    angular.module('app.decertifications')
        .controller('DecertifiedDevelopersController', ['$log', 'commonService', function ($log, commonService) {
            var vm = this;

            vm.clearFilters = clearFilters;
            vm.loadDevelopers = loadDevelopers;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.decertifiedDevelopers = [];
                vm.displayedDevelopers = [];
                vm.developers = [];
                vm.acbs = [{name: 'ICSA Labs'}, {name: 'Drummond Group'}, {name: 'Infogard'}];
                commonService.getDecertifiedDevelopers()
                    .then(function (result) {
                        vm.decertifiedDevelopers = result.data;
                        vm.displayedDevelopers = [].concat(vm.decertifiedDevelopers);
                        vm.loadDevelopers();
                    }, function (error) {
                        // debug
                        vm.decertifiedDevelopers = [{acb: {name: 'ICSA Labs'}, developer: {name: 'dev 1'}, status: {name: 'Under certification ban by ONC'}, estimatedUsers: 5},
                                                    {acb: {name: 'Drummond Group'}, developer: {name: 'dev 2'}, status: {name: 'Under certification ban by ONC'}, estimatedUsers: 3},
                                                    {acb: {name: 'Infogard'}, developer: {name: 'dev 3'}, status: {name: 'Terminated by ONC'}, estimatedUsers: 10}];
                        vm.loadDevelopers();
                    });
                commonService.getSearchOptions(true)
                    .then(function (result) {
                        vm.acbs = result.certBodyNames;
                        vm.statuses = result.developerStatuses;

                        //debug
                        vm.statuses = [{name: 'Under certification ban by ONC'}, {name: 'Terminated by ONC'}]
                    });
            }

            function loadDevelopers () {
                vm.modifiedDecertifiedDevelopers = [];
                for (var i = 0; i < vm.decertifiedDevelopers.length; i++) {
                    vm.modifiedDecertifiedDevelopers.push({
                        stAcb: vm.decertifiedDevelopers[i].acb.name,
                        stDeveloper: vm.decertifiedDevelopers[i].developer.name,
                        stStatus: vm.decertifiedDevelopers[i].status.name,
                        stEstimatedUsers: vm.decertifiedDevelopers[i].estimatedUsers
                    });
                }
            }

            function clearFilters () {
                vm.filter = { acb: '', developer: '', status: '' };
            }
        }]);
})();
