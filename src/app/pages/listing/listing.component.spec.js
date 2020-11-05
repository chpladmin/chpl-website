(() => {
    'use strict';

    describe('the CHPL Listing component', () => {

        var $compile, $log, $q, $uibModal, actualOptions, authService, ctrl, el, featureFlags, mock, networkService, scope;
        mock = {};
        mock.activity = {};
        mock.listing = {
            certificationEdition: {
                name: '2015',
            },
            developer: {
                developerId: 'id',
            },
        };
        mock.productId = 123123;
        mock.products = [{ developer: 'Developer', product: 'Product' }];
        mock.fakeModal = {
            result: {
                then: (confirmCallback, cancelCallback) => {
                    this.confirmCallBack = confirmCallback;
                    this.cancelCallback = cancelCallback;
                }},
            close: item => { this.result.confirmCallBack(item); },
            dismiss: type => { this.result.cancelCallback(type); },
        };
        mock.fakeModalOptions = {
            component: 'chplListingHistory',
            animation: false,
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            resolve: {
                listing: jasmine.any(Function),
            },
        };

        beforeEach(() => {
            angular.mock.module('chpl.listing', $provide => {
                $provide.decorator('authService', $delegate => {
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');
                    return $delegate;
                });
                $provide.decorator('featureFlags', $delegate => {
                    $delegate.isOn = jasmine.createSpy('isOn');
                    return $delegate;
                });
                $provide.decorator('networkService', $delegate => {
                    $delegate.getDirectReviews = jasmine.createSpy('getDirectReviews');
                    return $delegate;
                });
            });
            inject((_$compile_, _$log_, _$q_, $rootScope, _$uibModal_, _authService_, _featureFlags_, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(options => {
                    actualOptions = options;
                    return mock.fakeModal;
                });
                authService = _authService_;
                authService.hasAnyRole.and.returnValue(false);
                featureFlags = _featureFlags_;
                featureFlags.isOn.and.returnValue(false);
                networkService = _networkService_;
                networkService.getDirectReviews.and.returnValue($q.when([]));

                scope = $rootScope.$new();
                scope.listing = mock.listing;

                el = angular.element('<chpl-listing listing="listing"></chpl-listing/>');

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

        describe('controller', () => {
            it('should exist', () => {
                expect(ctrl).toBeDefined();
            });

            describe('viewing product history', () => {
                it('should have a function to view product history', () => {
                    expect(ctrl.viewListingHistory).toBeDefined();
                });

                it('should resolve modal stuff when product history is viewed', () => {
                    ctrl.listing = mock.products[0];
                    ctrl.viewListingHistory();
                    expect($uibModal.open).toHaveBeenCalledWith(mock.fakeModalOptions);
                    expect(actualOptions.resolve.listing()).toEqual(mock.products[0]);
                });
            });

            describe('with respect to editing', () => {
                beforeEach(() => {
                    ctrl.listing = {
                        certificationEdition: {
                            name: '2015',
                        },
                    };
                    ctrl.$state.current.name = 'listing';
                });

                it('should not allow anonymous users to edit', () => {
                    expect(ctrl.canEdit()).toBe(false);
                });

                it('should allow ADMIN to edit', () => {
                    authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ADMIN') >= 0);
                    expect(ctrl.canEdit()).toBe(true);
                });

                it('should allow ONC to edit', () => {
                    authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ONC') >= 0);
                    expect(ctrl.canEdit()).toBe(true);
                });

                it('should allow ACB to edit', () => {
                    authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ACB') >= 0);
                    expect(ctrl.canEdit()).toBe(true);
                });

                it('should not allow ATL to edit', () => {
                    authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ATL') >= 0);
                    expect(ctrl.canEdit()).toBe(false);
                });

                it('should not allow CMS to edit', () => {
                    authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_CMS_STAFF') >= 0);
                    expect(ctrl.canEdit()).toBe(false);
                });

                it('should not allow DEVELOPER to edit', () => {
                    authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_DEVELOPER') >= 0);
                    expect(ctrl.canEdit()).toBe(false);
                });

                describe('2014 listings', () => {
                    beforeEach(() => {
                        ctrl.listing = {
                            certificationEdition: {
                                name: '2014',
                            },
                        };
                    });

                    it('should allow ADMIN to edit', () => {
                        authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ADMIN') >= 0);
                        expect(ctrl.canEdit()).toBe(true);
                    });

                    it('should allow ONC to edit', () => {
                        authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ONC') >= 0);
                        expect(ctrl.canEdit()).toBe(true);
                    });

                    it('should not allow ACB to edit 2014 Edition', () => {
                        authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ACB') >= 0);
                        expect(ctrl.canEdit()).toBe(false);
                    });

                    it('should allow ACB to edit non-2014 Edition', () => {
                        ctrl.listing.certificationEdition.name = '2015';
                        authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ACB') >= 0);
                        expect(ctrl.canEdit()).toBe(true);
                    });
                });
            });
        });
    });
})();
