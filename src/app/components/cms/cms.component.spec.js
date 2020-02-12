(() => {
    'use strict';

    describe('the CMS component', () => {
        var $compile, $log, $q, authService, ctrl, el, networkService, scope;

        var mock = {};
        mock.results = [
            { id: 'fake', created: 1411117127000, products: '1;2;3'},
        ];

        beforeEach(() => {
            angular.mock.module('chpl.admin', $provide => {
                $provide.decorator('authService', $delegate => {
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');
                    return $delegate;
                });
                $provide.decorator('networkService', $delegate => {
                    $delegate.getCmsDownload = jasmine.createSpy('getCmsDownload');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _authService_, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                authService = _authService_;
                authService.hasAnyRole.and.returnValue(true);
                networkService = _networkService_;
                networkService.getCmsDownload.and.returnValue($q.when(mock.results));

                el = angular.element('<chpl-cms-management></chpl-cms-management>');

                scope = $rootScope.$new()
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

        describe('template', () => {
            it('should be compiled', () => {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', () => {
            it('should have isolate scope object with instanciate members', () => {
                expect(ctrl).toEqual(jasmine.any(Object));
            });

            describe('when getting the download file', () => {
                it('should load without getting the data', () => {
                    expect(ctrl.isReady).toBe(false);
                    expect(ctrl.isProcessing).toBe(false);
                    expect(networkService.getCmsDownload).not.toHaveBeenCalled();
                });

                it('should set "isProcessing" when loading', () => {
                    ctrl.getDownload();
                    expect(ctrl.isProcessing).toBe(true);
                });

                it('should set "isReady" and "isProcessing" when done loading', () => {
                    ctrl.getDownload();
                    scope.$digest();
                    expect(ctrl.isProcessing).toBe(false);
                    expect(ctrl.isReady).toBe(true);
                });

                it('should set the cmsArray', () => {
                    ctrl.getDownload();
                    scope.$digest();
                    expect(ctrl.cmsArray.length).toBe(1);
                });

                it('should format the dates', () => {
                    ctrl.getDownload();
                    scope.$digest();
                    expect(ctrl.cmsArray[0].created).toBe('2014-09-19');
                });

                it('should not put the third column in for CMS users', () => {
                    expect(ctrl.csvHeader.length).toBe(3);
                    authService.hasAnyRole.and.returnValue(false);
                    el = angular.element('<chpl-cms-management></chpl-cms-management>');
                    $compile(el)(scope);
                    scope.$digest();
                    ctrl = el.isolateScope().$ctrl;
                    expect(ctrl.csvHeader.length).toBe(2);
                });
            });
        });
    });
})();
