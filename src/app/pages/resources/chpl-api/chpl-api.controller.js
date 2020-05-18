(function () {
    'use strict';

    angular.module('chpl.resources')
        .controller('ChplApiController', ChplApiController);

    /** @ngInject */
    function ChplApiController ($location, $log, API, featureFlags) {
        var vm = this;

        vm.isOn = featureFlags.isOn;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.API = API;
            if (vm.API === '/rest') {
                vm.swaggerUrl = $location.absUrl().split('#')[0] + 'rest/api-docs';
            } else {
                vm.swaggerUrl = vm.API + '/api-docs';
            }
        }
    }
})();
