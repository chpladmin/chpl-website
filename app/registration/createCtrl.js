;(function () {
    'use strict';

    angular.module('app.registration')
        .controller('CreateController', ['$log', '$routeParams', '$location', 'commonService', function ($log, $routeParams, $location, commonService) {
            var vm = this;

            vm.createUser = createUser;
            vm.authorizeUser = authorizeUser;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.userDetails = {user:{}};
                vm.authorizeDetails = {};
                vm.userDetails.hash = $routeParams.hash;
                vm.authorizeDetails.hash = $routeParams.hash;
                vm.message = {value: '', success: null};
                vm.pwPattern = "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).{8,}";
            }

            function createUser () {
                if (vm.validateUser()) {
                    commonService.createInvitedUser(vm.userDetails)
                        .then(function (response) {
                            vm.message.value = 'Your account has been created. Please check your email to confirm your account';
                            vm.userDetails = {user:{}};
                            vm.createUserForm.$setPristine();
                            vm.createUserForm.$setUntouched();
                            vm.message.success = true;
                        },function (error) {
                            vm.message.value = error.data.error;
                            vm.userDetails = {user:{}};
                            vm.createUserForm.$setPristine();
                            vm.createUserForm.$setUntouched();
                            vm.message.success = false;
                        });
                }
            }

            function authorizeUser () {
                if (vm.authorizeDetails.userName &&
                    vm.authorizeDetails.password &&
                    vm.authorizeDetails.hash) {
                    commonService.authorizeUser(vm.authorizeDetails)
                        .then(function (response) {
                            $location.path('/admin');
                        },function (error) {
                            vm.message.value = error.data.error;
                            vm.authorizeDetails = {};
                            vm.authorizeUserForm.$setPristine();
                            vm.authorizeUserForm.$setUntouched();
                            vm.message.success = false;
                        });
                }
            }

            vm.validateUser = function () {
                var valid = true;
                valid = valid && vm.userDetails.hash && vm.userDetails.hash.length > 0;
                valid = valid && vm.userDetails.user.subjectName && vm.userDetails.user.subjectName.length > 0;
                valid = valid && vm.userDetails.user.password && vm.userDetails.user.password.length > 0;
                valid = valid && vm.userDetails.user.firstName && vm.userDetails.user.firstName.length > 0;
                valid = valid && vm.userDetails.user.lastName && vm.userDetails.user.lastName.length > 0;
                valid = valid && vm.userDetails.user.email && vm.userDetails.user.email.length > 0;
                valid = valid && vm.userDetails.user.phoneNumber && vm.userDetails.user.phoneNumber.length > 0;
                valid = valid && vm.userDetails.user.password === vm.userDetails.user.passwordverify;
                return valid;
            };
        }]);
})();
