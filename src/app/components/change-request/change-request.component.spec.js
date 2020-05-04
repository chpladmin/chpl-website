(() => {
    'use strict';

    describe('the ChangeRequest component', () => {
        var $compile, $log, ctrl, el, mock, scope;

        mock = {
            changeRequest: {
                changeRequestId: 43,
                currentStatus: {
                    changeRequestStatusType: {
                        name: 'Pending ONC-ACB Action',
                    },
                },
                statuses: [],
            },
        };

        beforeEach(() => {
            angular.mock.module('chpl.components');

            inject((_$compile_, _$log_, $rootScope) => {
                $compile = _$compile_;
                $log = _$log_;

                scope = $rootScope.$new();
                scope.changeRequest = mock.changeRequest;
                scope.takeAction = jasmine.createSpy('takeAction');

                el = angular.element('<chpl-change-request change-request="changeRequest" take-action="takeAction(action, data)"></chpl-change-request>');

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
                    expect(ctrl.changeRequest).not.toBe(mock.changeRequest);
                    expect(ctrl.changeRequest).toEqual(mock.changeRequest);
                });

                it('shouldn\'t change anything that shouldn\'t change', () => {
                    let changeRequest = ctrl.changeRequest;
                    ctrl.$onChanges({});
                    expect(changeRequest).toBe(ctrl.changeRequest);
                });

                describe('when looking at history and acting organizations', () => {
                    it('should set it to "ONC" for ROLE_ADMIN', () => {
                        let changes = {
                            changeRequest: {
                                currentValue: {
                                    statuses: [{
                                        userPermission: {
                                            authority: 'ROLE_ADMIN',
                                        },
                                    }],
                                },
                            },
                        };
                        ctrl.$onChanges(changes)
                        expect(ctrl.changeRequest.statuses[0].actingOrganization).toBe('ONC');
                    });

                    it('should set it to "ONC" for ROLE_ONC', () => {
                        let changes = {
                            changeRequest: {
                                currentValue: {
                                    statuses: [{
                                        userPermission: {
                                            authority: 'ROLE_ONC',
                                        },
                                    }],
                                },
                            },
                        };
                        ctrl.$onChanges(changes)
                        expect(ctrl.changeRequest.statuses[0].actingOrganization).toBe('ONC');
                    });

                    it('should set it to the ACB for ROLE_ACB', () => {
                        let changes = {
                            changeRequest: {
                                currentValue: {
                                    statuses: [{
                                        userPermission: {
                                            authority: 'ROLE_ACB',
                                        },
                                        certificationBody: {
                                            name: 'a body',
                                        },
                                    }],
                                },
                            },
                        };
                        ctrl.$onChanges(changes)
                        expect(ctrl.changeRequest.statuses[0].actingOrganization).toBe('a body');
                    });

                    it('should set it to the Developer for ROLE_DEVELOPER', () => {
                        let changes = {
                            changeRequest: {
                                currentValue: {
                                    statuses: [{
                                        userPermission: {
                                            authority: 'ROLE_DEVELOPER',
                                        },
                                    }],
                                    developer: {
                                        name: 'a name',
                                    },
                                },
                            },
                        };
                        ctrl.$onChanges(changes)
                        expect(ctrl.changeRequest.statuses[0].actingOrganization).toBe('a name');
                    });
                });

                describe('with respect to status types', () => {
                    it('should filter out "Cancelled by Requester"', () => {
                        let changes = {
                            changeRequestStatusTypes: {
                                currentValue: {
                                    data: [{
                                        name: 'one',
                                    },{
                                        name: 'Cancelled by Requester',
                                    }],
                                },
                            },
                        };
                        ctrl.$onChanges(changes)
                        expect(ctrl.changeRequestStatusTypes).toEqual([{name: 'one'}]);
                    });

                    it('should filter out "current" status', () => {
                        ctrl.changeRequest = {
                            currentStatus: {
                                changeRequestStatusType: {
                                    name: 'current',
                                },
                            },
                        };
                        ctrl.changeRequestStatusTypes = [
                            {name: 'current'},
                            {name: 'not current'},
                        ];
                        ctrl.$onChanges({});
                        expect(ctrl.changeRequestStatusTypes).toEqual([{name: 'not current'}]);
                    });
                });
            });

            describe('when using callbacks', () => {
                it('should handle update', () => {
                    ctrl.update();
                    expect(scope.takeAction).toHaveBeenCalledWith('update', {
                        changeRequest: mock.changeRequest,
                    });
                });

                it('should handle cancel', () => {
                    ctrl.cancel();
                    expect(scope.takeAction).toHaveBeenCalledWith('cancel', undefined);
                });
            });

            describe('when concerned with enabling the comment box', () => {
                it('should enable it for admins', () => {
                    ctrl.administrationMode = true;
                    expect(ctrl.isCommentEnabled()).toBe(true);
                });

                it('should enable it when withdrawing', () => {
                    ctrl.activeState = 'withdraw';
                    expect(ctrl.isCommentEnabled()).toBe(true);
                });

                it('should enable it when Pending Developer Action', () => {
                    ctrl.changeRequest.currentStatus.changeRequestStatusType.name = 'Pending Developer Action'
                    expect(ctrl.isCommentEnabled()).toBe(true);
                });

                it('be false by default', () => {
                    expect(ctrl.isCommentEnabled()).toBe(false);
                });
            });

            describe('when concerned with requiring the comment box', () => {
                it('should not require it if there is no new status', () => {
                    expect(ctrl.isCommentRequired()).toBeFalsy();
                });

                it('should require it when the new status is "Rejected"', () => {
                    ctrl.changeRequest.newStatus = {
                        name: 'Rejected',
                    };
                    expect(ctrl.isCommentRequired()).toBe(true);
                });

                it('should require it when the new status is "Pending Developer Action"', () => {
                    ctrl.changeRequest.newStatus = {
                        name: 'Pending Developer Action',
                    };
                    expect(ctrl.isCommentRequired()).toBe(true);
                });

                it('should require it when the new status is "Accepted"', () => {
                    ctrl.changeRequest.newStatus = {
                        name: 'Accepted',
                    };
                    expect(ctrl.isCommentRequired()).toBe(false);
                });
            });
        });
    });
})();
