(() => {
    'use strict';

    fdescribe('the Authorization service', () => {
        var $localStorage, $log, $window, auth, mock;
        mock = {
            user: {
                Authority: 'ROLE_ONC',
                Identity: [31, 'username', 'Full Name'],
            },
            impersonating: {
                Authority: 'ROLE_ADMIN',
                Identity: [31, 'username', 'Full Name', 3, 'admin'],
            },
        }

        beforeEach(() => {
            angular.mock.module('chpl.services');

            inject((_$localStorage_, _$log_, _$window_, _authService_) => {
                $localStorage = _$localStorage_;
                $log = _$log_;
                $window = _$window_;
                auth = _authService_;
                auth.logout();
            });
        });

        afterEach(() => {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        it('should retrieve the token from storage', () => {
            $localStorage.jwtToken = 'fake token';
            expect(auth.getToken()).toBe('fake token');
        });

        it('should get a username when logged in', () => {
            auth.saveToken(buildToken(mock.user));
            expect(auth.getUsername()).toBe('username');
        });

        it('should get a fullname when logged in', () => {
            auth.saveToken(buildToken(mock.user));
            expect(auth.getFullname()).toBe('Full Name');
        });

        it('should not get a username when not logged in', () => {
            expect(auth.getUsername()).toBe('');
        });

        it('should not get a username when not logged in', () => {
            expect(auth.getFullname()).toBe('');
        });

        it('should delete the token on logout', () => {
            $localStorage.jwtToken = 'fake token';
            auth.logout();
            expect($localStorage.jwtToken).toBeUndefined();
        });

        it('should parse a JWT Token', () => {
            var token = angular.copy(buildToken(mock.user));
            expect(auth.parseJwt(token).Authority).toBeUndefined;
            expect(auth.parseJwt(token).Identity).toEqual(mock.user.Identity);
        });

        it('should handle bad tokens', () => {
            expect(auth.parseJwt('somehingWithoutDots')).toEqual({});
            expect(auth.parseJwt(3)).toBeUndefined();
            expect(auth.parseJwt()).toBeUndefined();
        });

        it('should save the token', () => {
            var token = angular.copy(buildToken(mock.user));
            auth.saveToken(token);
            expect($localStorage.jwtToken).toBe(token);
        });

        describe('when concerned with ROLES', () => {
            let user;
            beforeEach(() => {
                user = angular.copy(mock.user);
                user.Authority = 'ROLE_ONC';
            });

            it('should require one or more roles', () => {
                auth.saveToken(buildToken(user));
                expect(auth.hasAnyRole()).toBe(false);
                expect(auth.hasAnyRole([])).toBe(false);
            });

            it('should handle no roles', () => {
                expect(auth.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB', 'ROLE_ATL', 'ROLE_CMS_STAFF', 'ROLE_DEVELOPER'])).toBe(false);
                auth.saveToken(buildToken(user));
                expect(auth.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB', 'ROLE_ATL', 'ROLE_CMS_STAFF', 'ROLE_DEVELOPER'])).toBe(true);
            });

            it('should handle a role', () => {
                expect(auth.hasAnyRole(['ROLE_ACB'])).toBe(false);
                auth.saveToken(buildToken(user));
                expect(auth.hasAnyRole(['ROLE_ACB'])).toBe(false);
                user.Authority = 'ROLE_ACB';
                auth.saveToken(buildToken(user));
                expect(auth.hasAnyRole(['ROLE_ACB'])).toBe(true);
            });
        });

        describe('when handling impersonating', () => {
            it('should indicate when impersonating', () => {
                auth.saveToken(buildToken(mock.impersonating));
                expect(auth.getFullname()).toBe('Impersonating Full Name');
            });

            it('should know when a user is not impersonating', () => {
                auth.saveToken(buildToken(mock.user));
                expect(auth.isImpersonating()).toBe(false);
            });

            it('should know when a user is impersonating', () => {
                auth.saveToken(buildToken(mock.impersonating));
                expect(auth.isImpersonating()).toBe(true);
            });

            describe('when knowing who may be be impersonated', () => {
                let user;
                let target;
                beforeEach(() => {
                    user = angular.copy(mock.user);
                    user.Authority = undefined;
                    target = { role: '' };
                });

                it('should let ROLE_ADMIN impersonate non ROLE_ADMIN', () => {
                    user.Authority = 'ROLE_ADMIN';
                    target.role = 'ROLE_ONC';
                    auth.saveToken(buildToken(user));
                    expect(auth.canImpersonate(target)).toBe(true);
                });

                it('should not let ROLE_ADMIN impersonate ROLE_ADMIN', () => {
                    user.Authority = 'ROLE_ADMIN';
                    target.role = 'ROLE_ADMIN';
                    auth.saveToken(buildToken(user));
                    expect(auth.canImpersonate(target)).toBe(false);
                });

                it('should let ROLE_ONC impersonate non ROLE_ONC / non ROLE_ADMIN', () => {
                    user.Authority = 'ROLE_ONC';
                    target.role = 'ROLE_ACB';
                    auth.saveToken(buildToken(user));
                    expect(auth.canImpersonate(target)).toBe(true);
                });

                it('should not let ROLE_ONC impersonate ROLE_ONC', () => {
                    user.Authority = 'ROLE_ONC';
                    target.role = 'ROLE_ONC';
                    auth.saveToken(buildToken(user));
                    expect(auth.canImpersonate(target)).toBe(false);
                });

                it('should not let ROLE_ONC impersonate ROLE_ADMIN', () => {
                    user.Authority = 'ROLE_ONC';
                    target.role = 'ROLE_ADMIN';
                    auth.saveToken(buildToken(user));
                    expect(auth.canImpersonate(target)).toBe(false);
                });

                it('should not let ROLE_ACB impersonate anyone', () => {
                    user.Authority = 'ROLE_ACB';
                    target.role = 'ROLE_ATL';
                    auth.saveToken(buildToken(user));
                    expect(auth.canImpersonate(target)).toBe(false);
                });

                it('should not let anyone impersonate while already impersonating', () => {
                    target.role = 'ROLE_ATL';
                    auth.saveToken(buildToken(angular.copy(mock.impersonating)));
                    expect(auth.canImpersonate(target)).toBe(false);
                });
            });
        });

        it('should know what the API KEY is', () => {
            expect(auth.getApiKey()).toBe('12909a978483dfb8ecd0596c98ae9094');
        });

        ////////////////////////////////////////////////////////////////////////

        function buildToken (user) {
            user.exp = Math.round(new Date().getTime() / 1000) + 600;
            return [
                'frontPart',
                $window.btoa(angular.toJson(user)).replace('+','-').replace('/','_'),
                'backPart',
            ].join('.');
        }
    });
})();
