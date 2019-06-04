(() => {
    'use strict';

    describe('the CHPL Listing component', () => {

        var $componentController, $log, $q, $stateParams, $uibModal, actualOptions, ctrl, mock, networkService, scope;
        mock = {};
        mock.activity = {};
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
                $provide.decorator('networkService', $delegate => {
                    $delegate.getAccessibilityStandards = jasmine.createSpy('getAccessibilityStandards');
                    $delegate.getAtls = jasmine.createSpy('getAtls');
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
            inject((_$componentController_, _$log_, _$q_, $rootScope, _$stateParams_, _$uibModal_, _networkService_) => {
                $componentController = _$componentController_;
                $log = _$log_;
                $q = _$q_;
                $stateParams = _$stateParams_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(options => {
                    actualOptions = options;
                    return mock.fakeModal;
                });
                networkService = _networkService_;
                networkService.getAccessibilityStandards.and.returnValue($q.when({}));
                networkService.getAtls.and.returnValue($q.when({}));
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
                ctrl = $componentController('chplListing', {
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
                it('should know what the product id is', () => {
                    expect(ctrl.listingId).toEqual(mock.productId);
                });

                it('should find product details on load', () => {
                    expect(networkService.getListing).toHaveBeenCalled();
                });

                it('should be loading', () => {
                    expect(ctrl.loading).toBe(true);
                });

                it('shouldn\'t have data immediately', () => {
                    expect(ctrl.product).toBeUndefined();
                });

                describe('after getting data', () => {
                    beforeEach(() => {
                        scope.$digest();
                    });

                    it('should be done loading', () => {
                        expect(ctrl.loading).toBe(false);
                    });

                    it('should load product data', () => {
                        expect(ctrl.listing).toEqual(mock.products);
                    });
                });
            });

            describe('wrt initial panel options', () => {
                it('should set to criteria by default', () => {
                    expect(ctrl.initialPanel).toBe('cert');
                });

                it('should be able to be open to surveillance', () => {
                    $stateParams.initialPanel = 'surveillance';
                    ctrl = $componentController('chplListing', {
                        $scope: scope,
                        $stateParams: $stateParams,
                    });
                    ctrl.$onInit();
                    expect(ctrl.initialPanel).toBe('surveillance');
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
                    ctrl.saveEdit(listing, 'reason')
                    expect(ctrl.isSaving).toBe(true);
                });

                it('should report errors and turn off the saving flag', () => {
                    networkService.updateCP.and.returnValue($q.when({status: 400, error: 'an error'}));
                    ctrl.saveEdit(listing, 'reason')
                    scope.$digest();
                    expect(ctrl.saveErrors.errors).toEqual(['an error']);
                    expect(ctrl.isSaving).toBe(false);
                });

                it('should report errors on server data.error', () => {
                    networkService.updateCP.and.returnValue($q.reject({data: {error: 'an error'}}));
                    ctrl.saveEdit(listing, 'reason')
                    scope.$digest();
                    expect(ctrl.saveErrors.errors).toEqual(['an error']);
                    expect(ctrl.isSaving).toBe(false);
                });

                it('should report errors on server data.errorMessages', () => {
                    networkService.updateCP.and.returnValue($q.reject({data: {errorMessages: ['an error2']}}));
                    ctrl.saveEdit(listing, 'reason')
                    scope.$digest();
                    expect(ctrl.saveErrors.errors).toEqual(['an error2']);
                    expect(ctrl.isSaving).toBe(false);
                });

                it('should report errors on server data.warningMessages', () => {
                    networkService.updateCP.and.returnValue($q.reject({data: {warningMessages: ['an error3']}}));
                    ctrl.saveEdit(listing, 'reason')
                    scope.$digest();
                    expect(ctrl.saveErrors.warnings).toEqual(['an error3']);
                    expect(ctrl.isSaving).toBe(false);
                });

                it('should report no errors if none were returned', () => {
                    networkService.updateCP.and.returnValue($q.reject({}));
                    ctrl.saveEdit(listing, 'reason')
                    scope.$digest();
                    expect(ctrl.saveErrors.errors).toEqual([]);
                    expect(ctrl.isSaving).toBe(false);
                });
            });
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
    });
})();
