(() => {
    'use strict';

    fdescribe('the Surveillance Management component', () => {
        var $compile, $log, $q, ctrl, el, mock, networkService, scope;

        mock = {
            listing: {},
        };

        beforeEach(() => {
            angular.mock.module('chpl.mock', 'chpl.surveillance', $provide => {
                $provide.decorator('networkService', $delegate => {
                    $delegate.getListing = jasmine.createSpy('getListing');
                    $delegate.search = jasmine.createSpy('search');

                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.getListing.and.returnValue($q.when(mock.listing));
                networkService.search.and.returnValue($q.when([]));

                scope = $rootScope.$new();

                el = angular.element('<chpl-surveillance-management></chpl-surveillance-management>');

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
