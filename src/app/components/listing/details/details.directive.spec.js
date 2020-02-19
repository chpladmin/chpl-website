(() => {
    'use strict';

    describe('the Listing Details', () => {

        var $compile, $log, Mock, el, networkService, scope, vm;

        beforeEach(() => {
            angular.mock.module('chpl.mock', 'chpl.components', ($provide) => {
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

                el = angular.element('<ai-certs product="product"></ai-certs>');
                scope = $rootScope.$new();
                scope.product = Mock.fullListings[1];
                scope.product.sed = {testTasks: [], ucdProcesses: []};
                $compile(el)(scope);
                scope.$digest();
                vm = el.isolateScope().vm;
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
            it('should have isolate scope object with instanciate members', () => {
                expect(vm).toEqual(jasmine.any(Object));
            });

            describe('initial state', () => {
                it('should be open to criteria by default', () => {
                    expect(vm.panelShown).toBe('cert');
                });

                it('should be able to be open to nothing', () => {
                    el = angular.element('<ai-certs product="product" initial-panel="none"></ai-certs>');
                    $compile(el)(scope);
                    scope.$digest();
                    vm = el.isolateScope().vm;
                    expect(vm.panelShown).toBeUndefined();
                });

                it('should be able to be open to surveillance', () => {
                    el = angular.element('<ai-certs product="product" initial-panel="surveillance"></ai-certs>');
                    $compile(el)(scope);
                    scope.$digest();
                    vm = el.isolateScope().vm;
                    expect(vm.panelShown).toBe('surveillance');
                });
            });
        });
    });
})();
