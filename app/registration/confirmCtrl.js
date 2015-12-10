;(function () {
    'use strict';

    angular.module('app.registration')
        .controller('ConfirmController', ['$log', '$routeParams', '$location', 'commonService', function ($log, $routeParams, $location, commonService) {
            var vm = this;
            vm.userDetails = $routeParams.hash;
            vm.message = {value: '', success: null};

            vm.confirmUser = confirmUser;

            ////////////////////////////////////////////////////////////////////

            function confirmUser () {
                commonService.confirmUser(vm.userDetails)
                    .then(function (response) {
                        vm.message.value = 'Thank you for confirming your account. You may now log in.';
                        vm.message.success = true;
                    },function (error) {
                        vm.message.value = error.data.error;
                        vm.message.success = false;
                    });
            };

            vm.activate = function () {
                vm.confirmUser();
            };
            vm.activate();
        }]);
})();
