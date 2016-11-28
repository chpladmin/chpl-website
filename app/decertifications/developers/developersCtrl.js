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
                        vm.decertifiedDevelopers = [{acb: {name: 'ICSA Labs'}, developer: {name: 'dev 1'}, status: {name: 'Under certification ban by ONC'}},
                                                    {acb: {name: 'Drummond Group'}, developer: {name: 'dev 2'}, status: {name: 'Under certification ban by ONC'}},
                                                    {acb: {name: 'Infogard'}, developer: {name: 'dev 3'}, status: {name: 'Under certification ban by ONC'}}];
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
                vm.developers = [];
                for (var i = 0; i < vm.decertifiedDevelopers.length; i++) {
                    vm.developers.push(vm.decertifiedDevelopers[i].developer);
                }
            }

            function clearFilters () {
                vm.filter = { acb: '', developer: '', status: '' };
            }
        }]);
})();
