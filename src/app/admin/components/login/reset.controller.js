(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('ResetController', ResetController);

    /** @ngInject */
    function ResetController ($location, $log, $routeParams, networkService) {
        var vm = this;

        vm.authorizeToken = authorizeToken;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.userToken = $routeParams.token;
            vm.authorizeToken();
        }

        function authorizeToken () {
            networkService.authorizeToken(vm.userToken)
                .then(function (response) {
                    vm.isAuthorized = response.data;
                    $log.info(response.data);
                }, function (error) {
                    vm.isAuthorized = error.data;
                    $log.error(error);
                });
        }
    }
})();
