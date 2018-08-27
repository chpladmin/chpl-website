(function () {
    'use strict';

    describe('the ATL Management', function () {
        var $compile, $log, $uibModal, Mock, actualOptions, authService, el, scope, vm;

        beforeEach(function () {
            angular.mock.module('chpl.mock', 'chpl', 'chpl.admin', function ($provide) {
                $provide.decorator('authService', function ($delegate) {
                    $delegate.isAtlAdmin = jasmine.createSpy('isAtlAdmin');
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
            authService.isAtlAdmin.and.returnValue(true);
            authService.isChplAdmin.and.returnValue(true);

            el = angular.element('<ai-atl-management active-atl="atl" work-type="atl"></ai-atl-management>');
            scope = $rootScope.$new();
            scope.atl = {};
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

            it('should know if the logged in user is ATL and/or CHPL admin', function () {
                expect(vm.isAtlAdmin).toBeTruthy();
                expect(vm.isChplAdmin).toBeTruthy();
            });

            it('should set the workType to atl if it\'s undefined', function () {
                el = angular.element('<ai-atl-management active-atl="atl"></ai-atl-management>');
                $compile(el)(scope);
                scope.$digest();
                vm = el.isolateScope().vm;
                expect(vm.workType).toBe('atl');
            });

            describe('when editing an atl', function () {
                var atl, modalOptions;
                beforeEach(function () {
                    atl = {};
                    modalOptions = {
                        templateUrl: 'chpl.admin/components/atl/atlEdit.html',
                        controller: 'EditAtlController',
                        controllerAs: 'vm',
                        animation: false,
                        backdrop: 'static',
                        keyboard: false,
                        resolve: {
                            atl: jasmine.any(Function),
                            action: jasmine.any(Function),
                            isChplAdmin: jasmine.any(Function),
                        },
                    };
                });

                it('should create a modal instance', function () {
                    expect(vm.modalInstance).toBeUndefined();
                    vm.editAtl(atl);
                    expect(vm.modalInstance).toBeDefined();
                });

                it('should resolve elements', function () {
                    vm.editAtl(atl);
                    expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                    expect(actualOptions.resolve.atl()).toEqual(atl);
                    expect(actualOptions.resolve.action()).toBe('edit');
                    expect(actualOptions.resolve.isChplAdmin()).toBe(true);
                });

                it('should replace the atl with the response', function () {
                    vm.editAtl(atl);
                    vm.modalInstance.close({name: 'new'});
                    expect(vm.activeAtl).toEqual({name: 'new'});
                });

                it('should set the active ATL to null if it was deleted', function () {
                    vm.editAtl(atl);
                    vm.modalInstance.close('deleted');
                    expect(vm.activeAtl).toBe(null);
                });

                it('should log a non-cancelled modal', function () {
                    var logCount = $log.info.logs.length;
                    vm.editAtl(atl);
                    vm.modalInstance.dismiss('not cancelled');
                    expect($log.info.logs.length).toBe(logCount + 1);
                });

                it('should not log a cancelled modal', function () {
                    var logCount = $log.info.logs.length;
                    vm.editAtl(atl);
                    vm.modalInstance.dismiss('cancelled');
                    expect($log.info.logs.length).toBe(logCount);
                });
            });

            describe('when creating an atl', function () {
                var modalOptions;
                beforeEach(function () {
                    modalOptions = {
                        templateUrl: 'chpl.admin/components/atl/atlEdit.html',
                        controller: 'EditAtlController',
                        controllerAs: 'vm',
                        animation: false,
                        backdrop: 'static',
                        keyboard: false,
                        resolve: {
                            atl: jasmine.any(Function),
                            action: jasmine.any(Function),
                            isChplAdmin: jasmine.any(Function),
                        },
                    };
                });

                it('should create a modal instance', function () {
                    expect(vm.modalInstance).toBeUndefined();
                    vm.createAtl();
                    expect(vm.modalInstance).toBeDefined();
                });

                it('should resolve elements', function () {
                    vm.createAtl();
                    expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                    expect(actualOptions.resolve.atl()).toEqual({});
                    expect(actualOptions.resolve.action()).toBe('create');
                    expect(actualOptions.resolve.isChplAdmin()).toBe(true);
                });

                it('should replace the atl with the response', function () {
                    vm.createAtl();
                    vm.modalInstance.close({name: 'new'});
                    expect(vm.activeAtl).toEqual({name: 'new'});
                });

                it('should log a non-cancelled modal', function () {
                    var logCount = $log.info.logs.length;
                    vm.createAtl();
                    vm.modalInstance.dismiss('not cancelled');
                    expect($log.info.logs.length).toBe(logCount + 1);
                });

                it('should not log a cancelled modal', function () {
                    var logCount = $log.info.logs.length;
                    vm.createAtl();
                    vm.modalInstance.dismiss('cancelled');
                    expect($log.info.logs.length).toBe(logCount);
                });
            });
        });
    });
})();
