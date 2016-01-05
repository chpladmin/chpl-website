;(function () {
    'use strict';

    angular.module('app.nav')
        .controller('ProductListingController', ['API', 'authService', function (API, authService) {
            var vm = this;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.API = API;
                vm.API_KEY = authService.getApiKey();
            }
        }]);
})();
