;(function () {
    'use strict';

    angular.module('app.decertifications')
        .controller('DecertifiedDevelopersController', ['$log', 'commonService', function ($log, commonService) {
            var vm = this;

            vm.clearFilters = clearFilters;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.decertifiedDevelopers = [];
                vm.displayedDevelopers = [];
                vm.acbs = [{name: 'ICSA Labs'}, {name: 'Drummond Group'}, {name: 'Infogard'}];
                commonService.getDecertifiedDevelopers()
                    .then(function (result) {
                        vm.decertifiedDevelopers = result.data;
                        vm.displayedDevelopers = [].concat(vm.decertifiedDevelopers);
                    });
                commonService.getSearchOptions(true)
                    .then(function (result) {
                        vm.acbs = result.certBodyNames;
                        vm.statuses = result.developerStatuses;
                    });
            }

            function clearFilters () {
                vm.filter = { acb: '', developer: '', status: '' };
            }
        }]);
})();
