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
            scope: {
            },
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
    function LoginController ($log, $rootScope, $scope, Idle, Keepalive, authService, networkService) {
        var vm = this;

        vm.broadcastLogin = broadcastLogin;
        vm.changePassword = changePassword;
        vm.clear = clear;
        vm.isAuthed = authService.isAuthed;
        vm.login = login;
        vm.logout = logout;
        vm.misMatchPasswords = misMatchPasswords;
        vm.sendReset = sendReset;
        vm.setActivity = setActivity;

        vm.activityEnum = {
            LOGIN: 1,
            CHANGE: 2,
            RESET: 3,
            NONE: 4,
        };

        /////////////////////////////////////////////////////////

        this.$onInit = function () {
            vm.clear();
            if (vm.isAuthed()) {
                Idle.watch();
            }
            $scope.$on('Keepalive', function () {
                $log.info('Keepalive');

                if (vm.isAuthed()) {
                    if (vm.activity === vm.activityEnum.RESET || vm.activity === vm.activityEnum.LOGIN) {
                        vm.activity = vm.activityEnum.NONE;
                    }
                    networkService.keepalive()
                        .then(function (response) {
                            authService.saveToken(response.token);
                        });
                } else {
                    vm.activity = vm.activityEnum.LOGIN;
                    Idle.unwatch();
                }
            });
        }

        function changePassword () {
            if (vm.misMatchPasswords()) {
                vm.message = 'Passwords do not match. Please try again';
            } else {
                networkService.changePassword({oldPassword: vm.password, newPassword: vm.newPassword})
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

        function clear () {
            if (vm.isAuthed()) {
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
                }, function (error) {
                    vm.messageClass = vm.pClassFail;
                    vm.message = error.data.error;
                })
                .then(function () {
                    vm.broadcastLogin();
                });
        }

        function logout () {
            authService.logout();
            vm.clear();
            Idle.unwatch();
        }

        function setActivity (activity) {
            vm.activity = activity;
        }

        function misMatchPasswords () {
            return vm.newPassword !== vm.confirmPassword;
        }

        function sendReset () {
            networkService.resetPassword({userName: vm.userName, email: vm.email})
                .then(function () {
                    vm.clear();
                    vm.messageClass = vm.pClass;
                    vm.message = 'Password email sent; please check your email';
                }, function () {
                    vm.messageClass = vm.pClassFail;
                    vm.message = 'Invalid username/email combination. Please check your credentials or contact the administrator';
                });
        }
    }
})();
