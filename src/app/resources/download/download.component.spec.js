(function () {
    'use strict';

    describe('the CHPL Downloadable Resources compoment', function () {
        var $log, authService, ctrl, el, mock, scope;

        mock = {};
        mock.API = 'api';
        mock.API_KEY = 'api key';
        mock.token = 'a token here';

        beforeEach(function () {
            angular.mock.module('chpl.services', 'chpl.download', function ($provide) {
                $provide.decorator('authService', function ($delegate) {
                    $delegate.getApiKey = jasmine.createSpy('getApiKey');
                    $delegate.getToken = jasmine.createSpy('getToken');
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');
                    return $delegate;
                });
            });

            inject(function ($compile, _$log_, $rootScope, _authService_) {
                $log = _$log_;
                authService = _authService_;
                authService.getApiKey.and.returnValue(mock.API_KEY);
                authService.getToken.and.returnValue(mock.token);
                authService.hasAnyRole.and.returnValue(false);

                el = angular.element('<ai-resources-download></ai-resources-download>');

                scope = $rootScope.$new();
                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('directive', function () {
            it('should be compiled', function () {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', function () {
            it('should exist', function () {
                expect(ctrl).toBeDefined();
            });

            it('should know what the API Key is', function () {
                expect(ctrl.API_KEY).toBe(mock.API_KEY);
            });

            it('should know what the token is', function () {
                expect(ctrl.getToken).toBeDefined();
                expect(ctrl.getToken()).toBe(mock.token);
            });

            it('should know if it should show restricted download files', function () {
                authService.hasAnyRole.and.returnValue(true);
                expect(ctrl.showRestricted()).toBe(true);
            });

            it('should change the definition select when the download is changed', function () {
                ctrl.downloadOptions = [1, 2, 3];
                ctrl.definitionOptions = ['a', 'b', 'c'];
                ctrl.downloadOption = 1;
                ctrl.definitionOption = 'a';

                ctrl.downloadOption = 2
                ctrl.changeDownload();
                expect(ctrl.definitionOption).toBe('b');
            });
        });
    });
})();
