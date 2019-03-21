(function () {
    'use strict';

    angular.module('chpl.registration')
        .controller('ConfirmController', ConfirmController);

    /** @ngInject */
    function ConfirmController ($location, $log, $stateParams, networkService) {
        var vm = this;

        vm.confirmUser = confirmUser;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.userDetails = $stateParams.hash;
            vm.message = {value: '', success: null};
            vm.confirmUser();
        }

        function confirmUser () {
            networkService.confirmUser(vm.userDetails)
                .then(function () {
                    vm.message.value = 'Thank you for confirming your account. You may now log in.';
                    vm.message.success = true;
                },function (error) {
                    vm.message.value = error.data.error;
                    vm.message.success = false;
                });
        }
    }
})();
