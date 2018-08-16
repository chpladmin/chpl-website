(function () {
    'use strict';

    describe('the ACB Management', function () {
        var $compile, $log, $uibModal, Mock, actualOptions, authService, el, scope, vm;

        beforeEach(function () {
            module('chpl.templates', 'chpl.mock', 'chpl', 'chpl.admin', function ($provide) {
                $provide.decorator('authService', function ($delegate) {
                    $delegate.isAcbAdmin = jasmine.createSpy('isAcbAdmin');
                    $delegate.isChplAdmin = jasmine.createSpy('isChplAdmin');
                    return $delegate;
                });
            });
        });

        beforeEach(inject(function (_$compile_, _$log_, $rootScope, _$uibModal_, _Mock_, _authService_) {
            $compile = _$compile_;
            $log = _$log_;
            Mock = _Mock_;
            $uibModal = _$uibModal_;
            spyOn($uibModal, 'open').and.callFake(function (options) {
                actualOptions = options;
                return Mock.fakeModal;
            });
            authService = _authService_;
            authService.isAcbAdmin.and.returnValue(true);
            authService.isChplAdmin.and.returnValue(true);

            el = angular.element('<ai-acb-management active-acb="acb" work-type="acb"></ai-acb-management>');
            scope = $rootScope.$new();
            scope.acb = {};
            $compile(el)(scope);
            scope.$digest();
            vm = el.isolateScope().vm;
        }));

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

            it('should know if the logged in user is ACB and/or CHPL admin', function () {
                expect(vm.isAcbAdmin).toBeTruthy();
                expect(vm.isChplAdmin).toBeTruthy();
            });

            it('should set the workType to acb if it\'s undefined', function () {
                el = angular.element('<ai-acb-management active-acb="acb"></ai-acb-management>');
                $compile(el)(scope);
                scope.$digest();
                vm = el.isolateScope().vm;
                expect(vm.workType).toBe('acb');
            });

            describe('when editing an acb', function () {
                var acb, modalOptions;
                beforeEach(function () {
                    acb = {};
                    modalOptions = {
                        templateUrl: 'chpl.admin/components/acb/acbEdit.html',
                        controller: 'EditAcbController',
                        controllerAs: 'vm',
                        animation: false,
                        backdrop: 'static',
                        keyboard: false,
                        resolve: {
                            acb: jasmine.any(Function),
                            action: jasmine.any(Function),
                            isChplAdmin: jasmine.any(Function),
                        },
                    };
                });

                it('should create a modal instance', function () {
                    expect(vm.modalInstance).toBeUndefined();
                    vm.editAcb(acb);
                    expect(vm.modalInstance).toBeDefined();
                });

                it('should resolve elements', function () {
                    vm.editAcb(acb);
                    expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                    expect(actualOptions.resolve.acb()).toEqual(acb);
                    expect(actualOptions.resolve.action()).toBe('edit');
                    expect(actualOptions.resolve.isChplAdmin()).toBe(true);
                });

                it('should replace the acb with the response', function () {
                    vm.editAcb(acb);
                    vm.modalInstance.close({name: 'new'});
                    expect(vm.activeAcb).toEqual({name: 'new'});
                });

                it('should set the active ACB to null if it was deleted', function () {
                    vm.editAcb(acb);
                    vm.modalInstance.close('deleted');
                    expect(vm.activeAcb).toBe(null);
                });

                it('should log a non-cancelled modal', function () {
                    var logCount = $log.info.logs.length;
                    vm.editAcb(acb);
                    vm.modalInstance.dismiss('not cancelled');
                    expect($log.info.logs.length).toBe(logCount + 1);
                });

                it('should not log a cancelled modal', function () {
                    var logCount = $log.info.logs.length;
                    vm.editAcb(acb);
                    vm.modalInstance.dismiss('cancelled');
                    expect($log.info.logs.length).toBe(logCount);
                });
            });

            describe('when creating an acb', function () {
                var modalOptions;
                beforeEach(function () {
                    modalOptions = {
                        templateUrl: 'chpl.admin/components/acb/acbEdit.html',
                        controller: 'EditAcbController',
                        controllerAs: 'vm',
                        animation: false,
                        backdrop: 'static',
                        keyboard: false,
                        resolve: {
                            acb: jasmine.any(Function),
                            action: jasmine.any(Function),
                            isChplAdmin: jasmine.any(Function),
                        },
                    };
                });

                it('should create a modal instance', function () {
                    expect(vm.modalInstance).toBeUndefined();
                    vm.createAcb();
                    expect(vm.modalInstance).toBeDefined();
                });

                it('should resolve elements', function () {
                    vm.createAcb();
                    expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                    expect(actualOptions.resolve.acb()).toEqual({});
                    expect(actualOptions.resolve.action()).toBe('create');
                    expect(actualOptions.resolve.isChplAdmin()).toBe(true);
                });

                it('should replace the acb with the response', function () {
                    vm.createAcb();
                    vm.modalInstance.close({name: 'new'});
                    expect(vm.activeAcb).toEqual({name: 'new'});
                });

                it('should log a non-cancelled modal', function () {
                    var logCount = $log.info.logs.length;
                    vm.createAcb();
                    vm.modalInstance.dismiss('not cancelled');
                    expect($log.info.logs.length).toBe(logCount + 1);
                });

                it('should not log a cancelled modal', function () {
                    var logCount = $log.info.logs.length;
                    vm.createAcb();
                    vm.modalInstance.dismiss('cancelled');
                    expect($log.info.logs.length).toBe(logCount);
                });
            });
        });
    });
})();
