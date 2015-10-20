;(function () {
    'use strict';

    angular.module('app.userRegistration')
        .controller('UserRegistrationController', ['$log', '$routeParams', '$location', 'commonService', function ($log, $routeParams, $location, commonService) {
            var self = this;
            self.userDetails = {user:{}};
            self.authorizeDetails = {};
            self.userDetails.hash = $routeParams.hash;
            self.authorizeDetails.hash = $routeParams.hash;

            self.validateUser = function () {
                var valid = true;
                valid = valid && self.userDetails.hash && self.userDetails.hash.length > 0;
                valid = valid && self.userDetails.user.subjectName && self.userDetails.user.subjectName.length > 0;
                valid = valid && self.userDetails.user.password && self.userDetails.user.password.length > 0;
                valid = valid && self.userDetails.user.firstName && self.userDetails.user.firstName.length > 0;
                valid = valid && self.userDetails.user.lastName && self.userDetails.user.lastName.length > 0;
                valid = valid && self.userDetails.user.email && self.userDetails.user.email.length > 0;
                valid = valid && self.userDetails.user.phoneNumber && self.userDetails.user.phoneNumber.length > 0;
                valid = valid && self.userDetails.user.password === self.userDetails.user.passwordverify;
                return valid;
            };

            self.createUser = function () {
                if (self.validateUser()) {
                    commonService.createInvitedUser(self.userDetails)
                        .then(function (response) {
                            $location.path('/admin');
                        });
                }
            };

            self.authorizeUser = function () {
                if (self.authorizeDetails.userName &&
                    self.authorizeDetails.password &&
                    self.authorizeDetails.hash) {
                    commonService.authorizeUser(self.authorizeDetails)
                        .then(function (response) {
                            $location.path('/admin');
                        });
                }
            };
        }]);
})();
