(function () {
    'use strict';

    describe('the Listing Details', function () {

        var $compile, $log, $uibModal, Mock, actualOptions, commonService, el, scope, vm;

        var mock = {};
        mock.product = {
            certificationResults: [],
            cqms: [],
        }
        mock.icsFamily = [{ id: 1}];

        beforeEach(function () {
            module('chpl.templates', 'chpl.mock', 'chpl', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.getIcsFamily = jasmine.createSpy('getIcsFamily');
                    $delegate.getSurveillanceLookups = jasmine.createSpy('getSurveillanceLookups');
                    return $delegate;
                });
            });

            inject(function (_$compile_, _$log_, $q, $rootScope, _$uibModal_, _Mock_, _commonService_) {
                $compile = _$compile_;
                $log = _$log_;
                commonService = _commonService_;
                commonService.getIcsFamily.and.returnValue($q.when(mock.icsFamily));
                commonService.getSurveillanceLookups.and.returnValue($q.when({}));
                Mock = _Mock_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return Mock.fakeModal;
                });

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

            describe('when viewing ICS Family trees', function () {
                var icsFamilyOptions;
                beforeEach(function () {
                    icsFamilyOptions = {
                        templateUrl: 'app/components/listing_details/ics_family/icsFamilyModal.html',
                        controller: 'IcsFamilyController',
                        controllerAs: 'vm',
                        animation: false,
                        backdrop: 'static',
                        keyboard: false,
                        size: 'lg',
                        resolve: {
                            family: jasmine.any(Function),
                            listing: jasmine.any(Function),
                        },
                    };
                });

                it('should get the family from the commonService before opening the modal', function () {
                    vm.viewIcsFamily();
                    scope.$digest();
                    expect(commonService.getIcsFamily).toHaveBeenCalled();
                });

                it('should create a modal instance', function () {
                    expect(vm.uibModalInstance).toBeUndefined();
                    vm.viewIcsFamily();
                    scope.$digest();
                    expect(vm.uibModalInstance).toBeDefined();
                });

                it('should resolve elements', function () {
                    vm.product = {
                        id: 1,
                    };
                    vm.viewIcsFamily();
                    scope.$digest();
                    expect($uibModal.open).toHaveBeenCalledWith(icsFamilyOptions);
                    expect(actualOptions.resolve.family()).toEqual(mock.icsFamily);
                    expect(actualOptions.resolve.listing()).toEqual(vm.product);
                });
            });
        });
    });
})();
