(function () {
    'use strict';

    describe('surveillance directive', function () {
        var $log, $q, $uibModal, Mock, actualOptions, el, networkService, scope, vm;

        beforeEach(function () {
            angular.mock.module('chpl.mock', 'chpl', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getProduct = jasmine.createSpy('getProduct');
                    $delegate.getSurveillanceLookups = jasmine.createSpy('getSurveillanceLookups');
                    return $delegate;
                });
            });

            inject(function ($compile, _$log_, _$q_, $rootScope, _$uibModal_, _Mock_, _networkService_) {
                $q = _$q_;
                $log = _$log_;
                networkService = _networkService_;
                networkService.getProduct.and.returnValue($q.when({}));
                networkService.getSurveillanceLookups.and.returnValue($q.when({}));
                Mock = _Mock_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return Mock.fakeModal;
                });

                el = angular.element('<ai-surveillance></ai-surveillance>');

                scope = $rootScope.$new();
                $compile(el)(scope);
                scope.$digest();
                vm = el.isolateScope().vm;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.debug('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        it('should be compiled', function () {
            expect(el.html()).not.toEqual(null);
        });

        it('should have isolate scope object with instanciate members', function () {
            expect(vm).toEqual(jasmine.any(Object));
        });

        describe('surveillance titles', function () {
            it('should come up with correct titles when there were no NCs', function () {
                var surv = {
                    endDate: new Date('Wed, 30 Mar 2016 12:00:00 GMT'),
                    requirements: [{nonconformities: []}],
                };
                expect(vm.getTitle(surv)).toEqual('Closed Surveillance, Ended Mar 30, 2016: No Non-Conformities Were Found');
            });

            it('should come up with correct titles when there was 1 open NC', function () {
                var surv = {
                    endDate: new Date('Wed, 30 Mar 2016 12:00:00 GMT'),
                    requirements: [{nonconformities: [{status: {name: 'Open'}}]}],
                };
                expect(vm.getTitle(surv)).toEqual('Closed Surveillance, Ended Mar 30, 2016: 1 Open Non-Conformity Was Found');
            });

            it('should come up with correct titles when there were multiple open NCs', function () {
                var surv = {
                    endDate: new Date('Wed, 30 Mar 2016 12:00:00 GMT'),
                    requirements: [{nonconformities: [{status: {name: 'Open'}}]}, {nonconformities: [{status: {name: 'Open'}}]}],
                };
                expect(vm.getTitle(surv)).toEqual('Closed Surveillance, Ended Mar 30, 2016: 2 Open Non-Conformities Were Found');
            });

            it('should come up with correct titles when there was 1 closed NC', function () {
                var surv = {
                    endDate: new Date('Wed, 30 Mar 2016 12:00:00 GMT'),
                    requirements: [{nonconformities: [{status: {name: 'Closed'}}]}],
                };
                expect(vm.getTitle(surv)).toEqual('Closed Surveillance, Ended Mar 30, 2016: 1 Closed Non-Conformity Was Found');
            });

            it('should come up with correct titles when there were multiple closed NCs', function () {
                var surv = {
                    endDate: new Date('Wed, 30 Mar 2016 12:00:00 GMT'),
                    requirements: [{nonconformities: [{status: {name: 'Closed'}}]}, {nonconformities: [{status: {name: 'Closed'}}]}],
                };
                expect(vm.getTitle(surv)).toEqual('Closed Surveillance, Ended Mar 30, 2016: 2 Closed Non-Conformities Were Found');
            });

            it('should come up with correct titles when there were open and closed NCs', function () {
                var surv = {
                    endDate: new Date('Wed, 30 Mar 2016 12:00:00 GMT'),
                    requirements: [{nonconformities: [{status: {name: 'Open'}}]}, {nonconformities: [{status: {name: 'Closed'}}]}],
                };
                expect(vm.getTitle(surv)).toEqual('Closed Surveillance, Ended Mar 30, 2016: 1 Open and 1 Closed Non-Conformities Were Found');
            });
        });

        describe('editing a Surveillance', function () {
            var surveillanceEditOptions;
            beforeEach(function () {
                surveillanceEditOptions = {
                    templateUrl: 'chpl.admin/components/surveillance/edit.html',
                    controller: 'EditSurveillanceController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        surveillance: jasmine.any(Function),
                        surveillanceTypes: jasmine.any(Function),
                        workType: jasmine.any(Function),
                    },
                };
                vm.surveillanceTypes = {
                    surveillanceRequirements: {
                        criteriaOptions2014: {},
                        criteriaOptions2015: {},
                    },
                };
                vm.certifiedProduct = {
                    id: 1,
                    certificationEdition: {
                        name: '2015',
                    },
                };
            });

            it('should create a modal instance when a Surveillance is to be edited', function () {
                expect(vm.uibModalInstance).toBeUndefined();
                vm.editSurveillance(Mock.surveillances[0]);
                expect(vm.uibModalInstance).toBeDefined();
            });

            it('should resolve elements on edit', function () {
                vm.editSurveillance(Mock.surveillances[0]);
                expect($uibModal.open).toHaveBeenCalledWith(surveillanceEditOptions);
                expect(actualOptions.resolve.surveillance()).toEqual(Mock.surveillances[0]);
                expect(actualOptions.resolve.surveillanceTypes()).toEqual({surveillanceRequirements: {
                    criteriaOptions2014: {},
                    criteriaOptions2015: {},
                    criteriaOptions: {},
                }});
                expect(actualOptions.resolve.workType()).toEqual('edit');
            });

            it('should do stuff with the returned data', function () {
                vm.editSurveillance(Mock.surveillances[0]);
                vm.uibModalInstance.close({});
                expect(networkService.getProduct).toHaveBeenCalled();
            });

            it('should log a non-cancelled modal', function () {
                var logCount = $log.info.logs.length;
                vm.editSurveillance(Mock.surveillances[0]);
                vm.uibModalInstance.dismiss('not cancelled');
                expect($log.info.logs.length).toBe(logCount + 1);
            });
        });

        describe('initiating a Surveillance', function () {
            var surveillanceInitiateOptions;
            beforeEach(function () {
                surveillanceInitiateOptions = {
                    templateUrl: 'chpl.admin/components/surveillance/edit.html',
                    controller: 'EditSurveillanceController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        surveillance: jasmine.any(Function),
                        surveillanceTypes: jasmine.any(Function),
                        workType: jasmine.any(Function),
                    },
                };
                vm.surveillanceTypes = {
                    surveillanceRequirements: {
                        criteriaOptions2014: {},
                        criteriaOptions2015: {},
                    },
                };
                vm.certifiedProduct = {
                    id: 1,
                    certificationEdition: {
                        name: '2015',
                    },
                };
            });

            it('should create a modal instance when a Surveillance is to be initiated', function () {
                expect(vm.uibModalInstance).toBeUndefined();
                vm.initiateSurveillance();
                expect(vm.uibModalInstance).toBeDefined();
            });

            it('should resolve elements on initiate', function () {
                vm.initiateSurveillance();
                expect($uibModal.open).toHaveBeenCalledWith(surveillanceInitiateOptions);
                expect(actualOptions.resolve.surveillance()).toEqual({certifiedProduct: vm.certifiedProduct});
                expect(actualOptions.resolve.surveillanceTypes()).toEqual({surveillanceRequirements: {
                    criteriaOptions2014: {},
                    criteriaOptions2015: {},
                    criteriaOptions: {},
                }});
                expect(actualOptions.resolve.workType()).toEqual('initiate');
            });

            it('should do stuff with the returned data', function () {
                vm.initiateSurveillance();
                vm.uibModalInstance.close({});
                expect(networkService.getProduct).toHaveBeenCalled();
            });

            it('should log a non-cancelled modal', function () {
                var logCount = $log.info.logs.length;
                vm.initiateSurveillance();
                vm.uibModalInstance.dismiss('not cancelled');
                expect($log.info.logs.length).toBe(logCount + 1);
            });
        });
    });
})();
