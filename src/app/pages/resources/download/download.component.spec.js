(() => {
    'use strict';

    describe('the CHPL Downloadable Resources component', () => {
        var $log, authService, ctrl, el, mock, scope;

        mock = {};
        mock.API = 'api';
        mock.API_KEY = 'api key';
        mock.token = 'a token here';

        beforeEach(() => {
            angular.mock.module('chpl.services', 'chpl.resources', $provide => {
                $provide.decorator('authService', $delegate => {
                    $delegate.getApiKey = jasmine.createSpy('getApiKey');
                    $delegate.getToken = jasmine.createSpy('getToken');
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');
                    return $delegate;
                });
            });

            inject(($compile, _$log_, $rootScope, _authService_) => {
                $log = _$log_;
                authService = _authService_;
                authService.getApiKey.and.returnValue(mock.API_KEY);
                authService.getToken.and.returnValue(mock.token);
                authService.hasAnyRole.and.returnValue(false);

                el = angular.element('<chpl-resources-download></chpl-resources-download>');

                scope = $rootScope.$new();
                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
            });
        });

        afterEach(() => {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('directive', () => {
            it('should be compiled', () => {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', () => {
            it('should exist', () => {
                expect(ctrl).toBeDefined();
            });

            it('should know what the API Key is', () => {
                expect(ctrl.API_KEY).toBe(mock.API_KEY);
            });

            it('should know what the token is', () => {
                expect(ctrl.getToken).toBeDefined();
                expect(ctrl.getToken()).toBe(mock.token);
            });

            it('should know if it should show restricted download files', () => {
                authService.hasAnyRole.and.returnValue(true);
                expect(ctrl.showRestricted()).toBe(true);
            });
        });
    });
})();
