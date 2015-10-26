;(function () {
    'use strict';

    angular.module('app.registration')
        .controller('ConfirmController', ['$log', '$routeParams', '$location', 'commonService', function ($log, $routeParams, $location, commonService) {
            var vm = this;
            vm.userDetails = $routeParams.hash;

            vm.confirmUser = confirmUser;

            ////////////////////////////////////////////////////////////////////

            function confirmUser () {
                commonService.confirmUser(vm.userDetails)
                    .then(function (response) {
                        $log.info(response, 'confirmUser');
                    });
            };

            vm.activate = function () {
                vm.confirmUser();
            };
            vm.activate();
        }]);
})();
