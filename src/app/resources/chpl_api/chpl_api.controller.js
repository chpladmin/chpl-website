(function () {
    'use strict';

    angular.module('chpl.chpl_api')
        .controller('ChplApiController', ChplApiController);

    /** @ngInject */
    function ChplApiController ($location, $log, API) {
        var vm = this;

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
