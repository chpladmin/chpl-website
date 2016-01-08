;(function () {
    'use strict';

    angular.module('app.api')
        .controller('ApiController', ['$scope', '$log', '$location', 'apiService', 'API', function($scope, $log, $location, apiService, API) {
            var vm = this;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.apiCalls = [];
                vm.apiEntities = [];

                apiService.getApiCalls()
                    .then(function (result) {
                        vm.apiCalls = result;
                    }, function (error) {
                        $log.debug(error);
                    });

                vm.API = API;
                if (vm.API === '/rest') {
                    vm.swaggerUrl = $location.absUrl().split('#')[0] + 'rest/api-docs';
                } else {
                    vm.swaggerUrl = vm.API + '/api-docs';
                }
            }
        }]);
})();
