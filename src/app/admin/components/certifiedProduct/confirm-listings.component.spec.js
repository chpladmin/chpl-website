(() => {
    'use strict';

    describe('the Confirm Listing component', () => {
        var $compile, $log, $q, $uibModal, Mock, actualOptions, authService, ctrl, el, mock, networkService, scope;

        mock = {
            developers: [1, 2],
            resources: {id: 1},
            pendingListings: [{
                id: 4459,
                chplProductNumber: '15.07.07.1447.t123.v1.00.1.180707',
                developer: { developerId: 448, developerCode: null, name: 'Epic Systems Corporation', website: null, address: null, contact: null, lastModifiedDate: null, deleted: null, transparencyAttestations: [], statusEvents: [], status: null },
                product: { productId: null, name: 'New product', reportFileLocation: null, contact: null, owner: null, ownerHistory: [], lastModifiedDate: null },
                version: { versionId: null, version: 'testV1', details: null, lastModifiedDate: null },
                certificationDate: 1530936000000,
                errorCount: 1,
                warningCount: 76,
            }, {
                id: 4460,
                chplProductNumber: '14.07.07.XXXX.SL14.v1.00.1.180707',
                developer: { developerId: null, developerCode: null, name: 'NEW DEVELOPER KATY', website: null, address: null, contact: null, lastModifiedDate: null, deleted: null, transparencyAttestations: [], statusEvents: [], status: null },
                product: { productId: null, name: 'New product', reportFileLocation: null, contact: null, owner: null, ownerHistory: [], lastModifiedDate: null },
                version: { versionId: null, version: '2014', details: null, lastModifiedDate: null },
                certificationDate: 1530936000000,
                errorCount: 8,
                warningCount: 0,
            }],
        };

        beforeEach(() => {
            angular.mock.module('chpl.mock', 'chpl.admin', $provide => {
                $provide.decorator('authService', $delegate => {
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');

                    return $delegate;
                });

                $provide.decorator('networkService', $delegate => {
                    $delegate.getPendingListings = jasmine.createSpy('getPendingListings');
                    $delegate.getPendingListingById = jasmine.createSpy('getPendingListingById');
                    $delegate.massRejectPendingListings = jasmine.createSpy('massRejectPendingListings');

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
                networkService.getPendingListings.and.returnValue($q.when(mock.pendingListings));
                networkService.getPendingListingById.and.returnValue($q.when(mock.pendingListings[0]));
                networkService.massRejectPendingListings.and.returnValue($q.when({}));

                scope = $rootScope.$new();
                scope.developers = mock.developers;
                scope.resources = mock.resources;
                el = angular.element('<chpl-confirm-listings developers="developers" resources="resources"></chpl-confirm-listings>');

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

            describe('when loading', () => {
                it('should get the pending listing metadata', () => {
                    expect(networkService.getPendingListings).toHaveBeenCalled();
                    expect(ctrl.uploadingCps.length).toBe(2);
                });

                it('shouldn\'t change anything that shouldn\'t change', () => {
                    // save old state
                    let developers = ctrl.developers;
                    let resources = ctrl.resources;

                    // make changes
                    ctrl.$onChange({});

                    //assert
                    expect(developers).toBe(ctrl.developers);
                    expect(resources).toBe(ctrl.resources);
                });
            });

            describe('when rejecting a pending listing', () => {
                beforeEach(() => {
                    ctrl.uploadingCps = [{id: 1}, {id: 2}];
                    ctrl.massReject = {
                        1: true,
                        2: false,
                    };
                });

                it('should call the common service to mass reject listings', () => {
                    ctrl.massRejectPendingListings();
                    scope.$digest();
                    expect(networkService.massRejectPendingListings).toHaveBeenCalledWith([1]);
                });

                it('should reset the pending checkboxes', () => {
                    ctrl.massRejectPendingListings();
                    expect(ctrl.massReject).toEqual({2: false});
                });

                it('should remove the listings from the list of listings', () => {
                    ctrl.massRejectPendingListings();
                    expect(ctrl.uploadingCps).toEqual([{id: 2}]);
                });

                it('should have error messages if rejection fails', () => {
                    networkService.massRejectPendingListings.and.returnValue($q.reject({data: {'errors': [
                        {'errorMessages': ['This pending certified product has already been confirmed or rejected by another user.'],'warningMessages': [],'objectId': '15.07.07.2642.EIC61.56.1.0.160402','contact': {'contactId': 32,'fullName': 'M Hancock','friendlyName': 'Hancock','email': 'Mandy.hancock@greenwayhealth.com','phoneNumber': '205-443-4115','title': null}},
                        {'errorMessages': ['This pending certified product has already been confirmed or rejected by another user.'],'warningMessages': [],'objectId': '15.07.07.2642.EIC61.55.1.1.160402','contact': {'contactId': 32,'fullName': 'Mandy','friendlyName': 'Hancock','email': 'Mandy.hancock@greenwayhealth.com','phoneNumber': '205-443-4115','title': null}},
                        {'errorMessages': ['This pending certified product has already been confirmed or rejected by another user.'],'warningMessages': [],'objectId': '15.07.07.2642.EIC61.56.1.0.160402','contact': {'contactId': 32,'fullName': 'Mandy Hancock','friendlyName': 'Hancock','email': 'Mandy.hancock@greenwayhealth.com','phoneNumber': '205-443-4115','title': null}},
                    ]}}));
                    ctrl.massRejectPendingListings();
                    scope.$digest();
                    expect(ctrl.uploadingListingsMessages.length).toEqual(3);
                });

                it('should not have error messages if rejection fails in a different way', () => {
                    networkService.massRejectPendingListings.and.returnValue($q.reject({data: {'errors': undefined}}));
                    ctrl.massRejectPendingListings();
                    scope.$digest();
                    expect(ctrl.uploadingListingsMessages).toBeUndefined();
                });

                it('should know how many Listings are ready to be rejected', () => {
                    expect(ctrl.getNumberOfListingsToReject()).toBe(1);
                    ctrl.massReject[2] = true;
                    ctrl.massReject[3] = true;
                    expect(ctrl.getNumberOfListingsToReject()).toBe(3);
                    ctrl.massReject[1] = false;
                    ctrl.massReject[2] = false;
                    ctrl.massReject[3] = false;
                    expect(ctrl.getNumberOfListingsToReject()).toBe(0);
                });
            });

            describe('when inspecting a pending Listing', () => {
                var listingInspectOptions;
                beforeEach(() => {
                    ctrl.uploadingCps = [
                        {id: 1},
                        {id: 2},
                    ];
                    listingInspectOptions = {
                        templateUrl: 'chpl.admin/components/certifiedProduct/inspect/inspect.html',
                        controller: 'InspectController',
                        controllerAs: 'vm',
                        animation: false,
                        backdrop: 'static',
                        keyboard: false,
                        resolve: {
                            developers: jasmine.any(Function),
                            inspectingCp: jasmine.any(Function),
                            isAcbAdmin: jasmine.any(Function),
                            isChplAdmin: jasmine.any(Function),
                            resources: jasmine.any(Function),
                        },
                        size: 'lg',
                    };
                });

                it('should create a modal instance when a Listing is to be edited', () => {
                    expect(ctrl.modalInstance).toBeUndefined();
                    ctrl.inspectCp({})
                    expect(ctrl.modalInstance).toBeDefined();
                });

                it('should resolve elements on inspect', () => {
                    ctrl.inspectCp(2)
                    expect($uibModal.open).toHaveBeenCalledWith(listingInspectOptions);
                    expect(actualOptions.resolve.developers()).toEqual(mock.developers);
                    expect(actualOptions.resolve.resources()).toEqual(mock.resources);
                    scope.$digest();
                });

                it('should remove the inspected listing on close if confirmed', () => {
                    var result = {
                        status: 'confirmed',
                    };
                    ctrl.inspectCp(1);
                    ctrl.modalInstance.close(result);
                    expect(ctrl.uploadingCps).toEqual([{id: 2}]);
                });

                it('should remove the inspected listing on close if rejected', () => {
                    var result = {
                        status: 'rejected',
                    };
                    ctrl.inspectCp(1);
                    ctrl.modalInstance.close(result);
                    expect(ctrl.uploadingCps).toEqual([{id: 2}]);
                });

                it('should add a new developer if one was created', () => {
                    var result = {
                        status: 'confirmed',
                        developerCreated: {id: 'new'},
                    };
                    ctrl.inspectCp(1);
                    ctrl.modalInstance.close(result);
                    expect(ctrl.developers.length).toBe(3);
                });

                it('should report the user who did something on resolved', () => {
                    var result = {
                        status: 'resolved',
                        objectId: 'id',
                        contact: {
                            fullName: 'fname',
                        },
                    };
                    ctrl.inspectCp(1);
                    ctrl.modalInstance.close(result);
                    expect(ctrl.uploadingListingsMessages[0]).toEqual('Product with ID: "id" has already been resolved by "fname"');
                });
            });
        });
    });
})();
