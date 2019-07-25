(() => {
    'use strict';

    fdescribe('the Upload Surveillances component', () => {
        var $compile, $log, $q, $uibModal, Mock, actualOptions, authService, ctrl, el, mock, networkService, scope;

        mock = {};

        beforeEach(() => {
            angular.mock.module('chpl.mock', 'chpl.surveillance', $provide => {
                $provide.decorator('authService', $delegate => {
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');

                    return $delegate;
                });

                $provide.decorator('networkService', $delegate => {
                    $delegate.getUploadingSurveillances = jasmine.createSpy('getUploadingSurveillances');
                    $delegate.massRejectPendingSurveillance = jasmine.createSpy('massRejectPendingSurveillance');

                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _$uibModal_, _Mock_, _authService_, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                Mock = _Mock_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(options => {
                    actualOptions = options;
                    return Mock.fakeModal;
                });
                authService = _authService_;
                authService.hasAnyRole.and.returnValue(true);
                networkService = _networkService_;
                networkService.getUploadingSurveillances.and.returnValue($q.when(mock.uploadingSurveillances));
                networkService.massRejectPendingSurveillance.and.returnValue($q.when({}));

                scope = $rootScope.$new();
                el = angular.element('<chpl-upload-surveillances></chpl-upload-surveillances>');

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

        describe('view', () => {
            it('should be compiled', () => {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', () => {
            it('should exist', () => {
                expect(ctrl).toEqual(jasmine.any(Object));
            });
        });
    });
})();
