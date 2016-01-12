;(function () {
    'use strict';

    angular.module('app.registration')
        .controller('CreateController', ['$log', '$routeParams', '$location', 'authService', 'commonService', function ($log, $routeParams, $location, authService, commonService) {
            var vm = this;

            vm.authorizeUser = authorizeUser;
            vm.createUser = createUser;
            vm.isAuthed = isAuthed;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.userDetails = {user:{}};
                vm.authorizeDetails = {};
                vm.userDetails.hash = $routeParams.hash;
                vm.authorizeDetails.hash = $routeParams.hash;
                vm.message = {value: '', success: null};
                vm.pwPattern = "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).{8,}";
                if (vm.isAuthed) {
                    vm.authorizeUser();
                }
            }

            function authorizeUser () {
                if (((vm.authorizeDetails.userName && vm.authorizeDetails.password)
                     || vm.isAuthed())
                    && vm.authorizeDetails.hash) {
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

            function isAuthed () {
                return authService.isAuthed();
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
