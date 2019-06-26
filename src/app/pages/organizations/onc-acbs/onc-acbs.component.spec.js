(() => {
    'use strict';

    xdescribe('the ONC-ACBs component', () => {
        var $compile, $log, $q, authService, ctrl, el, mock, networkService, scope;

        mock = {
            acbs: [
                { name: 'an acb' },
                { name: 'another acb' },
            ],
        };

        beforeEach(() => {
            angular.mock.module('chpl.organizations', $provide => {
                $provide.decorator('authService', $delegate => {
                    $delegate.getAcbs = jasmine.createSpy('hasAnyRole');
                    return $delegate;
                });
                $provide.decorator('networkService', $delegate => {
                    $delegate.getAcb = jasmine.createSpy('getAcb');
                    $delegate.getAcbs = jasmine.createSpy('getAcbs');
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
                networkService.getAcb.and.returnValue($q.when(mock.acbs[0]));
                networkService.getAcbs.and.returnValue($q.when({acbs: mock.acbs}));

                scope = $rootScope.$new();
                scope.acbs = {acbs: mock.acbs};

                el = angular.element('<chpl-onc-acbs acbs="acbs"></chpl-onc-acbs>');

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

            it('should have data', () => {
                expect(ctrl.acbs.length).toBe(2);
            });
        });
    });
})();
