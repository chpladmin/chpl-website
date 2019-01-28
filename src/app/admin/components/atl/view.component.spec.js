(function () {
    'use strict';

    describe('the ATL Management component', function () {
        var $compile, $log, $uibModal, Mock, actualOptions, authService, ctrl, el, scope;

        beforeEach(function () {
            angular.mock.module('chpl.mock', 'chpl', 'chpl.admin', function ($provide) {
                $provide.decorator('authService', function ($delegate) {
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, $rootScope, _$uibModal_, _Mock_, _authService_) => {
                $compile = _$compile_;
                $log = _$log_;
                Mock = _Mock_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return Mock.fakeModal;
                });
                authService = _authService_;
                authService.hasAnyRole.and.returnValue(true);

                scope = $rootScope.$new();
                scope.atl = {};

                el = angular.element('<ai-atl-management atl="atl" work-type="atl"></ai-atl-management>');
                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
            })
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('view', function () {
            it('should be compiled', function () {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', function () {
            it('should have isolate scope object with instanciate members', function () {
                expect(ctrl).toEqual(jasmine.any(Object));
            });

            it('should know if the logged in user is ATL and/or CHPL admin', function () {
                expect(ctrl.isAtlAdmin).toBeTruthy();
                expect(ctrl.isChplAdmin).toBeTruthy();
            });

            it('should set the workType to atl if it\'s undefined', function () {
                el = angular.element('<ai-atl-management atl="atl"></ai-atl-management>');
                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
                expect(ctrl.workType).toBe('atl');
            });

            describe('when editing an atl', function () {
                var atl, modalOptions;
                beforeEach(function () {
                    atl = {};
                    modalOptions = {
                        templateUrl: 'chpl.admin/components/atl/modal.html',
                        controller: 'ModalAtlController',
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
                    expect(ctrl.modalInstance).toBeUndefined();
                    ctrl.editAtl(atl);
                    expect(ctrl.modalInstance).toBeDefined();
                });

                it('should resolve elements', function () {
                    ctrl.editAtl(atl);
                    expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                    expect(actualOptions.resolve.atl()).toEqual(atl);
                    expect(actualOptions.resolve.action()).toBe('edit');
                    expect(actualOptions.resolve.isChplAdmin()).toBe(true);
                });

                it('should replace the atl with the response', function () {
                    ctrl.editAtl(atl);
                    ctrl.modalInstance.close({name: 'new'});
                    expect(ctrl.atl).toEqual({name: 'new'});
                });
            });

            describe('when creating an atl', function () {
                var modalOptions;
                beforeEach(function () {
                    modalOptions = {
                        templateUrl: 'chpl.admin/components/atl/modal.html',
                        controller: 'ModalAtlController',
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
                    expect(ctrl.modalInstance).toBeUndefined();
                    ctrl.createAtl();
                    expect(ctrl.modalInstance).toBeDefined();
                });

                it('should resolve elements', function () {
                    ctrl.createAtl();
                    expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                    expect(actualOptions.resolve.atl()).toEqual({});
                    expect(actualOptions.resolve.action()).toBe('create');
                    expect(actualOptions.resolve.isChplAdmin()).toBe(true);
                });

                it('should replace the atl with the response', function () {
                    ctrl.createAtl();
                    ctrl.modalInstance.close({name: 'new'});
                    expect(ctrl.atl).toEqual({name: 'new'});
                });
            });
        });
    });
})();
