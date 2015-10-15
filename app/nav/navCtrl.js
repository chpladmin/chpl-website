;(function () {
    'use strict';

    angular.module('app.nav')
        .controller('NavigationController', ['$scope', 'authService', 'commonService', '$log', '$location', 'Idle', 'Keepalive', function ($scope, authService, commonService, $log, $location, Idle, Keepalive) {
            var self = this;

            $scope.$on('IdleStart', function() {
                $log.info('IdleStart');
                // the user appears to have gone idle
            });

            $scope.$on('IdleWarn', function(e, countdown) {
                $log.info('IdleWarn');
                // follows after the IdleStart event, but includes a countdown until the user is considered timed out
                // the countdown arg is the number of seconds remaining until then.
                // you can change the title or display a warning dialog from here.
                // you can let them resume their session by calling Idle.watch()
            });

            $scope.$on('IdleTimeout', function() {
                $log.info('IdleTimeout');
                // the user has timed out (meaning idleDuration + timeout has passed without any activity)
                // this is where you'd log them
            });

            $scope.$on('IdleEnd', function() {
                $log.info('IdleEnd');
                // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog
            });

            $scope.$on('Keepalive', function() {
                $log.info('Keepalive');

                if (authService.isAuthed()) {
                    commonService.keepalive()
                        .then(function (response) {
                            authService.saveToken(response.token);
                        });
                }
                // do something to keep the user's session alive
            });

            self.isActive = function (route) {
                return route === $location.path();
            };

            self.handleLogin = function (res) {
                if (res.status === 200) {
                    var token = res.data.token ? res.data : null;
                    if (token) {
                        self.message = '';
                        Idle.watch();
                        $location.path('/admin');
                    } else {
                        self.message = 'Invalid username or password';
                    }
                } else {
                    self.message = 'Invalid username or password';
                }
            }

            self.login = function () {
                commonService.login({userName: self.username, password: self.password})
                    .then(self.handleLogin, self.handleLogin)
            }

            self.logout = function () {
                Idle.unwatch();
                authService.logout()
            }

            self.isAuthed = function () {
                return authService.isAuthed()
            }

            self.getUsername = function () {
                return authService.getUsername();
            }

            self.forgot = function () {
                self.hasForgotten = !self.hasForgotten;
            }
        }]);
})();

/*
    /auth/reset_password POST { userName: , email}
    /auth/change_password POST { userName: , password: }
    */
