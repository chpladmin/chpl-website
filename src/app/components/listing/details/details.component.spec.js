(() => {
    'use strict';

    describe('the Listing Details component', () => {
        var $compile, $log, Mock, ctrl, el, networkService, scope;

        beforeEach(() => {
            angular.mock.module('chpl.mock', 'chpl.components', $provide => {
                $provide.factory('aiSedDirective', () => ({}));
                $provide.decorator('networkService', $delegate => {
                    $delegate.getSurveillanceLookups = jasmine.createSpy('getSurveillanceLookups');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, $q, $rootScope, _Mock_, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                Mock = _Mock_;
                networkService = _networkService_;
                networkService.getSurveillanceLookups.and.returnValue($q.when({}));

                scope = $rootScope.$new();
                scope.listing = Mock.fullListings[1];
                scope.listing.sed = {testTasks: [], ucdProcesses: []};

                el = angular.element('<chpl-listing-details listing="listing"></chpl-listing-details-certs>');

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
            it('should have isolate scope object with instanciate members', () => {
                expect(ctrl).toEqual(jasmine.any(Object));
            });

            describe('initial state', () => {
                it('should be open to criteria by default', () => {
                    expect(ctrl.panelShown).toBe('cert');
                });

                it('should be able to be open to nothing', () => {
                    el = angular.element('<chpl-listing-details listing="listing" initial-panel="none"></chpl-listing-details>');
                    $compile(el)(scope);
                    scope.$digest();
                    ctrl = el.isolateScope().$ctrl;
                    expect(ctrl.panelShown).toBeUndefined();
                });

                it('should be able to be open to surveillance', () => {
                    el = angular.element('<chpl-listing-details listing="listing" initial-panel="surveillance"></chpl-listing-details>');
                    $compile(el)(scope);
                    scope.$digest();
                    ctrl = el.isolateScope().$ctrl;
                    expect(ctrl.panelShown).toBe('surveillance');
                });
            });
        });
    });
})();
