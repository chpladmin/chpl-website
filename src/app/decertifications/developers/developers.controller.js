(function () {
    'use strict';

    angular.module('chpl.decertifications')
        .controller('DecertifiedDevelopersController', DecertifiedDevelopersController);

    /** @ngInject */
    function DecertifiedDevelopersController ($log, commonService) {
        var vm = this;

        vm.loadDevelopers = loadDevelopers;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.decertifiedDevelopers = [];
            vm.displayedDevelopers = [];
            commonService.getDecertifiedDevelopers()
                .then(function (result) {
                    vm.decertifiedDevelopers = result.decertifiedDeveloperResults;
                    vm.displayedDevelopers = [].concat(vm.decertifiedDevelopers);
                    vm.loadDevelopers();
                }, function () {
                    vm.decertifiedDevelopers = [];
                    vm.loadDevelopers();
                });
            commonService.getMeaningfulUseUsersAccurateAsOfDate()
                .then(function (response) {
                    vm.muuAccurateAsOf = response.accurateAsOfDate;
                });
        }

        function loadDevelopers () {
            vm.modifiedDecertifiedDevelopers = [];
            for (var i = 0; i < vm.decertifiedDevelopers.length; i++) {
                vm.modifiedDecertifiedDevelopers.push({
                    stAcb: [],
                    stDeveloper: vm.decertifiedDevelopers[i].developer.name,
                    stStatus: vm.decertifiedDevelopers[i].developer.status.status,
                    stEstimatedUsers: vm.decertifiedDevelopers[i].estimatedUsers
                });
                for (var j = 0; j < vm.decertifiedDevelopers[i].certifyingBody.length; j++) {
                    vm.modifiedDecertifiedDevelopers[i].stAcb.push(vm.decertifiedDevelopers[i].certifyingBody[j].name)
                }
            }
        }
    }
})();
