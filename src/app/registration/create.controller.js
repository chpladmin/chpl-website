(function () {
    'use strict';

    angular.module('chpl.registration')
        .controller('CreateController', CreateController);

    /** @ngInject */
    function CreateController ($location, $log, $routeParams, authService, networkService) {
        var vm = this;

        vm.authorizeUser = authorizeUser;
        vm.createUser = createUser;
        vm.isAuthed = isAuthed;
        vm.misMatchPasswords = misMatchPasswords;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.userDetails = {user: {
                complianceTermsAccepted: true,
            }};
            vm.authorizeDetails = {};
            vm.userDetails.hash = $routeParams.hash;
            vm.authorizeDetails.hash = $routeParams.hash;
            vm.message = {value: '', success: null};
            vm.pwPattern = '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).{8,}';
            if (vm.isAuthed) {
                vm.authorizeUser();
            }
        }

        function authorizeUser () {
            if ((vm.authorizeDetails.userName && vm.authorizeDetails.password) || vm.isAuthed()
                && vm.authorizeDetails.hash) {
                networkService.authorizeUser(vm.authorizeDetails)
                    .then(function () {
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
                vm.userDetails.user.complianceTermsAccepted = true;
                networkService.createInvitedUser(vm.userDetails)
                    .then(function () {
                        vm.message.value = 'Your account has been created. Please check your email to confirm your account';
                        vm.userDetails = {user: {}};
                        vm.createUserForm.$setPristine();
                        vm.createUserForm.$setUntouched();
                        vm.message.success = true;
                    },function (error) {
                        vm.message.value = error.data.error;
                        vm.userDetails = {user: {}};
                        vm.createUserForm.$setPristine();
                        vm.createUserForm.$setUntouched();
                        vm.message.success = false;
                    });
            }
        }

        function isAuthed () {
            return authService.isAuthed();
        }

        function misMatchPasswords () {
            return vm.userDetails.user.password !== vm.userDetails.user.passwordverify;
        }

        vm.validateUser = function () {
            var valid = true;
            valid = valid && vm.userDetails.hash && vm.userDetails.hash.length > 0;
            valid = valid && vm.userDetails.user.subjectName && vm.userDetails.user.subjectName.length > 0;
            valid = valid && vm.userDetails.user.password && vm.userDetails.user.password.length > 0;
            valid = valid && vm.userDetails.user.fullName && vm.userDetails.user.fullName.length > 0;
            valid = valid && vm.userDetails.user.friendlyName && vm.userDetails.user.friendlyName.length > 0;
            valid = valid && vm.userDetails.user.email && vm.userDetails.user.email.length > 0;
            valid = valid && vm.userDetails.user.phoneNumber && vm.userDetails.user.phoneNumber.length > 0;
            valid = valid && vm.userDetails.user.password === vm.userDetails.user.passwordverify;
            return valid;
        };
    }
})();
