;(function () {
    'use strict';

    angular.module('app.resources')
        .controller('ResourcesController', ['$scope', '$log', '$location', 'API', 'authService', function($scope, $log, $location, API, authService) {
            var vm = this;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.API = API;
                vm.API_KEY = authService.getApiKey();
                if (vm.API === '/rest') {
                    vm.swaggerUrl = $location.absUrl().split('#')[0] + 'rest/api-docs';
                } else {
                    vm.swaggerUrl = vm.API + '/api-docs';
                }
            }
        }]);
})();
