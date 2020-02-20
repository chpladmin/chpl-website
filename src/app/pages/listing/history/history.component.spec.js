import './history.mock';

(() => {
    'use strict';

    xdescribe('the Listing History popup component', () => {
        var $compile, $location, $log, $q, ctrl, el, getActivity, mock, networkService, scope;

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
                    $delegate.getSingleDeveloperActivityMetadata = jasmine.createSpy('getSingleDeveloperActivityMetadata');
                    $delegate.getSingleListingActivityMetadata = jasmine.createSpy('getSingleListingActivityMetadata');
                    $delegate.getSingleProductActivityMetadata = jasmine.createSpy('getSingleProductActivityMetadata');
                    $delegate.getSingleVersionActivityMetadata = jasmine.createSpy('getSingleVersionActivityMetadata');
                    return $delegate;
                });
            });

            inject((_$compile_, _$location_, _$log_, _$q_, $rootScope, activity, metadata, _networkService_) => {
                $compile = _$compile_;
                $location = _$location_;
                $log = _$log_;
                $q = _$q_;
                getActivity = activity;
                networkService = _networkService_;
                networkService.getSingleDeveloperActivityMetadata.and.returnValue($q.when(metadata('developer')));
                networkService.getSingleListingActivityMetadata.and.returnValue($q.when(metadata('listing')));
                networkService.getSingleProductActivityMetadata.and.returnValue($q.when(metadata('product')));
                networkService.getSingleVersionActivityMetadata.and.returnValue($q.when(metadata('version')));
                networkService.getActivityById.and.callFake(id => $q.when(getActivity(id)));

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
                it('should get listing activity from the network', () => {
                    expect(networkService.getSingleListingActivityMetadata).toHaveBeenCalledWith(9939);
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

                it('should get version activity from the network', () => {
                    expect(networkService.getSingleVersionActivityMetadata).toHaveBeenCalledWith(7708);
                    expect(networkService.getActivityById).toHaveBeenCalledWith(46857);
                    expect(networkService.getActivityById).toHaveBeenCalledWith(46860);
                });

                it('should get product activity from the network', () => {
                    expect(networkService.getSingleProductActivityMetadata).toHaveBeenCalledWith(3067);
                    expect(networkService.getActivityById).toHaveBeenCalledWith(46858);
                });

                it('should get developer activity from the network', () => {
                    expect(networkService.getSingleDeveloperActivityMetadata).toHaveBeenCalledWith(1654);
                    expect(networkService.getActivityById).toHaveBeenCalledWith(8905);
                    expect(networkService.getActivityById).toHaveBeenCalledWith(8910);
                    expect(networkService.getActivityById).toHaveBeenCalledWith(42854);
                    expect(networkService.getActivityById).toHaveBeenCalledWith(46859);
                });
            });

            describe('when interpreting the reports', () => {
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
                        ctrl.listing = getActivity(4607).newData;
                        ctrl._interpretCertificationStatusChanges();
                        expect(ctrl.activity.length).toBe(1);
                        expect(ctrl.activity[0].change).toEqual(['Certification Status became "Active"']);
                    });

                    it('should have an item for certification status changing', () => {
                        ctrl.listing = getActivity(433).newData;
                        ctrl._interpretCertificationStatusChanges();
                        expect(ctrl.activity.length).toBe(2);
                        expect(ctrl.activity[0].change).toEqual(['Certification Status became "Active"']);
                        expect(ctrl.activity[1].change).toEqual(['Certification Status became "Suspended by ONC"']);
                    });

                    it('should have an item for certification status changing after confirmation', () => {
                        ctrl.listing = getActivity(17925).newData;
                        ctrl._interpretCertificationStatusChanges();
                        expect(ctrl.activity.length).toBe(1);
                        expect(ctrl.activity[0].change).toEqual(['Certification Status became "Active"']);
                    });
                });

                describe('when dealing with MUU data', () => {
                    beforeEach(() => {
                        ctrl.activity = [];
                        ctrl.listing = angular.copy(getActivity(5452).newData);
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

                describe('when dealing with Version changes', () => {
                    it('should know when a version changed', () => {
                        let activity = getActivity(46857);
                        ctrl._interpretVersion(activity);
                        expect(activity.change[0]).toEqual('Version changed from 5.3 to 5.30');
                    });

                    it('should know when a version was merged', () => {
                        let activity = getActivity(46860);
                        ctrl._interpretVersion(activity);
                        expect(activity.change[0]).toEqual('Merged Versions 6.00, 6.0 to make Version 6.00');
                    });

                    xit('should know get the history of the merged parents', () => {
                        let activity = getActivity(46860);
                        networkService.getSingleVersionActivityMetadata.and.returnValue($q.when([]));
                        ctrl._interpretVersion(activity);
                        expect(networkService.getSingleVersionActivityMetadata).toHaveBeenCalledWith(4411);
                        expect(networkService.getSingleVersionActivityMetadata).toHaveBeenCalledWith(4396);
                    });

                    it('should report nothing for a created version', () => {
                        let activity = getActivity(32545);
                        ctrl._interpretVersion(activity);
                        expect(activity.change).toEqual([]);
                    });
                });

                describe('when dealing with Product changes', () => {
                    let activity;
                    beforeEach(() => {
                        activity = getActivity(46858);
                    });

                    it('should know when a product changed', () => {
                        ctrl._interpretProduct(activity);
                        expect(activity.change[0]).toEqual('Product changed from axiUm CE to axiUm ce');
                    });

                    it('should report nothing for a created product', () => {
                        let activity = getActivity(10910);
                        ctrl._interpretProduct(activity);
                        expect(activity.change).toEqual([]);
                    });
                });

                describe('when dealing with Developer changes', () => {
                    let activity;
                    beforeEach(() => {
                        activity = getActivity(46859);
                    });

                    it('should know when a developer changed', () => {
                        ctrl._interpretDeveloper(activity);
                        expect(activity.change[0]).toEqual('Developer changed from Exan Enterprises to Exan Enterprises, Inc.');
                    });

                    it('should report nothing for a created developer', () => {
                        let activity = getActivity(10909);
                        ctrl._interpretDeveloper(activity);
                        expect(activity.change).toEqual([]);
                    });
                });
            });
        });
    });
})();
