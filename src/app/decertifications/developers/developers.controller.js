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
        }

        function loadDevelopers () {
            vm.modifiedDecertifiedDevelopers = [];
            for (var i = 0; i < vm.decertifiedDevelopers.length; i++) {
                vm.modifiedDecertifiedDevelopers.push({
                    acb: [],
                    decertificationDate: vm.decertifiedDevelopers[i].decertificationDate,
                    developer: vm.decertifiedDevelopers[i].developer.name,
                    status: vm.decertifiedDevelopers[i].developer.status.status
                });
                for (var j = 0; j < vm.decertifiedDevelopers[i].certifyingBody.length; j++) {
                    vm.modifiedDecertifiedDevelopers[i].acb.push(vm.decertifiedDevelopers[i].certifyingBody[j].name)
                }
            }
        }
    }
})();
