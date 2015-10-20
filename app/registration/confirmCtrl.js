;(function () {
    'use strict';

    angular.module('app.registration')
        .controller('ConfirmController', ['$log', '$routeParams', '$location', 'commonService', function ($log, $routeParams, $location, commonService) {
            var vm = this;
            vm.userDetails = {user:{}};
            vm.userDetails.hash = $routeParams.hash;

            vm.confirmUser = confirmUser;

            ////////////////////////////////////////////////////////////////////

            function confirmUser () {
                commonService.confirmUser(vm.userDetails)
                    .then(function (response) {
                        $log.info(response, 'confirmUser');
                    });
            };

            vm.activate = function () {
                if (vm.userDetails.hash.length > 0) {
                    vm.confirmUser();
                }
            };
            vm.activate();
        }]);
})();
