;(function () {
    'use strict';

    angular.module('app.api')
        .controller('ApiController', ['$scope', '$log', 'apiService', 'API', function($scope, $log, apiService, API) {
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

                vm.swaggerUrl = vm.API + '/api-docs';
            }
        }]);
})();
