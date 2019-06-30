(() => {
    'use strict';

    fdescribe('the ONC-ATLs component', () => {
        var $compile, $log, $q, authService, ctrl, el, mock, networkService, scope;

        mock = {
            atls: [
                { name: 'an atl' },
                { name: 'another atl' },
            ],
        };

        beforeEach(() => {
            angular.mock.module('chpl.organizations', $provide => {
                $provide.decorator('authService', $delegate => {
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');
                    return $delegate;
                });
                $provide.decorator('networkService', $delegate => {
                    $delegate.getAtl = jasmine.createSpy('getAtl');
                    $delegate.getAtls = jasmine.createSpy('getAtls');
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
                networkService.getAtl.and.returnValue($q.when(mock.atls[0]));
                networkService.getAtls.and.returnValue($q.when({atls: mock.atls}));

                scope = $rootScope.$new();
                scope.atls = {atls: mock.atls};
                scope.editableAtls = [];

                el = angular.element('<chpl-onc-atls all-atls="atls" editable-atls="editableAtls"></chpl-onc-atls>');

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
                expect(ctrl.allAtls.length).toBe(2);
            });
        });
    });
})();
