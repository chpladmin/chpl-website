(function () {
    'use strict';

    describe('the Certification Criteria', function () {
        var $analytics, $compile, $log, $uibModal, Mock, actualOptions, el, mock, scope, vm;

        mock = {};
        mock.cert = {id: 1, name: 'initial cert'};

        beforeEach(function () {
            angular.mock.module('chpl.mock', 'chpl');

            inject(function (_$analytics_, _$compile_, _$log_, $rootScope, _$uibModal_, _Mock_) {
                $analytics = _$analytics_;
                $compile = _$compile_;
                $log = _$log_;
                Mock = _Mock_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return Mock.fakeModal;
                });

                el = angular.element('<ai-certification-criteria cert="cert"></ai-certification-criteria>');
                scope = $rootScope.$new();
                scope.cert = mock.cert;
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

            describe('when asked about phantom data', function () {
                it('should not indicate any if the cert has success=true', function () {
                    vm.cert.success = true;
                    expect(vm.hasPhantomData()).toBe(false);
                });

                describe('and the cert has success=false', function () {
                    beforeEach(function () {
                        vm.cert = {success: false};
                    });

                    it('should analyze additionalSoftware', function () {
                        expect(vm.hasPhantomData()).toBe(false);
                        vm.cert.additionalSoftware = [];
                        expect(vm.hasPhantomData()).toBe(false);
                        vm.cert.additionalSoftware = [1];
                        expect(vm.hasPhantomData()).toBe(true);
                    });

                    it('should analyze apiDocumentation', function () {
                        expect(vm.hasPhantomData()).toBe(false);
                        vm.cert.apiDocumentation = '';
                        expect(vm.hasPhantomData()).toBe(false);
                        vm.cert.apiDocumentation = 'something fake';
                        expect(vm.hasPhantomData()).toBe(true);
                    });

                    it('should analyze g1MacraMeasures', function () {
                        expect(vm.hasPhantomData()).toBe(false);
                        vm.cert.g1MacraMeasures = [];
                        expect(vm.hasPhantomData()).toBe(false);
                        vm.cert.g1MacraMeasures = [1];
                        expect(vm.hasPhantomData()).toBe(false);
                    });

                    it('should analyze g1Success', function () {
                        vm.cert.g1Success = null;
                        expect(vm.hasPhantomData()).toBe(false);
                        vm.cert.g1Success = false;
                        expect(vm.hasPhantomData()).toBe(false);
                        vm.cert.g1Success = true;
                        expect(vm.hasPhantomData()).toBe(false);
                    });

                    it('should analyze g2MacraMeasures', function () {
                        expect(vm.hasPhantomData()).toBe(false);
                        vm.cert.g2MacraMeasures = [];
                        expect(vm.hasPhantomData()).toBe(false);
                        vm.cert.g2MacraMeasures = [1];
                        expect(vm.hasPhantomData()).toBe(false);
                    });

                    it('should analyze g2Success', function () {
                        vm.cert.g2Success = null;
                        expect(vm.hasPhantomData()).toBe(false);
                        vm.cert.g2Success = false;
                        expect(vm.hasPhantomData()).toBe(false);
                        vm.cert.g2Success = true;
                        expect(vm.hasPhantomData()).toBe(false);
                    });

                    it('should analyze gap', function () {
                        expect(vm.hasPhantomData()).toBe(false);
                        vm.cert.gap = false;
                        expect(vm.hasPhantomData()).toBe(false);
                        vm.cert.gap = true;
                        expect(vm.hasPhantomData()).toBe(true);
                    });

                    it('should analyze privacySecurityFramework', function () {
                        expect(vm.hasPhantomData()).toBe(false);
                        vm.cert.privacySecurityFramework = '';
                        expect(vm.hasPhantomData()).toBe(false);
                        vm.cert.privacySecurityFramework = 'something fake';
                        expect(vm.hasPhantomData()).toBe(true);
                    });

                    it('should analyze sed', function () {
                        expect(vm.hasPhantomData()).toBe(false);
                        vm.cert.sed = false;
                        expect(vm.hasPhantomData()).toBe(false);
                        vm.cert.sed = true;
                        expect(vm.hasPhantomData()).toBe(true);
                    });

                    it('should analyze testDataUsed', function () {
                        expect(vm.hasPhantomData()).toBe(false);
                        vm.cert.testDataUsed = [];
                        expect(vm.hasPhantomData()).toBe(false);
                        vm.cert.testDataUsed = [1];
                        expect(vm.hasPhantomData()).toBe(true);
                    });

                    it('should analyze testFunctionality', function () {
                        expect(vm.hasPhantomData()).toBe(false);
                        vm.cert.testFunctionality = [];
                        expect(vm.hasPhantomData()).toBe(false);
                        vm.cert.testFunctionality = [1];
                        expect(vm.hasPhantomData()).toBe(true);
                    });

                    it('should analyze testProcedures', function () {
                        expect(vm.hasPhantomData()).toBe(false);
                        vm.cert.testProcedures = [];
                        expect(vm.hasPhantomData()).toBe(false);
                        vm.cert.testProcedures = [1];
                        expect(vm.hasPhantomData()).toBe(true);
                    });

                    it('should analyze testStandards', function () {
                        expect(vm.hasPhantomData()).toBe(false);
                        vm.cert.testStandards = [];
                        expect(vm.hasPhantomData()).toBe(false);
                        vm.cert.testStandards = [1];
                        expect(vm.hasPhantomData()).toBe(true);
                    });

                    it('should analyze testToolsUsed', function () {
                        expect(vm.hasPhantomData()).toBe(false);
                        vm.cert.testToolsUsed = [];
                        expect(vm.hasPhantomData()).toBe(false);
                        vm.cert.testToolsUsed = [1];
                        expect(vm.hasPhantomData()).toBe(true);
                    });
                });
            });

            describe('when editing the certification', function () {
                var modalOptions;
                beforeEach(function () {
                    modalOptions = {
                        templateUrl: 'chpl.components/listing_details/criteriaModal.html',
                        controller: 'EditCertificationCriteriaController',
                        controllerAs: 'vm',
                        animation: false,
                        backdrop: 'static',
                        keyboard: false,
                        size: 'lg',
                        resolve: {
                            cert: jasmine.any(Function),
                            hasIcs: jasmine.any(Function),
                            resources: jasmine.any(Function),
                        },
                    };
                });

                it('should create a modal instance', function () {
                    expect(vm.editUibModalInstance).toBeUndefined();
                    vm.editCert();
                    expect(vm.editUibModalInstance).toBeDefined();
                });

                it('should resolve elements', function () {
                    var hasIcs = true;
                    var resources = {}
                    vm.hasIcs = hasIcs;
                    vm.resources = resources;
                    vm.editCert();
                    expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                    expect(actualOptions.resolve.cert()).toEqual(vm.cert);
                    expect(actualOptions.resolve.hasIcs()).toEqual(hasIcs);
                    expect(actualOptions.resolve.resources()).toEqual(resources);
                });

                it('should restore the cert if cancelled', function () {
                    vm.editCert();
                    vm.cert = {id: 2, name: 'an edited cert'};
                    vm.editUibModalInstance.dismiss();
                    expect(vm.cert).toEqual(mock.cert);
                });
            });

            describe('when toggling a criteria', function () {
                it('should flip from viewing to hiding', function () {
                    expect(vm.showDetails).toBeFalsy();
                    vm.toggleCriteria();
                    expect(vm.showDetails).toBe(true);
                    vm.toggleCriteria();
                    expect(vm.showDetails).toBe(false);
                });

                it('should track analytics when it opens', function () {
                    spyOn($analytics, 'eventTrack');
                    vm.toggleCriteria();
                    expect($analytics.eventTrack).toHaveBeenCalled();
                    expect($analytics.eventTrack.calls.count()).toBe(1);
                    vm.toggleCriteria();
                    expect($analytics.eventTrack.calls.count()).toBe(1);
                    vm.toggleCriteria();
                    expect($analytics.eventTrack.calls.count()).toBe(2);
                });
            });
        });
    });
})();
