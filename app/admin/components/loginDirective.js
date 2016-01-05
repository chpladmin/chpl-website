;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('LoginController', ['$scope', 'commonService', 'authService', '$log', '$location', 'Idle', 'Keepalive', function ($scope, commonService, authService, $log, $location, Idle, Keepalive) {
            var vm = this;

            vm.login = login;
            vm.logout = logout;
            vm.setActivity = setActivity;
            vm.sendReset = sendReset;
            vm.changePassword = changePassword;
            vm.isAuthed = isAuthed;
            vm.clear = clear;
            vm.pwPattern = "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).{8,}";

            vm.activityEnum = {
                LOGIN: 1,
                CHANGE: 2,
                RESET: 3,
                NONE: 4
            };

            activate();

            /////////////////////////////////////////////////////////

            function activate () {
                vm.clear();
                if (vm.isAuthed()) {
                    vm.activity = vm.activityEnum.NONE;
                } else {
                    vm.activity = vm.activityEnum.LOGIN;
                }
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

            function login () {
                vm.message = '';
                commonService.login({userName: vm.userName, password: vm.password})
                    .then(function (response) {
                        Idle.watch();
                        Keepalive.ping();
                        $location.path('/admin');
                        vm.clear();
                    }, function (error) {
                        vm.message = 'Invalid username/password combination';
                    });
            }

            function logout () {
                authService.logout();
                vm.activity = vm.activityEnum.LOGIN;
                Idle.unwatch();
            }

            function setActivity (activity) {
                vm.activity = activity;
            }

            function sendReset () {
                commonService.resetPassword({userName: vm.userName, email: vm.email})
                    .then(function (response) {
                        $location.path('/admin');
                        vm.clear();
                        vm.message = 'Password email sent; please check your email';
                    }, function (error) {
                        vm.message = 'Invalid username/email combination. Please check your credentials or contact the administrator';
                    });
            }

            function changePassword () {
                if (vm.password === vm.confirmPassword) {
                    commonService.changePassword({userName: vm.userName, password: vm.password})
                        .then(function (response) {
                            vm.clear();
                            vm.message = 'Password successfully changed';
                        }, function (error) {
                            vm.message = 'Error. Please check your credentials or contact the administrator';
                        });
                } else {
                    vm.message = 'Passwords do not match. Please try again';
                }
            }

            function isAuthed () {
                return authService.isAuthed();
            }

            function clear () {
                if (vm.isAuthed()) {
                    vm.activity = vm.activityEnum.NONE;
                } else {
                    vm.activity = vm.activityEnum.LOGIN;
                }
                vm.userName = '';
                vm.password = '';
                vm.confirmPassword = '';
                vm.email = '';
                vm.message = '';
            }
        }]);

    angular.module('app.admin')
        .directive('aiLogin', function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'admin/components/login.html',
                scope: {
                },
                bindToController: {
                    formClass: '@',
                    pClass: '@'
                },
                controllerAs: 'vm',
                controller: 'LoginController'
            };
        });
})();
