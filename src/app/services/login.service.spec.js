(function () {
    'use strict';

    describe('the Authorization service', function () {
        var $localStorage, $log, $window, auth, mock;
        mock = {
            user: {
                Authorities: [],
                Identity: [31, 'first', 'middle', 'last'],
            },
        }

        beforeEach(function () {
            angular.mock.module('chpl.services');

            inject(function (_$localStorage_, _$log_, _$window_, _authService_) {
                $localStorage = _$localStorage_;
                $log = _$log_;
                $window = _$window_;
                auth = _authService_;
                auth.logout();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        it('should retrieve the token from storage', function () {
            $localStorage.jwtToken = 'fake token';
            expect(auth.getToken()).toBe('fake token');
        });

        it('should get a username when logged in', function () {
            auth.saveToken(buildToken(mock.user));
            expect(auth.getUsername()).toBe('first');
        });

        it('should get a fullname when logged in', function () {
            auth.saveToken(buildToken(mock.user));
            expect(auth.getFullname()).toBe('middle');
        });

        it('should not get a username when not logged in', function () {
            expect(auth.getUsername()).toBe('');
        });

        it('should not get a username when not logged in', function () {
            expect(auth.getFullname()).toBe('');
        });

        it('should know when a user is authenticated', function () {
            expect(auth.isAuthed()).toBe(false);
            auth.saveToken(buildToken(mock.user));
            expect(auth.isAuthed()).toBe(true);
        });

        it('should delete the token on logout', function () {
            $localStorage.jwtToken = 'fake token';
            auth.logout();
            expect($localStorage.jwtToken).toBeUndefined();
        });

        it('should parse a JWT Token', function () {
            var token = angular.copy(buildToken(mock.user));
            expect(auth.parseJwt(token).Authorities).toEqual([]);
            expect(auth.parseJwt(token).Identity).toEqual(mock.user.Identity);
        });

        it('should handle bad tokens', function () {
            expect(auth.parseJwt('somehingWithoutDots')).toEqual({});
            expect(auth.parseJwt(3)).toBeUndefined();
            expect(auth.parseJwt()).toBeUndefined();
        });

        it('should save the token', function () {
            var token = angular.copy(buildToken(mock.user));
            auth.saveToken(token);
            expect($localStorage.jwtToken).toBe(token);
        });

        describe('when checking Authorities', function () {
            var user;
            beforeEach(function () {
                user = angular.copy(mock.user);
                user.Authorities = undefined;
            });

            it('should handle ACB Admin', function () {
                expect(auth.isAcbAdmin()).toBe(false);
                auth.saveToken(buildToken(user));
                expect(auth.isAcbAdmin()).toBe(false);
                user.Authorities = ['ROLE_ACB'];
                auth.saveToken(buildToken(user));
                expect(auth.isAcbAdmin()).toBe(true);
            });

            it('should handle ATL Admin', function () {
                expect(auth.isAtlAdmin()).toBe(false);
                auth.saveToken(buildToken(user));
                expect(auth.isAtlAdmin()).toBe(false);
                user.Authorities = ['ROLE_ATL'];
                auth.saveToken(buildToken(user));
                expect(auth.isAtlAdmin()).toBe(true);
            });

            it('should handle CHPL Admin', function () {
                expect(auth.isChplAdmin()).toBe(false);
                auth.saveToken(buildToken(user));
                expect(auth.isChplAdmin()).toBe(false);
                user.Authorities = ['ROLE_ADMIN'];
                auth.saveToken(buildToken(user));
                expect(auth.isChplAdmin()).toBe(true);
            });

            it('should handle CMS Staff', function () {
                expect(auth.isCmsStaff()).toBe(false);
                auth.saveToken(buildToken(user));
                expect(auth.isCmsStaff()).toBe(false);
                user.Authorities = ['ROLE_CMS_STAFF'];
                auth.saveToken(buildToken(user));
                expect(auth.isCmsStaff()).toBe(true);
            });

            it('should handle ONC Staff', function () {
                expect(auth.isOncStaff()).toBe(false);
                auth.saveToken(buildToken(user));
                expect(auth.isOncStaff()).toBe(false);
                user.Authorities = ['ROLE_ONC_STAFF'];
                auth.saveToken(buildToken(user));
                expect(auth.isOncStaff()).toBe(true);
            });
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
