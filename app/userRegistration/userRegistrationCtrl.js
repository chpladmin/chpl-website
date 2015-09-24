;(function () {
    'use strict';

    angular.module('app.userRegistration')
        .controller('UserRegistrationController', ['$log', '$routeParams', '$location', 'adminService', function ($log, $routeParams, $location, adminService) {
            var self = this;
            self.userDetails = {};
            self.authorizeDetails = {};
            self.userDetails.hash = $routeParams.hash;
            self.authorizeDetails.hash = $routeParams.hash;

            self.validateUser = function () {
                var valid = true;
                valid = valid && self.userDetails.hash && self.userDetails.hash.length > 0;
                valid = valid && self.userDetails.username && self.userDetails.username.length > 0;
                valid = valid && self.userDetails.password && self.userDetails.password.length > 0;
                valid = valid && self.userDetails.firstName && self.userDetails.firstName.length > 0;
                valid = valid && self.userDetails.lastName && self.userDetails.lastName.length > 0;
                valid = valid && self.userDetails.email && self.userDetails.email.length > 0;
                valid = valid && self.userDetails.phoneNumber && self.userDetails.phoneNumber.length > 0;
                valid = valid && self.userDetails.password === self.userDetails.passwordverify;
                return valid;
            };

            self.createUser = function () {
                if (self.validateUser()) {
                    adminService.createInvitedUser(self.userDetails)
                        .then(function (response) {
                            $log.debug(response);
                            $location.path('/admin');
                        });
                }
            };

            self.authorizeUser = function () {
                if (self.authorizeDetails.username &&
                    self.authorizeDetails.password &&
                    self.authorizeDetails.hash) {
                    adminService.authorizeUser(self.authorizeDetails)
                        .then(function (response) {
                            $log.debug(response);
                            $location.path('/admin');
                        });
                }
            };
        }]);
})();
