export const LoginComponent = {
    templateUrl: 'chpl.navigation/login/login.html',
    bindings: {
        formClass: '@',
        pClass: '@',
        pClassFail: '@',
    },
    controller: class LoginComponent {
        constructor ($log, $rootScope, $scope, $stateParams, Idle, Keepalive, authService, networkService, utilService) {
            'ngInject'
            this.$log = $log;
            this.$rootScope = $rootScope;
            this.$scope = $scope;
            this.$stateParams = $stateParams;
            this.Idle = Idle;
            this.Keepalive = Keepalive;
            this.authService = authService;
            this.networkService = networkService;
            this.utilService = utilService;
            this.hasAnyRole = authService.hasAnyRole;
            this.activityEnum = {
                LOGIN: 1,
                CHANGE: 2,
                RESET: 3,
                NONE: 4,
                EXPIRED: 5,
                PASSWORD_RESET: 6,
                IMPERSONATING: 7,
            };
        }

        $onInit () {
            let that = this;
            this.clear();
            if (this.hasAnyRole()) {
                this.Idle.watch();
                this._updateExtras();
                if (this.authService.isImpersonating()) {
                    this.activity = this.activityEnum.IMPERSONATING;
                }
            }
            if (this.$stateParams.token) {
                this.activity = this.activityEnum.PASSWORD_RESET;
                this.token = this.$stateParams.token;
            }

            let keepalive = this.$scope.$on('Keepalive', () => {
                this.$log.info('Keepalive');
                if (this.hasAnyRole()) {
                    if (this.activity === this.activityEnum.RESET || this.activity === this.activityEnum.LOGIN) {
                        this.activity = this.activityEnum.NONE;
                    }
                    this.networkService.keepalive()
                        .then(response => {
                            that.authService.saveToken(response.token);
                            if (!that.authService.isImpersonating() && that.activity === that.activityEnum.IMPERSONATING) {
                                that.activity = that.activityEnum.NONE;
                            }
                        });
                } else {
                    this.activity = this.activityEnum.LOGIN;
                    this.Idle.unwatch();
                }
            });
            this.$scope.$on('$destroy', keepalive);

            let idle = this.$scope.$on('IdleTimeout', () => {
                this.$log.info('IdleTimeout - being logged out.');
                this.logout();
                setTimeout(() => {
                    that.clear();
                    that.$scope.$apply();
                });
            });
            this.$scope.$on('$destroy', idle);

            let impersonating = this.$scope.$on('impersonating', () => that.activity = that.activityEnum.IMPERSONATING);
            this.$scope.$on('$destroy', impersonating);
        }

        changePassword () {
            let that = this;
            if (this.misMatchPasswords()) {
                this.message = 'Passwords do not match. Please try again';
            } else {
                this.networkService.changePassword({userName: this.userName, oldPassword: this.password, newPassword: this.newPassword})
                    .then(response => {
                        if (response.passwordUpdated) {
                            that.clear();
                            that.messageClass = that.pClass;
                            that.message = 'Password successfully changed';
                        } else {
                            that.messageClass = that.pClassFail;
                            that.message = 'Your password was not changed. ';
                            if (response.warning) {
                                that.message += response.warning;
                            }
                            if (response.suggestions && response.suggestions.length > 0) {
                                that.message += 'Suggestion' + (response.suggestions.length > 1 ? 's' : '') + ': ' + response.suggestions.join(' ');
                            }
                            if (!response.warning && (!response.suggestions || response.suggestions.length === 0)) {
                                that.message += 'Please try again with a stronger password.';
                            }
                        }
                    }, () => {
                        that.messageClass = that.pClassFail;
                        that.message = 'Error. Please check your credentials or contact the administrator';
                    });
            }
        }

        resetPassword () {
            let that = this;
            if (this.misMatchPasswords()) {
                this.message = 'Passwords do not match. Please try again';
            } else {
                this.networkService.resetPassword({token: this.token, userName: this.userName, newPassword: this.newPassword})
                    .then(response => {
                        if (response.passwordUpdated) {
                            that.clear();
                            that.messageClass = that.pClass;
                            that.message = 'Password successfully changed';
                        } else {
                            that.messageClass = that.pClassFail;
                            that.message = 'Your password was not changed. ';
                            if (response.warning) {
                                that.message += response.warning;
                            }
                            if (response.suggestions && response.suggestions.length > 0) {
                                that.message += 'Suggestion' + (response.suggestions.length > 1 ? 's' : '') + ': ' + response.suggestions.join(' ');
                            }
                            if (!response.warning && (!response.suggestions || response.suggestions.length === 0)) {
                                that.message += 'Your token was invalid or you need a stronger password.';
                            }
                        }
                    }, () => {
                        that.messageClass = that.pClassFail;
                        that.message = 'Error. Please check your credentials or contact the administrator';
                    });
            }
        }

        clear () {
            if (this.hasAnyRole()) {
                this.activity = this.activityEnum.NONE;
            } else {
                this.activity = this.activityEnum.LOGIN;
            }
            this.userName = '';
            this.password = '';
            this.newPassword = '';
            this.confirmPassword = '';
            this.email = '';
            this.message = '';
            if (this.loginForm) {
                this.loginForm.$setPristine();
                this.loginForm.$setUntouched();
            }
        }

        broadcastLogin () {
            this.$rootScope.$broadcast('loggedIn');
        }

        login () {
            let that = this;
            this.message = '';
            this.networkService.login({userName: this.userName, password: this.password})
                .then(() => {
                    that.Idle.watch();
                    that.Keepalive.ping();
                    that.clear();
                    that._updateExtras();
                    that.broadcastLogin();
                }, (error) => {
                    const expired = new RegExp('The user is required to change their password on next log in\\.');
                    if (expired.test(error.data.error)) {
                        that.activity = that.activityEnum.EXPIRED;
                    } else {
                        that.messageClass = that.pClassFail;
                        that.message = error.data.error;
                    }
                });
        }

        logout () {
            this.authService.logout();
            this.clear();
            this.Idle.unwatch();
            this.$rootScope.$broadcast('loggedOut');
        }

        setActivity (activity) {
            this.activity = activity;
        }

        misMatchPasswords () {
            return this.newPassword !== this.confirmPassword;
        }

        sendReset () {
            let that = this;
            this.networkService.emailResetPassword({userName: this.userName, email: this.email})
                .then(() => {
                    that.clear();
                    that.messageClass = that.pClass;
                    that.message = 'Password email sent; please check your email';
                }, () => {
                    that.messageClass = that.pClassFail;
                    that.message = 'Invalid username/email combination. Please check your credentials or contact the administrator';
                });
        }

        stopImpersonating () {
            let that = this;
            this.networkService.unimpersonateUser()
                .then(token => {
                    that.authService.saveToken(token.token);
                    that.clear();
                    that.$rootScope.$broadcast('unimpersonating');
                });
        }

        /////////////////////////////////////////////////////////

        _updateExtras () {
            const vals = ['chpl'];
            let that = this;
            this.networkService.getUserByUsername(this.authService.getUsername())
                .then(response => {
                    if (response.subjectName) { vals.push(response.subjectName); }
                    if (response.fullName) { vals.push(response.fullName); }
                    if (response.friendlyName) { vals.push(response.friendlyName); }
                    if (response.email) { vals.push(response.email); }
                    if (response.phoneNumber) { vals.push(response.phoneNumber); }
                    that.extras = vals;
                });
        }
    },
}

angular.module('chpl.navigation')
    .component('chplLogin', LoginComponent);
