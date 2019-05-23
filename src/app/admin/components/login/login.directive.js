/* global DEVELOPER_MODE */

(function () {
    'use strict';

    angular.module('chpl.admin')
        .directive('aiLogin', aiLogin)
        .controller('LoginController', LoginController);

    function aiLogin () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'chpl.admin/components/login/login.html',
            scope: {},
            bindToController: {
                formClass: '@',
                pClass: '@',
                pClassFail: '@',
            },
            controllerAs: 'vm',
            controller: 'LoginController',
        };
    }

    /** @ngInclude */
    function LoginController ($log, $rootScope, $scope, $state, $stateParams, Idle, Keepalive, authService, featureFlags, networkService, utilService) {
        var vm = this;

        vm.broadcastLogin = broadcastLogin;
        vm.changePassword = changePassword;
        vm.clear = clear;
        vm.hasAnyRole = authService.hasAnyRole;
        vm.login = login;
        vm.logout = logout;
        vm.misMatchPasswords = misMatchPasswords;
        vm.passwordClass = utilService.passwordClass;
        vm.passwordTitle = utilService.passwordTitle;
        vm.resetPassword = resetPassword;
        vm.sendReset = sendReset;
        vm.setActivity = setActivity;
        vm.stopImpersonating = stopImpersonating;
        vm.DEVELOPER_MODE = DEVELOPER_MODE;

        vm.activityEnum = {
            LOGIN: 1,
            CHANGE: 2,
            RESET: 3,
            NONE: 4,
            EXPIRED: 5,
            PASSWORD_RESET: 6,
            IMPERSONATING: 7,
        };

        /////////////////////////////////////////////////////////

        this.$onInit = function () {
            vm.clear();
            if (vm.hasAnyRole()) {
                Idle.watch();
                _updateExtras();
                if (authService.isImpersonating()) {
                    vm.activity = vm.activityEnum.IMPERSONATING;
                }
            }
            if ($stateParams.token) {
                vm.activity = vm.activityEnum.PASSWORD_RESET;
                vm.token = $stateParams.token;
            }

            var keepalive = $scope.$on('Keepalive', function () {
                $log.info('Keepalive');
                if (vm.hasAnyRole()) {
                    if (vm.activity === vm.activityEnum.RESET || vm.activity === vm.activityEnum.LOGIN) {
                        vm.activity = vm.activityEnum.NONE;
                    }
                    networkService.keepalive()
                        .then(function (response) {
                            if (featureFlags.isOn('ocd2820')) {
                                if (response.error === 'Invalid authentication token.') {
                                    authService.logout();
                                    $state.reload();
                                }
                            } else {
                                authService.saveToken(response.token);
                                if (!authService.isImpersonating() && vm.activity === vm.activityEnum.IMPERSONATING) {
                                    vm.activity = vm.activityEnum.NONE;
                                }
                            }
                        })
                        .catch(error => {
                            if (!featureFlags.isOn('ocd2820')) {
                                angular.noop;
                            } else if (error.status === 401) {
                                authService.logout();
                                $state.reload();
                            }
                        });
                } else {
                    vm.activity = vm.activityEnum.LOGIN;
                    Idle.unwatch();
                }
            });

            $scope.$on('$destroy', keepalive);

            var idle = $scope.$on('IdleTimeout', function () {
                $log.info('IdleTimeout - being logged out.');
                logout();
                setTimeout(function () {
                    clear();
                    $scope.$apply();
                });
            });
            $scope.$on('$destroy', idle);

            var impersonating = $scope.$on('impersonating', () => vm.activity = vm.activityEnum.IMPERSONATING);
            $scope.$on('$destroy', impersonating);
        }

        function changePassword () {
            if (vm.misMatchPasswords()) {
                vm.message = 'Passwords do not match. Please try again';
            } else {
                networkService.changePassword({userName: vm.userName, oldPassword: vm.password, newPassword: vm.newPassword})
                    .then(function (response) {
                        if (response.passwordUpdated) {
                            vm.clear();
                            vm.messageClass = vm.pClass;
                            vm.message = 'Password successfully changed';
                        } else {
                            vm.messageClass = vm.pClassFail;
                            vm.message = 'Your password was not changed. ';
                            if (response.warning) {
                                vm.message += response.warning;
                            }
                            if (response.suggestions && response.suggestions.length > 0) {
                                vm.message += 'Suggestion' + (response.suggestions.length > 1 ? 's' : '') + ': ' + response.suggestions.join(' ');
                            }
                            if (!response.warning && (!response.suggestions || response.suggestions.length === 0)) {
                                vm.message += 'Please try again with a stronger password.';
                            }
                        }
                    }, function () {
                        vm.messageClass = vm.pClassFail;
                        vm.message = 'Error. Please check your credentials or contact the administrator';
                    });
            }
        }

        function resetPassword () {
            if (vm.misMatchPasswords()) {
                vm.message = 'Passwords do not match. Please try again';
            } else {
                networkService.resetPassword({token: vm.token, userName: vm.userName, newPassword: vm.newPassword})
                    .then(function (response) {
                        if (response.passwordUpdated) {
                            vm.clear();
                            vm.messageClass = vm.pClass;
                            vm.message = 'Password successfully changed';
                        } else {
                            vm.messageClass = vm.pClassFail;
                            vm.message = 'Your password was not changed. ';
                            if (response.warning) {
                                vm.message += response.warning;
                            }
                            if (response.suggestions && response.suggestions.length > 0) {
                                vm.message += 'Suggestion' + (response.suggestions.length > 1 ? 's' : '') + ': ' + response.suggestions.join(' ');
                            }
                            if (!response.warning && (!response.suggestions || response.suggestions.length === 0)) {
                                vm.message += 'Your token was invalid or you need a stronger password.';
                            }
                        }
                    }, function () {
                        vm.messageClass = vm.pClassFail;
                        vm.message = 'Error. Please check your credentials or contact the administrator';
                    });
            }
        }

        function clear () {
            if (vm.hasAnyRole()) {
                vm.activity = vm.activityEnum.NONE;
            } else {
                vm.activity = vm.activityEnum.LOGIN;
            }
            vm.userName = '';
            vm.password = '';
            vm.newPassword = '';
            vm.confirmPassword = '';
            vm.email = '';
            vm.message = '';
            if (vm.loginForm) {
                vm.loginForm.$setPristine();
                vm.loginForm.$setUntouched();
            }
        }

        function broadcastLogin () {
            $rootScope.$broadcast('loggedIn');
        }

        function login () {
            vm.message = '';
            networkService.login({userName: vm.userName, password: vm.password})
                .then(function () {
                    Idle.watch();
                    Keepalive.ping();
                    vm.clear();
                    _updateExtras();
                    vm.broadcastLogin();
                }, function (error) {
                    const expired = new RegExp('The user is required to change their password on next log in\\.');
                    if (expired.test(error.data.error)) {
                        vm.activity = vm.activityEnum.EXPIRED;
                    } else {
                        vm.messageClass = vm.pClassFail;
                        vm.message = error.data.error;
                    }
                });
        }

        function logout () {
            authService.logout();
            vm.clear();
            Idle.unwatch();
            $rootScope.$broadcast('loggedOut');
        }

        function setActivity (activity) {
            vm.activity = activity;
        }

        function misMatchPasswords () {
            return vm.newPassword !== vm.confirmPassword;
        }

        function sendReset () {
            networkService.emailResetPassword({userName: vm.userName, email: vm.email})
                .then(function () {
                    vm.clear();
                    vm.messageClass = vm.pClass;
                    vm.message = 'Password email sent; please check your email';
                }, function () {
                    vm.messageClass = vm.pClassFail;
                    vm.message = 'Invalid username/email combination. Please check your credentials or contact the administrator';
                });
        }

        function stopImpersonating () {
            networkService.unimpersonateUser()
                .then(token => {
                    authService.saveToken(token.token);
                    vm.clear();
                    $rootScope.$broadcast('unimpersonating');
                });
        }

        /////////////////////////////////////////////////////////

        function _updateExtras () {
            const vals = ['chpl'];
            networkService.getUserByUsername(authService.getUsername())
                .then(function (response) {
                    if (response.subjectName) { vals.push(response.subjectName); }
                    if (response.fullName) { vals.push(response.fullName); }
                    if (response.friendlyName) { vals.push(response.friendlyName); }
                    if (response.email) { vals.push(response.email); }
                    if (response.phoneNumber) { vals.push(response.phoneNumber); }
                    vm.extras = vals;
                });
        }
    }
})();
