(function () {
    'use strict';

    describe('the Listing Details', function () {

        var $compile, $log, commonService, el, scope, vm;

        var mock = {};
        mock.product = {
            certificationResults: [],
            cqms: [],
        }

        beforeEach(function () {
            module('chpl.templates', 'chpl', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.getSurveillanceLookups = jasmine.createSpy('getSurveillanceLookups');
                    return $delegate;
                });
            });

            inject(function (_$compile_, _$log_, $q, $rootScope, _commonService_) {
                $compile = _$compile_;
                $log = _$log_;
                commonService = _commonService_;
                commonService.getSurveillanceLookups.and.returnValue($q.when({}));

                el = angular.element('<ai-certs product="product"></ai-certs>');
                scope = $rootScope.$new();
                scope.product = mock.product;
                $compile(el)(scope);
                scope.$digest();
                vm = el.isolateScope().vm;
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
            it('should have isolate scope object with instanciate members', function () {
                expect(vm).toEqual(jasmine.any(Object));
            });

            describe('initial state', function () {
                it('should be open to criteria by default', function () {
                    expect(vm.panelShown).toBe('cert');
                });

                it('should be able to be open to nothing', function () {
                    el = angular.element('<ai-certs product="product" initial-panel="none"></ai-certs>');
                    $compile(el)(scope);
                    scope.$digest();
                    vm = el.isolateScope().vm;
                    expect(vm.panelShown).toBeUndefined();
                });

                it('should be able to be open to surveillance', function () {
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
