import './history.mock';

(() => {
    'use strict';

    fdescribe('the Listing History popup component', () => {
        var $compile, $location, $log, $q, ctrl, el, listingActivity, mock, networkService, scope;

        mock = {
            listing: {
                id: 9939,
                developer: { developerId: 1654 },
                product: { productId: 3067 },
                version: { versionId: 7708 },
                certificationEvents: [],
            },
        };

        beforeEach(() => {
            angular.mock.module('chpl.listing', $provide => {
                $provide.decorator('networkService', $delegate => {
                    $delegate.getActivityById = jasmine.createSpy('getActivityById');
                    $delegate.getSingleCertifiedProductMetadataActivity = jasmine.createSpy('getSingleCertifiedProductMetadataActivity');
                    return $delegate;
                });
            });

            inject((_$compile_, _$location_, _$log_, _$q_, $rootScope, listing_activity, listing_metadata, _networkService_) => {
                $compile = _$compile_;
                $location = _$location_;
                $log = _$log_;
                $q = _$q_;
                listingActivity = listing_activity;
                networkService = _networkService_;
                networkService.getActivityById.and.callFake(id => $q.when(listing_activity(id)));
                networkService.getSingleCertifiedProductMetadataActivity.and.returnValue($q.when(listing_metadata()));

                scope = $rootScope.$new();
                scope.close = jasmine.createSpy('close');
                scope.dismiss = jasmine.createSpy('dismiss');
                scope.resolve = {
                    listing: mock.listing,
                }

                el = angular.element('<chpl-listing-history close="close($value)" dismiss="dismiss()" resolve="resolve"></chpl-listing-history>');

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

        describe('template', () => {
            it('should be compiled', () => {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', () => {
            it('should exist', () => {
                expect(ctrl).toBeDefined();
            });

            it('should have a way to close the modal', () => {
                expect(ctrl.cancel).toBeDefined();
                ctrl.cancel();
                expect(scope.dismiss).toHaveBeenCalled();
            });

            it('should have a way to go to the API page', () => {
                spyOn($location, 'path');
                ctrl.goToApi();
                expect($location.path).toHaveBeenCalledWith('/resources/chpl-api');
            });

            it('should close the modal on navigation', () => {
                spyOn(ctrl, 'cancel');
                ctrl.goToApi();
                expect(ctrl.cancel).toHaveBeenCalled();
            });

            describe('when loading', () => {
                it('should get activity from the network', () => {
                    expect(networkService.getSingleCertifiedProductMetadataActivity).toHaveBeenCalledWith(9939);
                    expect(networkService.getActivityById).toHaveBeenCalledWith(4607);
                    expect(networkService.getActivityById).toHaveBeenCalledWith(381);
                    expect(networkService.getActivityById).toHaveBeenCalledWith(404);
                    expect(networkService.getActivityById).toHaveBeenCalledWith(408);
                    expect(networkService.getActivityById).toHaveBeenCalledWith(433);
                    expect(networkService.getActivityById).toHaveBeenCalledWith(382);
                    expect(networkService.getActivityById).toHaveBeenCalledWith(17925);
                    expect(networkService.getActivityById).toHaveBeenCalledWith(5452);
                    expect(networkService.getActivityById).toHaveBeenCalledWith(375);
                });
            });

            describe('when interpreting the report', () => {
                it('should have an item for when the product was certified but not edited', () => {
                    expect(ctrl.activity[0].change).toEqual(['Certified product was uploaded to the CHPL']);
                });

                it('should have an item for when the product was certified and later had a status change', () => {
                    expect(ctrl.activity[1].change).toEqual(['Certified product was uploaded to the CHPL']);
                });

                it('should have an item for surveillance being added', () => {
                    expect(ctrl.activity[2].change).toEqual(['Surveillance activity was added']);
                });

                it('should have an item for surveillance being updated', () => {
                    expect(ctrl.activity[3].change).toEqual(['Surveillance activity was updated']);
                });

                it('should have an item for surveillance being deleted', () => {
                    expect(ctrl.activity[4].change).toEqual(['Surveillance activity was deleted']);
                });

                it('should have items for certification criteria being added and g1/g2 success changing', () => {
                    expect(ctrl.activity[5].change[0]).toEqual('170.315 (b)(3) changes:<ul><li>Added G2 MACRA Measure:<ul><li>another1</li></ul></li></ul>');
                    expect(ctrl.activity[5].change[1]).toEqual('170.315 (e)(1) changes:<ul><li>Removed G1 MACRA Measure:<ul><li>abbr</li></ul></li></ul>');
                    expect(ctrl.activity[5].change[2]).toEqual('170.315 (e)(2) changes:<ul><li>Added G1 MACRA Measure:<ul><li>an abr</li></ul></li></ul>');
                    expect(ctrl.activity[5].change[3]).toEqual('170.315 (g)(7) changes:<ul><li>Certification Criteria was added</li><li>Certification Criteria became Certified to G1</li></ul>');
                    expect(ctrl.activity[5].change[4]).toEqual('170.315 (g)(8) changes:<ul><li>Certification Criteria was added</li></ul>');
                    expect(ctrl.activity[5].change[5]).toEqual('170.315 (g)(9) changes:<ul><li>Certification Criteria was added</li><li>Removed G2 MACRA Measure:<ul><li>abbrevie</li></ul></li></ul>');
                });

                it('should have items for CQMs changing', () => {
                    expect(ctrl.activity[5].change[6]).toEqual('CMS122 changes:<ul><li>CQM became "False"</li><li>v1 removed</li><li>Certification Criteria "a criteria" changes<ul><li>a criteria removed</li></ul></li></ul>');
                    expect(ctrl.activity[5].change[7]).toEqual('CMS82 changes:<ul><li>CQM became "True"</li><li>v3 added</li><li>Certification Criteria "random criteria" changes<ul><li>random criteria added</li></ul></li></ul>');
                });

                it('should know when the CHPL Product Number changed', () => {
                    expect(ctrl.activity[6].change[0]).toEqual('CHPL Product Number changed from 15.07.07.1447.BE02.01.00.1.160815 to 15.07.07.1447.BE02.01.01.1.160815');
                });

                describe('when dealing with certification events', () => {
                    beforeEach(() => {
                        ctrl.activity = [];
                    });

                    it('should have an item for certification status becoming active during confirmation', () => {
                        ctrl.listing = listingActivity(4607).newData;
                        ctrl._interpretCertificationStatusChanges();
                        expect(ctrl.activity.length).toBe(1);
                        expect(ctrl.activity[0].change).toEqual(['Certification Status became "Active"']);
                    });

                    it('should have an item for certification status changing', () => {
                        ctrl.listing = listingActivity(433).newData;
                        ctrl._interpretCertificationStatusChanges();
                        expect(ctrl.activity.length).toBe(2);
                        expect(ctrl.activity[0].change).toEqual(['Certification Status became "Active"']);
                        expect(ctrl.activity[1].change).toEqual(['Certification Status became "Suspended by ONC"']);
                    });

                    it('should have an item for certification status changing after confirmation', () => {
                        ctrl.listing = listingActivity(17925).newData;
                        ctrl._interpretCertificationStatusChanges();
                        expect(ctrl.activity.length).toBe(1);
                        expect(ctrl.activity[0].change).toEqual(['Certification Status became "Active"']);
                    });
                });

                describe('when dealing with MUU data', () => {
                    beforeEach(() => {
                        ctrl.activity = [];
                        ctrl.listing = angular.copy(listingActivity(5452).newData);
                    });

                    it('should know when the MUU number changed', () => {
                        ctrl._interpretMuuHistory();
                        expect(ctrl.activity[1].change[0].substring(0, 64)).toEqual('Estimated number of Meaningful Use Users changed from 4 to 6 on ');
                        expect(ctrl.activity[1].change[0].length).toBeGreaterThan(64); // should have the date of the change at the end of the string, but timezones make dates different on different systems, so testing for equality is hard
                    });

                    it('should handle listings with no MUU history', () => {
                        ctrl.listing.meaningfulUseUserHistory = undefined;
                        ctrl._interpretMuuHistory();
                        expect(ctrl.activity).toEqual([]);
                    });

                    it('should handle listings with only one item', () => {
                        ctrl.listing.meaningfulUseUserHistory = [{
                            muuDate: 23,
                            muuCount: 3,
                        }];
                        ctrl._interpretMuuHistory();
                        expect(ctrl.activity[0].change[0].substring(0, 53)).toEqual('Estimated number of Meaningful Use Users became 3 on ');
                        expect(ctrl.activity[0].change[0].length).toBeGreaterThan(53);
                    });
                });
            });
        });
    });
})();
