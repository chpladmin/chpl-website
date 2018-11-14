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
                    var isTokenAuth = JSON.parse(response.authorized);
                    if (!isTokenAuth) {
                        vm.message = 'This token is not valid.';
                        vm.isAuthorized = false;
                    } else {
                        vm.isAuthorized = true;
                    }
                }, function (error) {
                    $log.error(error);
                    return false;
                });
        }
    }
})();
