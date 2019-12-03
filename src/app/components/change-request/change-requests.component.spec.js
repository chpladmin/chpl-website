(() => {
    'use strict';

    fdescribe('the Change Requests component', () => {
        var $compile, $log, ctrl, el, mock, scope;

        mock = {
            changeRequests: [{
                id: 3,
                currentStatus: {
                    changeRequestStatusType: {
                        name: 'Rejected',
                    },
                    statusChangeDate: 1571148799528,
                },
                changeRequestType: {
                    name: 'A change',
                },
                developer: {
                    name: 'A name',
                },
                submittedDate: 1571148799528,
            }],
            changeRequestStatusTypes: {
                data: [{
                    id: 1,
                    name: 'Rejected',
                }, {
                    name: 'Cancelled by Requester',
                }, {
                    name: 'Pending ONC-ACB Action',
                }],
            },
            developer: {
                id: 1,
            },
        };

        beforeEach(() => {
            angular.mock.module('chpl.components');

            inject((_$compile_, _$log_, $rootScope) => {
                $compile = _$compile_;
                $log = _$log_;

                scope = $rootScope.$new();
                scope.changeRequests = angular.copy(mock.changeRequests);
                scope.changeRequestStatusTypes = mock.changeRequestStatusTypes;
                scope.developer = mock.developer;
                scope.takeAction = jasmine.createSpy('takeAction');

                el = angular.element('<chpl-change-requests change-requests="changeRequests" change-request-status-types="changeRequestStatusTypes" developer="developer" take-action="takeAction(action, data)">></chpl-change-requests>');

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

            describe('on change/init', () => {
                it('should make copies of inputs', () => {
                    expect(ctrl.changeRequestStatusTypes).not.toBe(mock.changeRequestStatusTypes);
                    expect(ctrl.changeRequestStatusTypes).toEqual(mock.changeRequestStatusTypes);
                    expect(ctrl.developer).not.toBe(mock.developer);
                    expect(ctrl.developer).toEqual(mock.developer);
                });

                it('shouldn\'t change anything that shouldn\'t change', () => {
                    let changeRequests = ctrl.changeRequests;
                    ctrl.$onChanges({});
                    expect(changeRequests).toBe(ctrl.changeRequests);
                });

                it('should pull up current data', () => {
                    expect(ctrl.changeRequests[0].requestStatus).toBe('Rejected');
                    expect(ctrl.changeRequests[0].changeDate.getTime()).toBe(1571148799528);
                    expect(ctrl.changeRequests[0].developerName).toBe('A name');
                    expect(ctrl.changeRequests[0].requestType).toBe('A change');
                    expect(ctrl.changeRequests[0].friendlyCreationDate).toBe('2019-10-15 14:13:19 +0000');
                    expect(ctrl.changeRequests[0].friendlyChangeDate).toBe('2019-10-15 14:13:19 +0000');
                });
            });

            describe('when acting', () => {
                describe('to cancel', () => {
                    it('should set activity and take action', () => {
                        ctrl.activity = 'something';
                        ctrl.act('cancel');
                        expect(ctrl.activity).toBe('Tracking');
                        expect(scope.takeAction).toHaveBeenCalledWith('cancel', undefined);
                    });

                    it('should work when no active state', () => {
                        ctrl.changeRequests = [];
                        ctrl.activeChangeRequest = 3;
                        ctrl.act('cancel');
                        expect(ctrl.changeRequests.length).toBeGreaterThan(0);
                        expect(ctrl.activeChangeRequest).toBeUndefined();
                    });

                    it('should work when there is an active state', () => {
                        ctrl.activeState = 'edit';
                        ctrl.activeChangeRequest = ctrl.changeRequests[0];
                        let initRequest = ctrl.activeChangeRequest;
                        ctrl.act('cancel');
                        expect(ctrl.activeState).toBeUndefined();
                        expect(ctrl.activeChangeRequest).not.toBe(initRequest);
                    });

                    it('should be able to do a complete cancellation', () => {
                        ctrl.activity = 'something';
                        ctrl.activeState = 'edit';
                        ctrl.activeChangeRequest = ctrl.changeRequests[0];
                        ctrl.act('fullCancel');
                        expect(ctrl.activity).toBe('Tracking');
                        expect(ctrl.activeState).toBeUndefined();
                        expect(ctrl.activeChangeRequest).toBeUndefined();
                        expect(scope.takeAction).toHaveBeenCalledWith('cancel', undefined);
                    });
                });

                describe('to switch mode', () => {
                    beforeEach(() => {
                        ctrl.activeChangeRequest = ctrl.changeRequests[0];
                    });

                    it('should handle edit', () => {
                        ctrl.act('edit');
                        expect(ctrl.activeState).toBe('edit');
                        expect(ctrl.activity).toBe('Editing - Change Request | Submitted on Oct 15, 2019');
                        expect(scope.takeAction).toHaveBeenCalledWith('focus', undefined);
                    });

                    it('should handle statusLog', () => {
                        ctrl.act('statusLog');
                        expect(ctrl.activeState).toBe('log');
                        expect(ctrl.activity).toBe('Status Log - Change Request | Submitted on Oct 15, 2019');
                        expect(scope.takeAction).toHaveBeenCalledWith('focus', undefined);
                    });

                    it('should handle withdraw', () => {
                        ctrl.act('withdraw');
                        expect(ctrl.activeState).toBe('withdraw');
                        expect(ctrl.activity).toBe('Withdraw - Change Request | Submitted on Oct 15, 2019');
                        expect(scope.takeAction).toHaveBeenCalledWith('focus', undefined);
                    });
                });

                describe('to receive an update', () => {
                    it('should set the active CR and validity', () => {
                        expect(ctrl.activeChangeRequest).toBeUndefined;
                        expect(ctrl.isValid).toBe(true);
                        let newCr = {id: 3};
                        ctrl.act('update', { changeRequest: newCr, validity: 3 });
                        expect(ctrl.activeChangeRequest).toBe(newCr);
                        expect(ctrl.isValid).toBe(3);
                    });
                });

                describe('to save', () => {
                    it('should handle basic edit', () => {
                        let activeCR = {
                            currentStatus: {
                                changeRequestStatusType: {
                                    name: 'Pending ONC-ACB Action',
                                },
                            },
                        };
                        ctrl.activeState = 'edit';
                        ctrl.activeChangeRequest = activeCR;
                        ctrl.act('save');
                        expect(scope.takeAction).toHaveBeenCalledWith('save', activeCR);
                    });
                });

                describe('to withdraw', () => {
                    it('should handle data', () => {
                        let activeCR = {
                            currentStatus: {
                                changeRequestStatusType: {
                                    name: 'Pending ONC-ACB Action',
                                },
                            },
                            comment: 'a comment here',
                        };
                        let expectedCR = angular.copy(activeCR);
                        expectedCR.currentStatus.changeRequestStatusType.name = 'Cancelled by Requester';
                        expectedCR.currentStatus.comment = 'a comment here';
                        ctrl.activeState = 'withdraw';
                        ctrl.activeChangeRequest = activeCR;
                        ctrl.act('save');
                        expect(scope.takeAction).toHaveBeenCalledWith('save', expectedCR);
                    });
                });

                describe('when pending Developer action', () => {
                    it('should handle edit', () => {
                        let activeCR = {
                            currentStatus: {
                                changeRequestStatusType: {
                                    name: 'Pending Developer Action',
                                },
                            },
                            comment: 'a comment here',
                        };
                        let expectedCR = angular.copy(activeCR);
                        expectedCR.currentStatus.changeRequestStatusType.name = 'Pending ONC-ACB Action';
                        expectedCR.currentStatus.comment = 'a comment here';
                        ctrl.activeState = 'edit';
                        ctrl.activeChangeRequest = activeCR;
                        ctrl.act('save');
                        expect(scope.takeAction).toHaveBeenCalledWith('save', expectedCR);
                    });
                });
            });
        });
    });
})();
