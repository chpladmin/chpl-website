(() => {
    'use strict';

    describe('the CHPL Listing edit page', () => {

        var $componentController, $log, $q, authService, ctrl, mock, networkService, scope;

        mock = {};

        beforeEach(() => {
            angular.mock.module('chpl.listing', $provide => {
                $provide.decorator('authService', $delegate => {
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');
                    return $delegate;
                });
                $provide.decorator('networkService', $delegate => {
                    $delegate.getAccessibilityStandards = jasmine.createSpy('getAccessibilityStandards');
                    $delegate.getAtls = jasmine.createSpy('getAtls');
                    $delegate.getDirectReviews = jasmine.createSpy('getDirectReviews');
                    $delegate.getListing = jasmine.createSpy('getListing');
                    $delegate.getQmsStandards = jasmine.createSpy('getQmsStandards');
                    $delegate.getSearchOptions = jasmine.createSpy('getSearchOptions');
                    $delegate.getSingleListingActivityMetadata = jasmine.createSpy('getSingleListingActivityMetadata');
                    $delegate.getTargetedUsers = jasmine.createSpy('getTargetedUsers');
                    $delegate.getTestData = jasmine.createSpy('getTestData');
                    $delegate.getTestFunctionality = jasmine.createSpy('getTestFunctionality');
                    $delegate.getTestProcedures = jasmine.createSpy('getTestProcedures');
                    $delegate.getTestStandards = jasmine.createSpy('getTestStandards');
                    $delegate.getTestTools = jasmine.createSpy('getTestTools');
                    $delegate.getUcdProcesses = jasmine.createSpy('getUcdProcesses');
                    $delegate.updateCP = jasmine.createSpy('updateCP');
                    return $delegate;
                });
            });
            inject((_$componentController_, _$log_, _$q_, $rootScope_, _authService_, _networkService_) => {
                $componentController = _$componentController_;
                $log = _$log_;
                $q = _$q_;
                authService = _authService_;
                authService.hasAnyRole.and.returnValue(false);
                networkService = _networkService_;
                networkService.getAccessibilityStandards.and.returnValue($q.when({}));
                networkService.getAtls.and.returnValue($q.when({}));
                networkService.getDirectReviews.and.returnValue($q.when([]));
                networkService.getListing.and.returnValue($q.when(mock.products));
                networkService.getQmsStandards.and.returnValue($q.when({}));
                networkService.getSearchOptions.and.returnValue($q.when({}));
                networkService.getSingleListingActivityMetadata.and.returnValue($q.when(mock.activity));
                networkService.getTargetedUsers.and.returnValue($q.when({}));
                networkService.getTestData.and.returnValue($q.when({}));
                networkService.getTestFunctionality.and.returnValue($q.when({}));
                networkService.getTestProcedures.and.returnValue($q.when({}));
                networkService.getTestStandards.and.returnValue($q.when({}));
                networkService.getTestTools.and.returnValue($q.when({}));
                networkService.getUcdProcesses.and.returnValue($q.when({}));
                networkService.updateCP.and.returnValue($q.when({}));

                scope = $rootScope.$new();
                $stateParams.id = mock.productId;
                ctrl = $componentController('chplListingEditPage', {
                    $scope: scope,
                    $stateParams: $stateParams,
                });
                ctrl.$onInit();
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

            describe('when loading', () => {
                it('should find edit data', () => {
                    expect(networkService.getListing).toHaveBeenCalled();
                });
            });

            describe('when handling a save', () => {
                let listing;
                beforeEach(() => {
                    listing = {
                        id: 'fake',
                    };
                });

                it('should set a "saving" flag', () => {
                    ctrl.saveEdit(listing, 'reason');
                    expect(ctrl.isSaving).toBe(true);
                });

                it('should report errors and turn off the saving flag', () => {
                    networkService.updateCP.and.returnValue($q.when({status: 400, error: 'an error'}));
                    ctrl.saveEdit(listing, 'reason');
                    scope.$digest();
                    expect(ctrl.saveErrors.errors).toEqual(['an error']);
                    expect(ctrl.isSaving).toBe(false);
                });

                it('should report errors on server data.error', () => {
                    networkService.updateCP.and.returnValue($q.reject({data: {error: 'an error'}}));
                    ctrl.saveEdit(listing, 'reason');
                    scope.$digest();
                    expect(ctrl.saveErrors.errors).toEqual(['an error']);
                    expect(ctrl.isSaving).toBe(false);
                });

                it('should report errors on server data.errorMessages', () => {
                    networkService.updateCP.and.returnValue($q.reject({data: {errorMessages: ['an error2']}}));
                    ctrl.saveEdit(listing, 'reason');
                    scope.$digest();
                    expect(ctrl.saveErrors.errors).toEqual(['an error2']);
                    expect(ctrl.isSaving).toBe(false);
                });

                it('should report errors on server data.warningMessages', () => {
                    networkService.updateCP.and.returnValue($q.reject({data: {warningMessages: ['an error3']}}));
                    ctrl.saveEdit(listing, 'reason');
                    scope.$digest();
                    expect(ctrl.saveErrors.warnings).toEqual(['an error3']);
                    expect(ctrl.isSaving).toBe(false);
                });

                it('should report no errors if none were returned', () => {
                    networkService.updateCP.and.returnValue($q.reject({}));
                    ctrl.saveEdit(listing, 'reason');
                    scope.$digest();
                    expect(ctrl.saveErrors.errors).toEqual([]);
                    expect(ctrl.isSaving).toBe(false);
                });
            });
        });

        describe('when editing', () => {
            beforeEach(() => {
                ctrl.listing = {
                    certificationEdition: {
                        name: '2015',
                    },
                };
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
})();
