(function () {
    'use strict';

    fdescribe('the ACB Management component', function () {
        var $compile, $log, $q, $uibModal, Mock, actualOptions, authService, ctrl, el, networkService, scope;

        beforeEach(() => {
            angular.mock.module('chpl.mock', 'chpl.admin', function ($provide) {
                $provide.decorator('authService', function ($delegate) {
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');
                    return $delegate;
                });
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getUsersAtAcb = jasmine.createSpy('getUserAtAcb');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _$uibModal_, _Mock_, _authService_, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                $uibModal = _$uibModal_;
                Mock = _Mock_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return Mock.fakeModal;
                });
                authService = _authService_;
                authService.hasAnyRole.and.returnValue(true);
                networkService = _networkService_;
                networkService.getUsersAtAcb.and.returnValue($q.when({users: []}));

                scope = $rootScope.$new();
                scope.acb = {};

                el = angular.element('<ai-acb-management acb="acb" work-type="acb"></ai-acb-management>');
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

            it('should know if the logged in user is ACB and/or CHPL admin', function () {
                expect(ctrl.isAcbAdmin).toBeTruthy();
                expect(ctrl.isChplAdmin).toBeTruthy();
            });

            it('should set the workType to acb if it\'s undefined', function () {
                el = angular.element('<ai-acb-management acb="acb"></ai-acb-management>');
                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
                expect(ctrl.workType).toBe('acb');
            });

            describe('when editing an acb', function () {
                var acb, modalOptions;
                beforeEach(function () {
                    acb = {};
                    modalOptions = {
                        templateUrl: 'chpl.admin/components/acb/modal.html',
                        controller: 'ModalAcbController',
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
                    expect(ctrl.modalInstance).toBeUndefined();
                    ctrl.editAcb(acb);
                    expect(ctrl.modalInstance).toBeDefined();
                });

                it('should resolve elements', function () {
                    ctrl.editAcb(acb);
                    expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                    expect(actualOptions.resolve.acb()).toEqual(acb);
                    expect(actualOptions.resolve.action()).toBe('edit');
                    expect(actualOptions.resolve.isChplAdmin()).toBe(true);
                });

                it('should replace the acb with the response', function () {
                    ctrl.editAcb(acb);
                    ctrl.modalInstance.close({name: 'new'});
                    expect(ctrl.acb).toEqual({name: 'new'});
                });
            });

            describe('when creating an acb', function () {
                var modalOptions;
                beforeEach(function () {
                    modalOptions = {
                        templateUrl: 'chpl.admin/components/acb/modal.html',
                        controller: 'ModalAcbController',
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
                    expect(ctrl.modalInstance).toBeUndefined();
                    ctrl.createAcb();
                    expect(ctrl.modalInstance).toBeDefined();
                });

                it('should resolve elements', function () {
                    ctrl.createAcb();
                    expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                    expect(actualOptions.resolve.acb()).toEqual({});
                    expect(actualOptions.resolve.action()).toBe('create');
                    expect(actualOptions.resolve.isChplAdmin()).toBe(true);
                });

                it('should replace the acb with the response', function () {
                    ctrl.createAcb();
                    ctrl.modalInstance.close({name: 'new'});
                    expect(ctrl.acb).toEqual({name: 'new'});
                });
            });
        });
    });
})();
