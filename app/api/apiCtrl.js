;(function () {
    'use strict';

    angular.module('app.api')
        .controller('ApiController', ['$scope', '$log', '$location', 'API', function($scope, $log, $location, API) {
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
        }]);
})();
