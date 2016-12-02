;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('LoginController', ['$scope', 'commonService', 'authService', '$log', 'Idle', 'Keepalive', function ($scope, commonService, authService, $log, Idle, Keepalive) {
            var vm = this;

            vm.activate = activate;
            vm.changePassword = changePassword;
            vm.clear = clear;
            vm.isAuthed = isAuthed;
            vm.login = login;
            vm.logout = logout;
            vm.misMatchPasswords = misMatchPasswords;
            vm.sendReset = sendReset;
            vm.setActivity = setActivity;
            vm.pwPattern = "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).{8,}";

            vm.activityEnum = {
                LOGIN: 1,
                CHANGE: 2,
                RESET: 3,
                NONE: 4
            };

            vm.activate();

            /////////////////////////////////////////////////////////

            function activate () {
                if (vm.isAuthed()) {
                    vm.activity = vm.activityEnum.NONE;
                } else {
                    vm.activity = vm.activityEnum.LOGIN;
                }
                vm.clear();
                $scope.$on('Keepalive', function() {
                    $log.info('Keepalive');

                    if (authService.isAuthed()) {
                        if (vm.activity === vm.activityEnum.RESET || vm.activity === vm.activityEnum.LOGIN) {
                            vm.activity = vm.activityEnum.NONE;
                        }
                        commonService.keepalive()
                            .then(function (response) {
                                authService.saveToken(response.token);
                            });
                    } else {
                        vm.activity = vm.activityEnum.LOGIN;
                        Idle.unwatch();
                    }
                });
                if (authService.isAuthed()) {
                    Idle.watch();
                }
            }

            function changePassword () {
                if (vm.newPassword === vm.confirmPassword) {
                    commonService.changePassword({oldPassword: vm.password, newPassword: vm.newPassword})
                        .then(function (response) {
                            vm.clear();
                            vm.messageClass = vm.pClass;
                            vm.message = 'Password successfully changed';
                        }, function (error) {
                            vm.messageClass = vm.pClassFail;
                            vm.message = 'Error. Please check your credentials or contact the administrator';
                        });
                } else {
                    vm.message = 'Passwords do not match. Please try again';
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

            function isAuthed () {
                return authService.isAuthed();
            }

            function login () {
                vm.message = '';
                commonService.login({userName: vm.userName, password: vm.password})
                    .then(function (response) {
                        Idle.watch();
                        Keepalive.ping();
                        vm.clear();
                    }, function (error) {
                        vm.messageClass = vm.pClassFail;
                        vm.message = error.data.error;
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
                commonService.resetPassword({userName: vm.userName, email: vm.email})
                    .then(function (response) {
                        vm.clear();
                        vm.messageClass = vm.pClass;
                        vm.message = 'Password email sent; please check your email';
                    }, function (error) {
                        vm.messageClass = vm.pClassFail;
                        vm.message = 'Invalid username/email combination. Please check your credentials or contact the administrator';
                    });
            }
        }]);

    angular.module('app.admin')
        .directive('aiLogin', function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'admin/components/login/login.html',
                scope: {
                },
                bindToController: {
                    formClass: '@',
                    pClass: '@',
                    pClassFail: '@'
                },
                controllerAs: 'vm',
                controller: 'LoginController'
            };
        });
})();
