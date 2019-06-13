(() => {
    'use strict';

    fdescribe('the Confirm Surveillance component', () => {
        var $compile, $log, $q, $uibModal, Mock, actualOptions, authService, ctrl, el, mock, networkService, scope;

        mock = {};

        mock.uploadingSurveillances = {pendingSurveillance: []};

        beforeEach(() => {
            angular.mock.module('chpl.mock', 'chpl.surveillance', $provide => {
                $provide.decorator('authService', $delegate => {
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');

                    return $delegate;
                });

                $provide.decorator('networkService', $delegate => {
                    $delegate.getUploadingSurveillances = jasmine.createSpy('getUploadingSurveillances');
                    $delegate.massRejectPendingSurveillance = jasmine.createSpy('massRejectPendingSurveillance');

                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _$uibModal_, _Mock_, _authService_, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                Mock = _Mock_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(options => {
                    actualOptions = options;
                    return Mock.fakeModal;
                });
                authService = _authService_;
                authService.hasAnyRole.and.returnValue(true);
                networkService = _networkService_;
                networkService.getUploadingSurveillances.and.returnValue($q.when(mock.uploadingSurveillances));
                networkService.massRejectPendingSurveillance.and.returnValue($q.when({}));

                scope = $rootScope.$new();
                el = angular.element('<chpl-confirm-surveillance></chpl-confirm-surveillance>');

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
            it('should exist', () => {
                expect(ctrl).toEqual(jasmine.any(Object));
            });

            describe('rejecting pending surveillances', () => {
                beforeEach(() => {
                    ctrl.uploadingSurveillances = [{id: 1}, {id: 2}];
                    ctrl.massRejectSurveillance = {
                        1: true,
                        2: false,
                    };
                });

                xit('should call the common service to mass reject surveillances', () => {
                    ctrl.massRejectPendingSurveillance();
                    el.isolateScope().$digest();
                    expect(networkService.massRejectPendingSurveillance).toHaveBeenCalledWith([1]);
                });

                it('should reset the pending checkboxes', () => {
                    ctrl.massRejectPendingSurveillance();
                    expect(ctrl.massRejectSurveillance).toEqual({2: false});
                });

                it('should remove the surveillances from the list of surveillances', () => {
                    ctrl.massRejectPendingSurveillance();
                    expect(ctrl.uploadingSurveillances).toEqual([{id: 2}]);
                });

                xit('should have error messages if rejection fails', () => {
                    networkService.massRejectPendingSurveillance.and.returnValue($q.reject({data: {'errors': [
                        {'errorMessages': ['This pending certified product has already been confirmed or rejected by another user.'],'warningMessages': [],'objectId': '15.07.07.2642.EIC61.56.1.0.160402','contact': {'contactId': 32,'fullName': 'Mandy','friendlyName': 'Hancock','email': 'Mandy.hancock@greenwayhealth.com','phoneNumber': '205-443-4115','title': null}},
                        {'errorMessages': ['This pending certified product has already been confirmed or rejected by another user.'],'warningMessages': [],'objectId': '15.07.07.2642.EIC61.55.1.1.160402','contact': {'contactId': 32,'fullName': 'Mandy','friendlyName': 'Hancock','email': 'Mandy.hancock@greenwayhealth.com','phoneNumber': '205-443-4115','title': null}},
                        {'errorMessages': ['This pending certified product has already been confirmed or rejected by another user.'],'warningMessages': [],'objectId': '15.07.07.2642.EIC61.56.1.2.160402','contact': {'contactId': 32,'fullName': 'Mandy','friendlyName': 'Hancock','email': 'Mandy.hancock@greenwayhealth.com','phoneNumber': '205-443-4115','title': null}},
                    ]}}));
                    ctrl.massRejectPendingSurveillance();
                    el.isolateScope().$digest();
                    expect(ctrl.uploadingSurveillanceMessages.length).toEqual(3);
                });

                it('should know how many Surveillance are ready to be rejected', () => {
                    expect(ctrl.getNumberOfSurveillanceToReject()).toBe(1);
                    ctrl.massRejectSurveillance[2] = true;
                    ctrl.massRejectSurveillance[3] = true;
                    expect(ctrl.getNumberOfSurveillanceToReject()).toBe(3);
                    ctrl.massRejectSurveillance[1] = false;
                    ctrl.massRejectSurveillance[2] = false;
                    ctrl.massRejectSurveillance[3] = false;
                    expect(ctrl.getNumberOfSurveillanceToReject()).toBe(0);
                });
            });

            describe('inspecting a pending Surveillance', () => {
                var surveillanceInspectOptions;
                beforeEach(() => {
                    ctrl.uploadingSurveillances = [
                        {id: 1},
                        {id: 2},
                    ];
                    surveillanceInspectOptions = {
                        component: 'aiSurveillanceInspect',
                        animation: false,
                        backdrop: 'static',
                        keyboard: false,
                        size: 'lg',
                        resolve: {
                            surveillance: jasmine.any(Function),
                        },
                    };
                });

                it('should create a modal instance when a Listing is to be edited', () => {
                    expect(ctrl.modalInstance).toBeUndefined();
                    ctrl.inspectSurveillance({})
                    expect(ctrl.modalInstance).toBeDefined();
                });

                xit('should resolve elements on inspect', () => {
                    ctrl.inspectSurveillance({id: 'a surveillance'})
                    expect($uibModal.open).toHaveBeenCalledWith(surveillanceInspectOptions);
                    expect(actualOptions.resolve.surveillance()).toEqual({id: 'a surveillance'});
                    el.isolateScope().$digest();
                });

                it('should remove the inspected surv on close', () => {
                    var result = {
                        status: 'confirmed',
                    };
                    ctrl.inspectSurveillance(ctrl.uploadingSurveillances[0]);
                    ctrl.modalInstance.close(result);
                    expect(ctrl.uploadingSurveillances).toEqual([{id: 2}]);
                });

                it('should report the user who did something on resolved', () => {
                    var result = {
                        status: 'resolved',
                        objectId: 'id',
                        contact: {
                            fullName: 'fname',
                            friendlyName: 'lname',
                        },
                    };
                    ctrl.inspectSurveillance(ctrl.uploadingSurveillances[0]);
                    ctrl.modalInstance.close(result);
                    expect(ctrl.uploadingSurveillanceMessages[0]).toEqual('Surveillance with ID: "id" has already been resolved by "fname"');
                });
            });
        });
    });
})();
