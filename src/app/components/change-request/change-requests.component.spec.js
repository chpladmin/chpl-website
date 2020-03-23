(() => {
    'use strict';

    describe('the Change Requests component', () => {
        var $compile, $log, authService, ctrl, el, mock, scope;

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
            angular.mock.module('chpl.components', $provide => {
                $provide.decorator('authService', $delegate => {
                    $delegate.hasAnyRole = jasmine.createSpy('authService');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, $rootScope, _authService_) => {
                $compile = _$compile_;
                $log = _$log_;
                authService = _authService_;
                authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_DEVELOPER') > -1);

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
                    expect(ctrl.changeRequests[0].changeDate).toBe(1571148799528);
                    expect(ctrl.changeRequests[0].developerName).toBe('A name');
                    expect(ctrl.changeRequests[0].requestType).toBe('A change');
                    expect(ctrl.changeRequests[0].friendlyCreationDate).toBe('2019-10-15 14:13:19 +0000');
                    expect(ctrl.changeRequests[0].friendlyChangeDate).toBe('2019-10-15 14:13:19 +0000');
                });

                it('should set the filter size to 10 if admin mode', () => {
                    expect(ctrl.filterItems.pageSize).toBe(3);
                    let changes = {
                        administrationMode: { currentValue: true },
                    }
                    ctrl.$onChanges(changes);
                    expect(ctrl.filterItems.pageSize).toBe(10);
                });
            });

            describe('when describing state via title', () => {
                it('should default to "Tracking"', () => {
                    expect(ctrl.getTitle()).toBe('Tracking');
                });

                it('should be "Tracking" in admin mode', () => {
                    ctrl.administrationMode = true;
                    expect(ctrl.getTitle()).toBe('Tracking');
                });

                describe('with an active change request', () => {
                    beforeEach(() => {
                        ctrl.activeChangeRequest = {
                            submittedDate: 1571148799528,
                        };
                    });
                    it('should be "Change Request" in admin mode', () => {
                        ctrl.administrationMode = true;
                        ctrl.activeChangeRequest = 'something'
                        expect(ctrl.getTitle()).toBe('Change Request');
                    });

                    it('should indicate when Editing', () => {
                        ctrl.activeState = 'edit';
                        expect(ctrl.getTitle()).toBe('Editing - Change Request | Submitted on Oct 15, 2019');
                    });

                    it('should indicate when in Status Log mode', () => {
                        ctrl.activeState = 'log';
                        expect(ctrl.getTitle()).toBe('Status Log - Change Request | Submitted on Oct 15, 2019');
                    });

                    it('should indicate when Withdrawing', () => {
                        ctrl.activeState = 'withdraw';
                        expect(ctrl.getTitle()).toBe('Withdraw - Change Request | Submitted on Oct 15, 2019');
                    });
                });
            });

            describe('with respect to permissions', () => {
                describe('for DEVELOPERS', () => {
                    it('should let them edit when awaiting ONC-ACB', () => {
                        ctrl.activeChangeRequest = {
                            currentStatus: {
                                changeRequestStatusType: {
                                    name: 'Pending ONC-ACB Action',
                                },
                            },
                        }
                        expect(ctrl.can('edit')).toBe(true);
                    });

                    it('should let them edit when awaiting Developer', () => {
                        ctrl.activeChangeRequest = {
                            currentStatus: {
                                changeRequestStatusType: {
                                    name: 'Pending Developer Action',
                                },
                            },
                        }
                        expect(ctrl.can('edit')).toBe(true);
                    });

                    it('should not let them edit otherwise', () => {
                        ctrl.activeChangeRequest = {
                            currentStatus: {
                                changeRequestStatusType: {
                                    name: 'other',
                                },
                            },
                        }
                        expect(ctrl.can('edit')).toBe(false);
                    });

                    it('should let them withdraw when awaiting ONC-ACB', () => {
                        ctrl.activeChangeRequest = {
                            currentStatus: {
                                changeRequestStatusType: {
                                    name: 'Pending ONC-ACB Action',
                                },
                            },
                        }
                        expect(ctrl.can('withdraw')).toBe(true);
                    });

                    it('should let them withdraw when awaiting Developer', () => {
                        ctrl.activeChangeRequest = {
                            currentStatus: {
                                changeRequestStatusType: {
                                    name: 'Pending Developer Action',
                                },
                            },
                        }
                        expect(ctrl.can('withdraw')).toBe(true);
                    });

                    it('should not let them withdraw otherwise', () => {
                        ctrl.activeChangeRequest = {
                            currentStatus: {
                                changeRequestStatusType: {
                                    name: 'other',
                                },
                            },
                        }
                        expect(ctrl.can('withdraw')).toBe(false);
                    });
                });

                describe('for ROLE_ONC', () => {
                    beforeEach(() => {
                        authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ONC') > -1);
                    });

                    it('should let them edit when awaiting ONC-ACB', () => {
                        ctrl.activeChangeRequest = {
                            currentStatus: {
                                changeRequestStatusType: {
                                    name: 'Pending ONC-ACB Action',
                                },
                            },
                        }
                        expect(ctrl.can('edit')).toBe(true);
                    });

                    it('should let them edit when awaiting Developer', () => {
                        ctrl.activeChangeRequest = {
                            currentStatus: {
                                changeRequestStatusType: {
                                    name: 'Pending Developer Action',
                                },
                            },
                        }
                        expect(ctrl.can('edit')).toBe(true);
                    });

                    it('should not let them edit otherwise', () => {
                        ctrl.activeChangeRequest = {
                            currentStatus: {
                                changeRequestStatusType: {
                                    name: 'other',
                                },
                            },
                        }
                        expect(ctrl.can('edit')).toBe(false);
                    });

                    it('should not let them withdraw', () => {
                        ctrl.activeChangeRequest = {
                            currentStatus: {
                                changeRequestStatusType: {
                                    name: 'other',
                                },
                            },
                        }
                        expect(ctrl.can('withdraw')).toBe(false);
                    });
                });

                describe('for ROLE_ADMIN', () => {
                    beforeEach(() => {
                        authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ADMIN') > -1);
                    });

                    it('should let them edit when awaiting ONC-ACB', () => {
                        ctrl.activeChangeRequest = {
                            currentStatus: {
                                changeRequestStatusType: {
                                    name: 'Pending ONC-ACB Action',
                                },
                            },
                        }
                        expect(ctrl.can('edit')).toBe(true);
                    });

                    it('should let them edit when awaiting Developer', () => {
                        ctrl.activeChangeRequest = {
                            currentStatus: {
                                changeRequestStatusType: {
                                    name: 'Pending Developer Action',
                                },
                            },
                        }
                        expect(ctrl.can('edit')).toBe(true);
                    });

                    it('should not let them edit otherwise', () => {
                        ctrl.activeChangeRequest = {
                            currentStatus: {
                                changeRequestStatusType: {
                                    name: 'other',
                                },
                            },
                        }
                        expect(ctrl.can('edit')).toBe(false);
                    });

                    it('should not let them withdraw', () => {
                        ctrl.activeChangeRequest = {
                            currentStatus: {
                                changeRequestStatusType: {
                                    name: 'other',
                                },
                            },
                        }
                        expect(ctrl.can('withdraw')).toBe(false);
                    });
                });

                describe('for ROLE_ACB', () => {
                    beforeEach(() => {
                        authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ACB') > -1);
                    });

                    it('should let them edit when awaiting ONC-ACB', () => {
                        ctrl.activeChangeRequest = {
                            currentStatus: {
                                changeRequestStatusType: {
                                    name: 'Pending ONC-ACB Action',
                                },
                            },
                        }
                        expect(ctrl.can('edit')).toBe(true);
                    });

                    it('should not them edit when awaiting Developer', () => {
                        ctrl.activeChangeRequest = {
                            currentStatus: {
                                changeRequestStatusType: {
                                    name: 'Pending Developer Action',
                                },
                            },
                        }
                        expect(ctrl.can('edit')).toBe(true);
                    });

                    it('should not let them edit otherwise', () => {
                        ctrl.activeChangeRequest = {
                            currentStatus: {
                                changeRequestStatusType: {
                                    name: 'other',
                                },
                            },
                        }
                        expect(ctrl.can('edit')).toBe(false);
                    });

                    it('should not let them withdraw', () => {
                        ctrl.activeChangeRequest = {
                            currentStatus: {
                                changeRequestStatusType: {
                                    name: 'other',
                                },
                            },
                        }
                        expect(ctrl.can('withdraw')).toBe(false);
                    });
                });
            });

            describe('when acting', () => {
                describe('to cancel', () => {
                    it('should take action', () => {
                        ctrl.act('cancel');
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
                        ctrl.activeState = 'edit';
                        ctrl.activeChangeRequest = ctrl.changeRequests[0];
                        ctrl.act('fullCancel');
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
                        expect(scope.takeAction).toHaveBeenCalledWith('focus', undefined);
                    });

                    it('should handle statusLog', () => {
                        ctrl.act('statusLog');
                        expect(ctrl.activeState).toBe('log');
                        expect(scope.takeAction).toHaveBeenCalledWith('focus', undefined);
                    });

                    it('should handle withdraw', () => {
                        ctrl.act('withdraw');
                        expect(ctrl.activeState).toBe('withdraw');
                        expect(scope.takeAction).toHaveBeenCalledWith('focus', undefined);
                    });
                });

                describe('to receive an update', () => {
                    it('should set the active CR', () => {
                        expect(ctrl.activeChangeRequest).toBeUndefined;
                        let newCr = {id: 3};
                        ctrl.act('update', { changeRequest: newCr });
                        expect(ctrl.activeChangeRequest).toBe(newCr);
                    });
                });

                describe('when a developer is acting', () => {
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

                describe('when ROLE_ADMIN/ONC/ACB is acting', () => {
                    beforeEach(() => {
                        ctrl.administrationMode = true;
                    });

                    describe('to save', () => {
                        it('should handle basic edit', () => {
                            let activeCR = {
                                currentStatus: {
                                    changeRequestStatusType: {
                                        name: 'Pending ONC-ACB Action',
                                    },
                                },
                                comment: 'a comment',
                                newStatus: {
                                    name: 'Pending Developer Action',
                                },
                            };
                            let expectedCR = {
                                currentStatus: {
                                    changeRequestStatusType: {
                                        name: 'Pending Developer Action',
                                    },
                                    comment: 'a comment',
                                },
                                comment: 'a comment',
                                newStatus: {
                                    name: 'Pending Developer Action',
                                },
                            };
                            ctrl.activeState = 'edit';
                            ctrl.activeChangeRequest = activeCR;
                            ctrl.act('save');
                            expect(scope.takeAction).toHaveBeenCalledWith('save', expectedCR);
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
                });
            });
        });
    });
})();
