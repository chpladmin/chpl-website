(() => {
    'use strict';

    describe('the Developers View component', () => {
        var $compile, $log, $q, $rootScope, $state, authService, ctrl, el, mock, networkService, scope, toaster;

        mock = {
            acbs: [
                { name: 'an acb' },
            ],
            developer: {
                developerId: 636, developerCode: '1635', name: 'Hyland Software,  Inc.', website: 'https://www.onbase.com/',
                address: {addressId: 177, line1: '28500 Clemens Road', line2: null, city: 'Westlake', state: 'OH', zipcode: '44145', country: 'USA'},
                contact: {contactId: 612, fullName: 'Kress Van Voorhis', friendlyName: null, email: 'kc.van.voorhis@onbase.com', phoneNumber: '440.788.5347', title: 'Customer Advisor'},
                lastModifiedDate: null, deleted: null, transparencyAttestations: [],
                statusEvents: [{id: null, developerId: 636, status: {id: 1, status: 'Active'}, statusDate: 1459484375763, reason: null}],
                status: {id: 1, status: 'Active'},
            },
            developers: [
                { name: 'a developer', transparencyAttestations: [] },
            ],
            products: [
                { name: 'a product' },
            ],
            stateParams: {
                developerId: 22,
            },
            users: [{id: 1}],
        };

        beforeEach(() => {
            angular.mock.module('chpl.organizations', $provide => {
                $provide.factory('$stateParams', () => mock.stateParams);
                $provide.factory('chplProductsDirective', () => ({}));
                $provide.factory('chplChangeRequestsDirective', () => ({}));
                $provide.decorator('authService', $delegate => {
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');

                    return $delegate;
                });
                $provide.decorator('networkService', $delegate => {
                    $delegate.getAcbs = jasmine.createSpy('getAcbs');
                    $delegate.getChangeRequests = jasmine.createSpy('getChangeRequests');
                    $delegate.getChangeRequestTypes = jasmine.createSpy('getChangeRequestTypes');
                    $delegate.getChangeRequestStatusTypes = jasmine.createSpy('getChangeRequestStatusTypes');
                    $delegate.getDeveloper = jasmine.createSpy('getDeveloper');
                    $delegate.getSearchOptions = jasmine.createSpy('getSearchOptions');
                    $delegate.getUsersAtDeveloper = jasmine.createSpy('getUsersAtDeveloper');
                    $delegate.inviteUser = jasmine.createSpy('inviteUser');
                    $delegate.removeUserFromDeveloper = jasmine.createSpy('removeUserFromDeveloper');
                    $delegate.updateChangeRequest = jasmine.createSpy('updateChangeRequest');
                    return $delegate;
                });
            });
            inject((_$compile_, _$log_, _$q_, _$rootScope_, _$state_, _authService_, _networkService_, _toaster_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                $state = _$state_;
                authService = _authService_;
                authService.hasAnyRole.and.returnValue(true);
                networkService = _networkService_;
                networkService.getAcbs.and.returnValue($q.when({acbs: mock.acbs}));
                networkService.getChangeRequests.and.returnValue($q.when([]));
                networkService.getChangeRequestTypes.and.returnValue($q.when([]));
                networkService.getChangeRequestStatusTypes.and.returnValue($q.when([]));
                networkService.getDeveloper.and.returnValue($q.when(mock.developer));
                networkService.getUsersAtDeveloper.and.returnValue($q.when({users: mock.users}));
                networkService.getSearchOptions.and.returnValue($q.when([]));
                networkService.inviteUser.and.returnValue($q.when({}));
                networkService.removeUserFromDeveloper.and.returnValue($q.when({}));
                networkService.updateChangeRequest.and.returnValue($q.when({}));
                toaster = _toaster_;

                scope = $rootScope.$new();
                scope.acbs = {acbs: mock.acbs};
                scope.developer = mock.developer;
                scope.developers = {developers: mock.developers};
                scope.products = {products: mock.products};

                el = angular.element('<chpl-developers-view allowed-acbs="acbs" developer="developer" developers="developers" products="products"></chpl-developers-view>');

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

            describe('during initialization', () => {
                it('should get data', () => {
                    expect(networkService.getSearchOptions.calls.count()).toBe(1);
                    expect(networkService.getUsersAtDeveloper).toHaveBeenCalledWith(22);
                    expect(networkService.getUsersAtDeveloper.calls.count()).toBe(1);
                    expect(networkService.getChangeRequests.calls.count()).toBe(1);
                    expect(networkService.getChangeRequestTypes.calls.count()).toBe(1);
                    expect(networkService.getChangeRequestStatusTypes.calls.count()).toBe(1);
                });
            });

            describe('on log in', () => {
                it('should refresh data', () => {
                    let initCount = {
                        getSearchOptions: networkService.getSearchOptions.calls.count(),
                        getUsersAtDeveloper: networkService.getUsersAtDeveloper.calls.count(),
                        getChangeRequests: networkService.getChangeRequests.calls.count(),
                        getChangeRequestTypes: networkService.getChangeRequestTypes.calls.count(),
                        getChangeRequestStatusTypes: networkService.getChangeRequestStatusTypes.calls.count(),
                    }
                    $rootScope.$broadcast('loggedIn');
                    expect(networkService.getSearchOptions.calls.count()).toBe(initCount.getSearchOptions);
                    expect(networkService.getUsersAtDeveloper.calls.count()).toBe(initCount.getUsersAtDeveloper + 1);
                    expect(networkService.getChangeRequests.calls.count()).toBe(initCount.getChangeRequests + 1);
                    expect(networkService.getChangeRequestTypes.calls.count()).toBe(initCount.getChangeRequestTypes + 1);
                    expect(networkService.getChangeRequestStatusTypes.calls.count()).toBe(initCount.getChangeRequestStatusTypes + 1);
                });
            });

            describe('when cleaning up', () => {
                it('should clean up hooks', () => {
                    let initCount = {
                        getSearchOptions: networkService.getSearchOptions.calls.count(),
                        getUsersAtDeveloper: networkService.getUsersAtDeveloper.calls.count(),
                        getChangeRequests: networkService.getChangeRequests.calls.count(),
                        getChangeRequestTypes: networkService.getChangeRequestTypes.calls.count(),
                        getChangeRequestStatusTypes: networkService.getChangeRequestStatusTypes.calls.count(),
                    }
                    ctrl.$onDestroy()
                    $rootScope.$broadcast('loggedIn');
                    expect(networkService.getSearchOptions.calls.count()).toBe(initCount.getSearchOptions);
                    expect(networkService.getUsersAtDeveloper.calls.count()).toBe(initCount.getUsersAtDeveloper);
                    expect(networkService.getChangeRequests.calls.count()).toBe(initCount.getChangeRequests);
                    expect(networkService.getChangeRequestTypes.calls.count()).toBe(initCount.getChangeRequestTypes);
                    expect(networkService.getChangeRequestStatusTypes.calls.count()).toBe(initCount.getChangeRequestStatusTypes);
                });
            });

            describe('with respect to user action callbacks', () => {
                it('should handle delete', () => {
                    let initCount = networkService.getUsersAtDeveloper.calls.count();
                    ctrl.takeUserAction('delete', 3);
                    scope.$digest();
                    expect(networkService.removeUserFromDeveloper).toHaveBeenCalledWith(3, 22);
                    expect(networkService.getUsersAtDeveloper).toHaveBeenCalledWith(22);
                    expect(networkService.getUsersAtDeveloper.calls.count()).toBe(initCount + 1);
                });

                it('should handle invitation', () => {
                    ctrl.takeUserAction('invite', {role: 'ROLE_DEVELOPER', email: 'fake'});
                    spyOn(toaster, 'pop');
                    scope.$digest();
                    expect(networkService.inviteUser).toHaveBeenCalledWith({
                        role: 'ROLE_DEVELOPER',
                        emailAddress: 'fake',
                        permissionObjectId: 22,
                    });
                    expect(toaster.pop).toHaveBeenCalledWith({
                        type: 'success',
                        title: 'Email sent',
                        body: 'Email sent successfully to fake',
                    });
                });

                it('should handle refresh', () => {
                    let initCount = networkService.getUsersAtDeveloper.calls.count();
                    ctrl.takeUserAction('refresh');
                    scope.$digest();
                    expect(networkService.getUsersAtDeveloper).toHaveBeenCalledWith(22);
                    expect(networkService.getUsersAtDeveloper.calls.count()).toBe(initCount + 1);
                });

                it('should handle impersonate', () => {
                    spyOn($state, 'reload');
                    ctrl.takeUserAction('impersonate');
                    expect($state.reload).toHaveBeenCalled();
                });

                it('should handle edit', () => {
                    ctrl.takeUserAction('edit');
                    expect(ctrl.action).toBe('focusUsers');
                });

                it('should handle cancel', () => {
                    ctrl.takeUserAction('cancel');
                    expect(ctrl.action).toBeUndefined();
                });
            });

            describe('with respect to change request callbacks', () => {
                it('should handle cancel', () => {
                    ctrl.takeCrAction('cancel');
                    expect(ctrl.action).toBeUndefined();
                });

                it('should handle save', () => {
                    let cr = {};
                    let initCount = networkService.getChangeRequests.calls.count();
                    ctrl.takeCrAction('save', cr);
                    scope.$digest();
                    expect(ctrl.action).toBe('confirmation');
                    expect(networkService.updateChangeRequest).toHaveBeenCalledWith(cr);
                    expect(networkService.getChangeRequests.calls.count()).toBe(initCount + 1);
                });
            });
        });
    });
})();
