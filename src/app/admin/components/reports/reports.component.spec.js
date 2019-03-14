(function () {
    'use strict';

    describe('the Admin Reports component', function () {

        var $compile, $log, $q, $uibModal, ActivityMock, Mock, actualOptions, ctrl, el, networkService, scope;

        beforeEach(function () {
            angular.mock.module('chpl.mock', 'chpl.admin', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getCertifiedProductActivity = jasmine.createSpy('getCertifiedProductActivity');
                    $delegate.getDeveloperActivity = jasmine.createSpy('getDeveloperActivity');
                    $delegate.getProductActivity = jasmine.createSpy('getProductActivity');
                    $delegate.getVersionActivity = jasmine.createSpy('getVersionActivity');
                    $delegate.getAcbActivity = jasmine.createSpy('getAcbActivity');
                    $delegate.getAtlActivity = jasmine.createSpy('getAtlActivity');
                    $delegate.getAnnouncementActivity = jasmine.createSpy('getAnnouncementActivity');
                    $delegate.getUserActivity = jasmine.createSpy('getUserActivity');
                    $delegate.getUserActivities = jasmine.createSpy('getUserActivities');
                    $delegate.getApiUserActivity = jasmine.createSpy('getApiUserActivity');
                    $delegate.getApiActivity = jasmine.createSpy('getApiActivity');
                    $delegate.getApiUsers = jasmine.createSpy('getApiUsers');
                    $delegate.getSingleCertifiedProductActivity = jasmine.createSpy('getSingleCertifiedProductActivity');
                    return $delegate;
                });
            });

            inject(function (_$compile_, $controller, _$log_, _$q_, $rootScope, _$uibModal_, _ActivityMock_, _Mock_, _networkService_) {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                ActivityMock = _ActivityMock_;
                Mock = _Mock_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return Mock.fakeModal;
                });
                networkService = _networkService_;
                networkService.getCertifiedProductActivity.and.returnValue($q.when(Mock.listingActivity));
                networkService.getDeveloperActivity.and.returnValue($q.when([]));
                networkService.getProductActivity.and.returnValue($q.when([]));
                networkService.getVersionActivity.and.returnValue($q.when([]));
                networkService.getAcbActivity.and.returnValue($q.when([]));
                networkService.getAtlActivity.and.returnValue($q.when([]));
                networkService.getAnnouncementActivity.and.returnValue($q.when([]));
                networkService.getUserActivity.and.returnValue($q.when([]));
                networkService.getUserActivities.and.returnValue($q.when([]));
                networkService.getApiUserActivity.and.returnValue($q.when([]));
                networkService.getApiActivity.and.returnValue($q.when([]));
                networkService.getApiUsers.and.returnValue($q.when([]));
                networkService.getSingleCertifiedProductActivity.and.returnValue($q.when([]));

                scope = $rootScope.$new()

                el = angular.element('<ai-reports></ai-reports');

                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('view', function () {
            it('should be compiled', function () {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', function () {
            it('should set the start date to day 1 of chpl if on a single product', function () {
                var startDate = new Date('4/1/2016');
                el = angular.element('<ai-reports product-id="1"></ai-reports');

                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
                expect(ctrl.activityRange.listing.startDate).toEqual(startDate);
            });

            describe('helper functions', function () {
                describe('for refreshing', function () {
                    beforeEach(function () {
                        spyOn(ctrl, 'singleCp');
                        spyOn(ctrl, 'refreshCp');
                        spyOn(ctrl, 'refreshDeveloper');
                        spyOn(ctrl, 'refreshProduct');
                        spyOn(ctrl, 'refreshAcb');
                        spyOn(ctrl, 'refreshAtl');
                        spyOn(ctrl, 'refreshAnnouncement');
                        spyOn(ctrl, 'refreshUser');
                        spyOn(ctrl, 'refreshApi');
                        spyOn(ctrl, 'refreshApiKeyUsage');
                    });

                    it('should refresh the single CP if on a single product', function () {
                        ctrl.productId = 1;
                        ctrl.workType = '';
                        ctrl.refreshActivity();
                        expect(ctrl.singleCp).toHaveBeenCalled();
                        expect(ctrl.refreshCp).not.toHaveBeenCalled();
                        expect(ctrl.refreshDeveloper).not.toHaveBeenCalled();
                        expect(ctrl.refreshProduct).not.toHaveBeenCalled();
                        expect(ctrl.refreshAcb).not.toHaveBeenCalled();
                        expect(ctrl.refreshAtl).not.toHaveBeenCalled();
                        expect(ctrl.refreshAnnouncement).not.toHaveBeenCalled();
                        expect(ctrl.refreshUser).not.toHaveBeenCalled();
                        expect(ctrl.refreshApi).not.toHaveBeenCalled();
                        expect(ctrl.refreshApiKeyUsage).not.toHaveBeenCalled();
                    });

                    it('should refresh the CP data specifically', function () {
                        ctrl.workType = '';
                        ctrl.refreshActivity();
                        expect(ctrl.singleCp).not.toHaveBeenCalled();
                        expect(ctrl.refreshCp).toHaveBeenCalled();
                        expect(ctrl.refreshDeveloper).not.toHaveBeenCalled();
                        expect(ctrl.refreshProduct).not.toHaveBeenCalled();
                        expect(ctrl.refreshAcb).not.toHaveBeenCalled();
                        expect(ctrl.refreshAtl).not.toHaveBeenCalled();
                        expect(ctrl.refreshAnnouncement).not.toHaveBeenCalled();
                        expect(ctrl.refreshUser).not.toHaveBeenCalled();
                        expect(ctrl.refreshApi).not.toHaveBeenCalled();
                        expect(ctrl.refreshApiKeyUsage).not.toHaveBeenCalled();
                    });

                    it('should refresh the CP data specifically', function () {
                        ctrl.workType = '';
                        ctrl.productId = 1;
                        ctrl.refreshActivity();
                        expect(ctrl.singleCp).toHaveBeenCalled();
                        expect(ctrl.refreshCp).not.toHaveBeenCalled();
                        expect(ctrl.refreshDeveloper).not.toHaveBeenCalled();
                        expect(ctrl.refreshProduct).not.toHaveBeenCalled();
                        expect(ctrl.refreshAcb).not.toHaveBeenCalled();
                        expect(ctrl.refreshAtl).not.toHaveBeenCalled();
                        expect(ctrl.refreshAnnouncement).not.toHaveBeenCalled();
                        expect(ctrl.refreshUser).not.toHaveBeenCalled();
                        expect(ctrl.refreshApi).not.toHaveBeenCalled();
                        expect(ctrl.refreshApiKeyUsage).not.toHaveBeenCalled();
                    });

                    it('should refresh the dev data specifically', function () {
                        ctrl.workType = 'dev';
                        ctrl.refreshActivity();
                        expect(ctrl.singleCp).not.toHaveBeenCalled();
                        expect(ctrl.refreshCp).not.toHaveBeenCalled();
                        expect(ctrl.refreshDeveloper).toHaveBeenCalled();
                        expect(ctrl.refreshProduct).not.toHaveBeenCalled();
                        expect(ctrl.refreshAcb).not.toHaveBeenCalled();
                        expect(ctrl.refreshAtl).not.toHaveBeenCalled();
                        expect(ctrl.refreshAnnouncement).not.toHaveBeenCalled();
                        expect(ctrl.refreshUser).not.toHaveBeenCalled();
                        expect(ctrl.refreshApi).not.toHaveBeenCalled();
                        expect(ctrl.refreshApiKeyUsage).not.toHaveBeenCalled();
                    });

                    it('should refresh the product data specifically', function () {
                        ctrl.workType = 'prod';
                        ctrl.refreshActivity();
                        expect(ctrl.singleCp).not.toHaveBeenCalled();
                        expect(ctrl.refreshCp).not.toHaveBeenCalled();
                        expect(ctrl.refreshDeveloper).not.toHaveBeenCalled();
                        expect(ctrl.refreshProduct).toHaveBeenCalled();
                        expect(ctrl.refreshAcb).not.toHaveBeenCalled();
                        expect(ctrl.refreshAtl).not.toHaveBeenCalled();
                        expect(ctrl.refreshAnnouncement).not.toHaveBeenCalled();
                        expect(ctrl.refreshUser).not.toHaveBeenCalled();
                        expect(ctrl.refreshApi).not.toHaveBeenCalled();
                        expect(ctrl.refreshApiKeyUsage).not.toHaveBeenCalled();
                    });

                    it('should refresh the acb data specifically', function () {
                        ctrl.workType = 'acb';
                        ctrl.refreshActivity();
                        expect(ctrl.singleCp).not.toHaveBeenCalled();
                        expect(ctrl.refreshCp).not.toHaveBeenCalled();
                        expect(ctrl.refreshDeveloper).not.toHaveBeenCalled();
                        expect(ctrl.refreshProduct).not.toHaveBeenCalled();
                        expect(ctrl.refreshAcb).toHaveBeenCalled();
                        expect(ctrl.refreshAtl).not.toHaveBeenCalled();
                        expect(ctrl.refreshAnnouncement).not.toHaveBeenCalled();
                        expect(ctrl.refreshUser).not.toHaveBeenCalled();
                        expect(ctrl.refreshApi).not.toHaveBeenCalled();
                        expect(ctrl.refreshApiKeyUsage).not.toHaveBeenCalled();
                    });

                    it('should refresh the atl data specifically', function () {
                        ctrl.workType = 'atl';
                        ctrl.refreshActivity();
                        expect(ctrl.singleCp).not.toHaveBeenCalled();
                        expect(ctrl.refreshCp).not.toHaveBeenCalled();
                        expect(ctrl.refreshDeveloper).not.toHaveBeenCalled();
                        expect(ctrl.refreshProduct).not.toHaveBeenCalled();
                        expect(ctrl.refreshAcb).not.toHaveBeenCalled();
                        expect(ctrl.refreshAtl).toHaveBeenCalled();
                        expect(ctrl.refreshAnnouncement).not.toHaveBeenCalled();
                        expect(ctrl.refreshUser).not.toHaveBeenCalled();
                        expect(ctrl.refreshApi).not.toHaveBeenCalled();
                        expect(ctrl.refreshApiKeyUsage).not.toHaveBeenCalled();
                    });

                    it('should refresh the announcement data specifically', function () {
                        ctrl.workType = 'announcement';
                        ctrl.refreshActivity();
                        expect(ctrl.singleCp).not.toHaveBeenCalled();
                        expect(ctrl.refreshCp).not.toHaveBeenCalled();
                        expect(ctrl.refreshDeveloper).not.toHaveBeenCalled();
                        expect(ctrl.refreshProduct).not.toHaveBeenCalled();
                        expect(ctrl.refreshAcb).not.toHaveBeenCalled();
                        expect(ctrl.refreshAtl).not.toHaveBeenCalled();
                        expect(ctrl.refreshAnnouncement).toHaveBeenCalled();
                        expect(ctrl.refreshUser).not.toHaveBeenCalled();
                        expect(ctrl.refreshApi).not.toHaveBeenCalled();
                        expect(ctrl.refreshApiKeyUsage).not.toHaveBeenCalled();
                    });

                    it('should refresh the users data specifically', function () {
                        ctrl.workType = 'users';
                        ctrl.refreshActivity();
                        expect(ctrl.singleCp).not.toHaveBeenCalled();
                        expect(ctrl.refreshCp).not.toHaveBeenCalled();
                        expect(ctrl.refreshDeveloper).not.toHaveBeenCalled();
                        expect(ctrl.refreshProduct).not.toHaveBeenCalled();
                        expect(ctrl.refreshAcb).not.toHaveBeenCalled();
                        expect(ctrl.refreshAtl).not.toHaveBeenCalled();
                        expect(ctrl.refreshAnnouncement).not.toHaveBeenCalled();
                        expect(ctrl.refreshUser).toHaveBeenCalled();
                        expect(ctrl.refreshApi).not.toHaveBeenCalled();
                        expect(ctrl.refreshApiKeyUsage).not.toHaveBeenCalled();
                    });

                    it('should refresh the api key management data specifically', function () {
                        ctrl.workType = 'api_key_management';
                        ctrl.refreshActivity();
                        expect(ctrl.singleCp).not.toHaveBeenCalled();
                        expect(ctrl.refreshCp).not.toHaveBeenCalled();
                        expect(ctrl.refreshDeveloper).not.toHaveBeenCalled();
                        expect(ctrl.refreshProduct).not.toHaveBeenCalled();
                        expect(ctrl.refreshAcb).not.toHaveBeenCalled();
                        expect(ctrl.refreshAtl).not.toHaveBeenCalled();
                        expect(ctrl.refreshAnnouncement).not.toHaveBeenCalled();
                        expect(ctrl.refreshUser).not.toHaveBeenCalled();
                        expect(ctrl.refreshApi).toHaveBeenCalled();
                        expect(ctrl.refreshApiKeyUsage).not.toHaveBeenCalled();
                    });
                });

                it('should clear the API Key filter object', function () {
                    var aDate = new Date();
                    ctrl.activityRange.startDate = aDate;
                    ctrl.activityRange.endDate = aDate;
                    ctrl.apiKey = {
                        visiblePage: 34,
                        pageSize: 2,
                        startDate: new Date('1/1/2000'),
                        endDate: new Date('1/1/2000'),
                    };
                    ctrl.clearApiKeyFilter();
                    expect(ctrl.apiKey).toEqual({
                        visiblePage: 1,
                        pageSize: 100,
                        startDate: aDate,
                        endDate: aDate,
                    });
                });

                describe('for comparing surveillances', function () {
                    var modalOptions, newS, oldS;
                    beforeEach(function () {
                        modalOptions = {
                            templateUrl: 'chpl.admin/components/reports/compareSurveillanceRequirements.html',
                            controller: 'CompareSurveillanceRequirementsController',
                            controllerAs: 'vm',
                            animation: false,
                            backdrop: 'static',
                            keyboard: false,
                            size: 'lg',
                            resolve: {
                                newSurveillance: jasmine.any(Function),
                                oldSurveillance: jasmine.any(Function),
                            },
                        };
                        newS = {id: 1};
                        oldS = {id: 2};
                    });

                    it('should create a modal instance', function () {
                        expect(ctrl.modalInstance).toBeUndefined();
                        ctrl.compareSurveillances(oldS, newS);
                        expect(ctrl.modalInstance).toBeDefined();
                    });

                    it('should resolve elements', function () {
                        ctrl.compareSurveillances(oldS, newS);
                        expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                        expect(actualOptions.resolve.newSurveillance()).toEqual(newS);
                        expect(actualOptions.resolve.oldSurveillance()).toEqual(oldS);
                    });
                });

                describe('for date ranges', function () {
                    beforeEach(function () {
                        ctrl.activityRange = {
                            range: 60,
                            key: {
                                startDate: new Date('1/15/2017'),
                                endDate: new Date('2/15/2017'),
                            },
                            listing: {
                                startDate: new Date('1/15/2017'),
                                endDate: new Date('2/15/2017'),
                            },
                        };
                    });

                    it('should have a function to determine if a date range is okay', function () {
                        expect(ctrl.validDates).toBeDefined()
                    });

                    it('should allow dates with less than the range separation', function () {
                        expect(ctrl.validDates('key')).toBe(true);
                    });

                    it('should not allow dates separated by more than the range', function () {
                        ctrl.activityRange.range = 1;
                        expect(ctrl.validDates('key')).toBe(false);
                    });

                    it('should not allow dates where start is after end', function () {
                        ctrl.activityRange.key.startDate = new Date('3/15/2017');
                        expect(ctrl.validDates('key')).toBe(false);
                    });

                    it('should allow "all time" if on a single listing', function () {
                        ctrl.productId = 1;
                        expect(ctrl.validDates('listing')).toBe(true);
                    });

                    it('should not allow dates where start is after end on a single listing', function () {
                        ctrl.productId = 1;
                        ctrl.activityRange.listing.startDate = new Date('3/15/2017');
                        expect(ctrl.validDates('listing')).toBe(false);
                    });

                    it('should correctly validate dates crossing DST', function () {
                        ctrl.activityRange = {
                            range: 60,
                            badDst: {
                                startDate: new Date('9/17/2017'),
                                endDate: new Date('11/16/2017'),
                            },
                            notDst: {
                                startDate: new Date('9/06/2017'),
                                endDate: new Date('11/04/2017'),
                            },
                            badNotDst: {
                                startDate: new Date('9/06/2017'),
                                endDate: new Date('11/05/2017'),
                            },
                        };
                        expect(ctrl.validDates('badDst')).toBe(false);
                        expect(ctrl.validDates('notDst')).toBe(true);
                        expect(ctrl.validDates('badNotDst')).toBe(false);
                    });
                });
            });

            describe('when parsing', function () {
                it('unknown descriptions should report directly', function () {
                    var expectedActivity, rawActivity;
                    expectedActivity = {
                        acb: '',
                        date: 1492429771059,
                        friendlyActivityDate: '2017-04-17',
                        newId: 17497,
                    };
                    rawActivity = angular.copy(Mock.listingActivity[1]);
                    rawActivity.description = 'Something odd with a Listing';
                    expectedActivity.action = 'Something odd with a Listing';

                    ctrl._interpretCps([rawActivity]);
                    expect(ctrl.searchedCertifiedProducts[0]).toEqual(expectedActivity);
                });

                describe('newly created Listings', function () {
                    var expectedActivity, rawActivity;

                    beforeEach(function () {
                        expectedActivity = {
                            acb: 'CCHIT',
                            date: 1492429771059,
                            certificationDate: 1285819200000,
                            certificationEdition: '2014',
                            chplProductNumber: 'CHP-009351',
                            developer: 'Epic Systems Corporation',
                            friendlyActivityDate: '2017-04-17',
                            friendlyCertificationDate: '2010-09-30',
                            id: 1480,
                            newId: 17497,
                            product: 'EpicCare Ambulatory - Core EMR 2',
                        };
                        rawActivity = angular.copy(Mock.listingActivity[1]);
                    });

                    it('should create an upload activity', function () {
                        ctrl._interpretCps([rawActivity]);
                        expect(ctrl.searchedCertifiedProductsUpload[0]).toEqual(expectedActivity);
                    });
                });

                describe('updated Listings', function () {
                    var expectedActivity, rawActivity;

                    beforeEach(function () {
                        expectedActivity = {
                            acb: 'CCHIT',
                            date: 1492429771059,
                            certificationDate: 1285819200000,
                            certificationEdition: '2014',
                            chplProductNumber: 'CHP-009351',
                            developer: 'Epic Systems Corporation',
                            friendlyActivityDate: '2017-04-17',
                            friendlyCertificationDate: '2010-09-30',
                            id: 1480,
                            newId: 17497,
                            product: 'EpicCare Ambulatory - Core EMR 2',
                        };
                        rawActivity = angular.copy(Mock.listingActivity[0]);
                    });

                    it('should interpret status changes', function () {
                        rawActivity.newData.certificationStatus = {
                            name: 'Active',
                            id: 1,
                        };
                        expectedActivity.details = 'Certification Status changed from Retired to Active';
                        ctrl._interpretCps([rawActivity]);
                        expect(ctrl.searchedCertifiedProductsStatus[0]).toEqual(expectedActivity);
                    });

                    it('should interpret basic field changes', function () {
                        rawActivity.newData.productAdditionalSoftware = 'Some new software';
                        expectedActivity.details = ['Product-wide Relied Upon Software added: Some new software'];
                        expectedActivity.csvDetails = 'Product-wide Relied Upon Software added: Some new software';
                        ctrl._interpretCps([rawActivity]);
                        expect(ctrl.searchedCertifiedProducts[0]).toEqual(expectedActivity);
                    });

                    it('should interpret nested field changes', function () {
                        rawActivity.originalData.certifyingBody.name = 'ICSA Labs';
                        expectedActivity.details = ['Certifying Body changed from ICSA Labs to CCHIT'];
                        expectedActivity.csvDetails = 'Certifying Body changed from ICSA Labs to CCHIT';
                        ctrl._interpretCps([rawActivity]);
                        expect(ctrl.searchedCertifiedProducts[0]).toEqual(expectedActivity);
                    });

                    it('should handle accessibility standards', function () {
                        rawActivity.originalData.accessibilityStandards = [{accessibilityStandardName: 'a standard'}];
                        expectedActivity.details = ['Accessibility Standard "a standard" changes<ul><li>a standard removed</li></ul>'];
                        expectedActivity.csvDetails = 'Accessibility Standard "a standard" changes<ul><li>a standard removed</li></ul>';
                        ctrl._interpretCps([rawActivity]);
                        expect(ctrl.searchedCertifiedProducts[0]).toEqual(expectedActivity);
                    });

                    it('should handle criteria addition', function () {
                        rawActivity.originalData.certificationResults[0].success = false;
                        expectedActivity.details = ['Certification "170.302 (a)" changes<ul><li>Successful added: true</li></ul>'];
                        expectedActivity.csvDetails = 'Certification "170.302 (a)" changes<ul><li>Successful added: true</li></ul>';
                        ctrl._interpretCps([rawActivity]);
                        expect(ctrl.searchedCertifiedProducts[0]).toEqual(expectedActivity);
                    });

                    it('should handle cqm addition', function () {
                        rawActivity.originalData.cqmResults[0].success = false;
                        expectedActivity.details = ['CQM "null" changes<ul><li>Success added: true</li></ul>'];
                        expectedActivity.csvDetails = 'CQM "null" changes<ul><li>Success added: true</li></ul>';
                        ctrl._interpretCps([rawActivity]);
                        expect(ctrl.searchedCertifiedProducts[0]).toEqual(expectedActivity);
                    });
                });

                describe('ICS family activity', function () {
                    var expectedActivity, rawActivity;

                    beforeEach(function () {
                        expectedActivity = {
                            acb: 'CCHIT',
                            date: 1492429771059,
                            certificationDate: 1285819200000,
                            certificationEdition: '2014',
                            chplProductNumber: 'CHP-009351',
                            developer: 'Epic Systems Corporation',
                            friendlyActivityDate: '2017-04-17',
                            friendlyCertificationDate: '2010-09-30',
                            id: 1480,
                            newId: 17497,
                            product: 'EpicCare Ambulatory - Core EMR 2',
                        };
                        rawActivity = angular.copy(Mock.listingActivity[0]);
                    });

                    it('should recognize added/removed ICS Parents', function () {
                        rawActivity.originalData.ics.parents =[{chplProductNumber: 'ID',certificationDate: 1490194030517,certifiedProductId: 1},{chplProductNumber: 'ID2',certificationDate: 1490194030517,certifiedProductId: 2}];
                        rawActivity.newData.ics.parents = [{chplProductNumber: 'ID2',certificationDate: 1490194030517,certifiedProductId: 2},{chplProductNumber: 'ID3',certificationDate: 1490194030517,certifiedProductId: 3}];
                        expectedActivity.details = ['ICS Parent "ID" changes<ul><li>ID removed</li></ul>', 'ICS Parent "ID3" changes<ul><li>ID3 added</li></ul>'];
                        expectedActivity.csvDetails = 'ICS Parent "ID" changes<ul><li>ID removed</li></ul>\nICS Parent "ID3" changes<ul><li>ID3 added</li></ul>';

                        ctrl._interpretCps([rawActivity]);
                        expect(ctrl.searchedCertifiedProducts[0]).toEqual(expectedActivity);
                    });

                    it('should recognize added/removed ICS Children', function () {
                        rawActivity.originalData.ics.children = [{chplProductNumber: 'ID2',certificationDate: 1490194030517,certifiedProductId: 2},{chplProductNumber: 'ID3',certificationDate: 1490194030517,certifiedProductId: 3}];
                        rawActivity.newData.ics.children =[{chplProductNumber: 'ID',certificationDate: 1490194030517,certifiedProductId: 1},{chplProductNumber: 'ID2',certificationDate: 1490194030517,certifiedProductId: 2}];
                        expectedActivity.details = ['ICS Child "ID3" changes<ul><li>ID3 removed</li></ul>', 'ICS Child "ID" changes<ul><li>ID added</li></ul>'];
                        expectedActivity.csvDetails = 'ICS Child "ID3" changes<ul><li>ID3 removed</li></ul>\nICS Child "ID" changes<ul><li>ID added</li></ul>';

                        ctrl._interpretCps([rawActivity]);
                        expect(ctrl.searchedCertifiedProducts[0]).toEqual(expectedActivity);
                    });
                });

                describe('Surveillance', function () {
                    var expectedActivity, rawActivity;

                    beforeEach(function () {
                        expectedActivity = {
                            acb: 'CCHIT',
                            date: 1492429771059,
                            details: ['N/A'],
                            friendlyActivityDate: '2017-04-17',
                            newId: 17497,
                        };
                        rawActivity = angular.copy(Mock.listingActivity[0]);
                    });

                    it('deletion should be recognized', function () {
                        rawActivity.description = 'Surveillance was deleted from CHP-1231';
                        expectedActivity.action = 'Surveillance was deleted from CHPL Product <a href="#/product/1480">CHP-009351</a>';
                        ctrl._interpretCps([rawActivity]);
                        expect(ctrl.searchedCertifiedProductsSurveillance[0]).toEqual(expectedActivity);
                    });

                    it('upload should be recognized', function () {
                        rawActivity.description = 'Surveillance upload';
                        expectedActivity.action = 'Surveillance was uploaded for CHPL Product <a href="#/product/1480">CHP-009351</a>';
                        ctrl._interpretCps([rawActivity]);
                        expect(ctrl.searchedCertifiedProductsSurveillance[0]).toEqual(expectedActivity);
                    });

                    it('addition shouls be recognized', function () {
                        rawActivity.description = 'Surveillance was added';
                        expectedActivity.action = 'Surveillance was added for CHPL Product <a href="#/product/1480">CHP-009351</a>';
                        ctrl._interpretCps([rawActivity]);
                        expect(ctrl.searchedCertifiedProductsSurveillance[0]).toEqual(expectedActivity);
                    });

                    it('strangeness should be handled', function () {
                        rawActivity.description = 'Surveillance was changed in a weird way';
                        expectedActivity.action = 'Surveillance was changed in a weird way<br /><a href="#/product/1480">CHP-009351</a>';
                        ctrl._interpretCps([rawActivity]);
                        expect(ctrl.searchedCertifiedProductsSurveillance[0]).toEqual(expectedActivity);
                    });

                    it('documentation upload should be reported', function () {
                        rawActivity.description = 'Documentation';
                        expectedActivity.action = 'Documentation was added to a nonconformity for <a href="#/product/1480">CHP-009351</a>';
                        ctrl._interpretCps([rawActivity]);
                        expect(ctrl.searchedCertifiedProductsSurveillance[0]).toEqual(expectedActivity);

                    });

                    it('documentation removal should be reported', function () {
                        rawActivity.description = 'A document was removed';
                        expectedActivity.action = 'Documentation was removed from a nonconformity for <a href="#/product/1480">CHP-009351</a>';
                        ctrl._interpretCps([rawActivity]);
                        expect(ctrl.searchedCertifiedProductsSurveillance[0]).toEqual(expectedActivity);
                    });

                    describe('update', function () {
                        beforeEach(function () {
                            expectedActivity = {
                                acb: 'CCHIT',
                                date: 1492429771059,
                                details: [],
                                friendlyActivityDate: '2017-04-17',
                                newId: 17497,
                                action: 'Surveillance was updated for CHPL Product <a href="#/product/1480">CHP-009351</a>',
                            };
                            rawActivity = angular.copy(Mock.listingActivity[0]);
                            rawActivity.description = 'Surveillance was updated';
                            rawActivity.originalData.surveillance = [{friendlyId: 'SURV01'}];
                            rawActivity.newData.surveillance = [{friendlyId: 'SURV01'}];
                        });

                        it('should punt to user feedback if no specified changes are found', function () {
                            expectedActivity.source = {
                                oldS: rawActivity.originalData,
                                newS: rawActivity.newData,
                            };
                            ctrl._interpretCps([rawActivity]);
                            expect(ctrl.searchedCertifiedProductsSurveillance[0]).toEqual(expectedActivity);
                        });

                        it('should parse some simple fields', function () {
                            rawActivity.originalData.surveillance[0].randomizedSitesUsed = 4;
                            rawActivity.newData.surveillance[0].randomizedSitesUsed = 6;
                            expectedActivity.details = ['SURV01<ul><li>Number of sites surveilled changed from 4 to 6</li></ul>']
                            ctrl._interpretCps([rawActivity]);
                            expect(ctrl.searchedCertifiedProductsSurveillance[0]).toEqual(expectedActivity);
                        });

                        it('should parse nested fields', function () {
                            rawActivity.originalData.surveillance[0].type = { name: 'randomized' };
                            rawActivity.newData.surveillance[0].type = { name: 'reactive' };
                            expectedActivity.details = ['SURV01<ul><li>Certification Type changed from randomized to reactive</li></ul>']
                            ctrl._interpretCps([rawActivity]);
                            expect(ctrl.searchedCertifiedProductsSurveillance[0]).toEqual(expectedActivity);
                        });
                    });
                });

                describe('SED', function () {
                    describe('UCD Processes', function () {
                        it('should recognize changed details', function () {
                            var activity;
                            activity = ctrl._compareSed(ActivityMock.sed[0].originalData, ActivityMock.sed[0].newData);
                            expect(activity[0]).toEqual('<li>UCD Process Name "A process" changes<ul><li>UCD Process Details changed from some details to Changed details</li></ul></li>');
                        });

                        it('should recognize removed processes', function () {
                            var activity;
                            activity = ctrl._compareSed(ActivityMock.sed[0].originalData, ActivityMock.sed[0].newData);
                            expect(activity[1]).toEqual('<li>UCD Process Name "A second" changes<ul><li>A second removed</li></ul></li>');
                        });

                        it('should recognize changed criteria', function () {
                            var activity;
                            activity = ctrl._compareSed(ActivityMock.sed[0].originalData, ActivityMock.sed[0].newData);
                            expect(activity[2]).toEqual('<li>UCD Process Name "Fourth" changes<ul><li>Added Certification Criteria:<ul><li>170.315 (a)(2)</li></ul></li><li>Removed Certification Criteria:<ul><li>170.315 (a)(1)</li></ul></li></ul></li>');
                        });

                        it('should recognize added processes', function () {
                            var activity;
                            activity = ctrl._compareSed(ActivityMock.sed[0].originalData, ActivityMock.sed[0].newData);
                            expect(activity[3]).toEqual('<li>UCD Process Name "A third" changes<ul><li>A third added</li></ul></li>');
                        });
                    });

                    describe('Tasks', function () {
                        it('should recognize changed elements', function () {
                            var activity;
                            activity = ctrl._compareSed(ActivityMock.sed[1].originalData, ActivityMock.sed[1].newData);
                            expect(activity[0]).toEqual('<li>Task Description "A description that changed" changes<ul><li>Description changed from A description that changes to A description that changed</li></ul></li>');
                        });

                        it('should recognize removed tasks', function () {
                            var activity;
                            activity = ctrl._compareSed(ActivityMock.sed[1].originalData, ActivityMock.sed[1].newData);
                            expect(activity[1]).toEqual('<li>Task Description "A removed task" changes<ul><li>A removed task removed</li></ul></li>');
                        });

                        it('should recognize added participants', function () {
                            var activity;
                            activity = ctrl._compareSed(ActivityMock.sed[1].originalData, ActivityMock.sed[1].newData);
                            expect(activity[2]).toEqual('<li>Task Description "Added participant" changes<ul><li>Added 1 Test Participant</li></ul></li>');
                        });

                        it('should recognize removed participants', function () {
                            var activity;
                            activity = ctrl._compareSed(ActivityMock.sed[1].originalData, ActivityMock.sed[1].newData);
                            expect(activity[3]).toEqual('<li>Task Description "Removed participant" changes<ul><li>Removed 1 Test Participant</li></ul></li>');
                        });

                        it('should recognize adding criteria', function () {
                            var activity;
                            activity = ctrl._compareSed(ActivityMock.sed[1].originalData, ActivityMock.sed[1].newData);
                            expect(activity[4]).toEqual('<li>Task Description "Adding criteria" changes<ul><li>Added Certification Criteria:<ul><li>number</li></ul></li></ul></li>');
                        });

                        it('should recognize removed criteria', function () {
                            var activity;
                            activity = ctrl._compareSed(ActivityMock.sed[1].originalData, ActivityMock.sed[1].newData);
                            expect(activity[5]).toEqual('<li>Task Description "Removing criteria" changes<ul><li>Removed Certification Criteria:<ul><li>number</li></ul></li></ul></li>');
                        });

                        it('should recognize added tasks', function () {
                            var activity;
                            activity = ctrl._compareSed(ActivityMock.sed[1].originalData, ActivityMock.sed[1].newData);
                            expect(activity[6]).toEqual('<li>Task Description "An added task" changes<ul><li>An added task added</li></ul></li>');
                        });
                    });

                    describe('Participants', function () {
                        var activity, curr, prev;
                        beforeEach(function () {
                            prev = ActivityMock.sed[2].originalData;
                            curr = ActivityMock.sed[2].newData
                        });

                        it('should dedupe participants', function () {
                            ctrl._compareSed(prev, curr);
                            expect(prev.allParticipants.length).toBe(3);
                            expect(curr.allParticipants.length).toBe(3);
                        });

                        it('should recognize changed age', function () {
                            activity = ctrl._compareSed(prev, curr);
                            expect(activity[2]).toEqual('<li>Participant changes<ul><li>Age Range changed from 1-9 to 100+</li></ul></li>');
                        });

                        it('should recognize changed gender', function () {
                            activity = ctrl._compareSed(prev, curr);
                            expect(activity[3]).toEqual('<li>Participant changes<ul><li>Gender changed from Male to Female</li></ul></li>');
                        });
                    });
                });

                describe('certification event history', function () {
                    describe('in the old style', function () {
                        it('should recognize when nothing changed', function () {
                            var prev = [{id: 8251, eventDate: 1482364800000, certificationStatusId: 1, certificationStatusName: 'Active', lastModifiedUser: 9, lastModifiedDate: 1483038556838}];
                            var curr = [{id: 8251, eventDate: 1482364800000, certificationStatusId: 1, certificationStatusName: 'Active', lastModifiedUser: 9, lastModifiedDate: 1483038556838}];

                            var activity = ctrl._compareCertificationEvents(prev, curr);
                            expect(activity).toEqual([]);
                        });

                        it('should recognize an added event', function () {
                            var prev = [{id: 8251, eventDate: 1482364800000, certificationStatusId: 1, certificationStatusName: 'Active', lastModifiedUser: 9, lastModifiedDate: 1483038556838}];
                            var curr = [{id: 8251, eventDate: 1482364800000, certificationStatusId: 1, certificationStatusName: 'Active', lastModifiedUser: 9, lastModifiedDate: 1483038556838}, {id: 14429, eventDate: 1515764832087, certificationStatusId: 3, certificationStatusName: 'Withdrawn by Developer', lastModifiedUser: 5, lastModifiedDate: 1515764824875}];

                            var activity = ctrl._compareCertificationEvents(prev, curr);
                            expect(activity[0]).toEqual('Added "Withdrawn by Developer" status at Jan 12, 2018');
                        });

                        it('should recognize when a date changed', function () {
                            var prev = [{id: 8251, eventDate: 1482364800000, certificationStatusId: 1, certificationStatusName: 'Active', lastModifiedUser: 9, lastModifiedDate: 1483038556838}];
                            var curr = [{id: 8251, eventDate: 1515764832087, certificationStatusId: 1, certificationStatusName: 'Active', lastModifiedUser: 9, lastModifiedDate: 1483038556838}];

                            var activity = ctrl._compareCertificationEvents(prev, curr);
                            expect(activity[0]).toEqual('"Active" status changed effective date to Jan 12, 2018');
                        });

                        it('should recognize a changed status event', function () {
                            var prev = [{id: 8251, eventDate: 1482364800000, certificationStatusId: 1, certificationStatusName: 'Active', lastModifiedUser: 9, lastModifiedDate: 1483038556838}, {id: 14429, eventDate: 1515764832087, certificationStatusId: 3, certificationStatusName: 'Withdrawn by Developer', lastModifiedUser: 5, lastModifiedDate: 1515764824875}];
                            var curr = [{id: 8251, eventDate: 1482364800000, certificationStatusId: 1, certificationStatusName: 'Active', lastModifiedUser: 9, lastModifiedDate: 1483038556838}, {id: 14430, eventDate: 1515764832087, certificationStatusId: 3, certificationStatusName: 'Withdrawn by ONC-ACB', lastModifiedUser: 5, lastModifiedDate: 1515764824875}];

                            var activity = ctrl._compareCertificationEvents(prev, curr);
                            expect(activity[0]).toEqual('"Withdrawn by Developer" status became "Withdrawn by ONC-ACB" at Jan 12, 2018');
                        });
                    });

                    describe('in the new style', function () {
                        it('should recognize when nothing changed', function () {
                            var prev = [{id: 8251, eventDate: 1482382800000, status: {id: 1, name: 'Active'}, reason: null, lastModifiedUser: 9, lastModifiedDate: 1483056556838}, {id: 14470, eventDate: 1518100595716, status: {id: 1, name: 'Active'}, reason: 'They wanted it back', lastModifiedUser: 32, lastModifiedDate: 1518100640339}, {id: 14429, eventDate: 1515782832087, status: {id: 3, name: 'Withdrawn by Developer'}, reason: null, lastModifiedUser: 5, lastModifiedDate: 1515782824875}];
                            var curr = [{id: 8251, eventDate: 1482382800000, status: {id: 1, name: 'Active'}, reason: null, lastModifiedUser: 9, lastModifiedDate: 1483056556838}, {id: 14470, eventDate: 1518100595716, status: {id: 1, name: 'Active'}, reason: 'They wanted it back', lastModifiedUser: 32, lastModifiedDate: 1518100640339}, {id: 14429, eventDate: 1515782832087, status: {id: 3, name: 'Withdrawn by Developer'}, reason: null, lastModifiedUser: 5, lastModifiedDate: 1515782824875}];

                            var activity = ctrl._compareCertificationEvents(prev, curr);
                            expect(activity).toEqual([]);
                        });

                        it('should recognize an added event', function () {
                            var prev = [{id: 8251, eventDate: 1482382800000, status: {id: 1, name: 'Active'}, reason: null, lastModifiedUser: 9, lastModifiedDate: 1483056556838}, {id: 14429, eventDate: 1515782832087, status: {id: 3, name: 'Withdrawn by Developer'}, reason: null, lastModifiedUser: 5, lastModifiedDate: 1515782824875}];
                            var curr = [{id: 8251, eventDate: 1482382800000, status: {id: 1, name: 'Active'}, reason: null, lastModifiedUser: 9, lastModifiedDate: 1483056556838}, {id: 14470, eventDate: 1518100595716, status: {id: 1, name: 'Active'}, reason: 'They wanted it back', lastModifiedUser: 32, lastModifiedDate: 1518100640339}, {id: 14429, eventDate: 1515782832087, status: {id: 3, name: 'Withdrawn by Developer'}, reason: null, lastModifiedUser: 5, lastModifiedDate: 1515782824875}];

                            var activity = ctrl._compareCertificationEvents(prev, curr);
                            expect(activity[0]).toEqual('Added "Active" status at Feb 8, 2018 with reason: "They wanted it back"');
                        });

                        it('should recognize when a date changed', function () {
                            var prev = [{id: 8251, eventDate: 1482382800000, status: {id: 1, name: 'Active'}, reason: null, lastModifiedUser: 9, lastModifiedDate: 1483056556838}, {id: 14470, eventDate: 1518100595716, status: {id: 1, name: 'Active'}, reason: 'They wanted it back', lastModifiedUser: 32, lastModifiedDate: 1518100640339}, {id: 14429, eventDate: 1515782832087, status: {id: 3, name: 'Withdrawn by Developer'}, reason: null, lastModifiedUser: 5, lastModifiedDate: 1515782824875}];
                            var curr = [{id: 8251, eventDate: 1482382800000, status: {id: 1, name: 'Active'}, reason: null, lastModifiedUser: 9, lastModifiedDate: 1483056556838}, {id: 14470, eventDate: 1518100595716, status: {id: 1, name: 'Active'}, reason: 'They wanted it back', lastModifiedUser: 32, lastModifiedDate: 1518100640339}, {id: 14429, eventDate: 1516555888888, status: {id: 3, name: 'Withdrawn by Developer'}, reason: null, lastModifiedUser: 5, lastModifiedDate: 1515782824875}];

                            var activity = ctrl._compareCertificationEvents(prev, curr);
                            expect(activity[0]).toEqual('"Withdrawn by Developer" status changed effective date to Jan 21, 2018');
                        });

                        it('should recognize a changed status event', function () {
                            var prev = [{id: 8251, eventDate: 1482382800000, status: {id: 1, name: 'Active'}, reason: null, lastModifiedUser: 9, lastModifiedDate: 1483056556838}, {id: 14470, eventDate: 1518100595716, status: {id: 1, name: 'Active'}, reason: 'They wanted it back', lastModifiedUser: 32, lastModifiedDate: 1518100640339}, {id: 14429, eventDate: 1515782832087, status: {id: 3, name: 'Withdrawn by Developer'}, reason: null, lastModifiedUser: 5, lastModifiedDate: 1515782824875}];
                            var curr = [{id: 8251, eventDate: 1482382800000, status: {id: 1, name: 'Active'}, reason: null, lastModifiedUser: 9, lastModifiedDate: 1483056556838}, {id: 14470, eventDate: 1518100595716, status: {id: 1, name: 'Active'}, reason: 'They wanted it back', lastModifiedUser: 32, lastModifiedDate: 1518100640339}, {id: 14429, eventDate: 1515782832087, status: {id: 3, name: 'Withdrawn by ONC-ACB'}, reason: null, lastModifiedUser: 5, lastModifiedDate: 1515782824875}];

                            var activity = ctrl._compareCertificationEvents(prev, curr);
                            expect(activity[0]).toEqual('"Withdrawn by Developer" status became "Withdrawn by ONC-ACB" at Jan 12, 2018');
                        });

                        it('should recognize a removed event', function () {
                            var prev = [{id: 8251, eventDate: 1482382800000, status: {id: 1, name: 'Active'}, reason: null, lastModifiedUser: 9, lastModifiedDate: 1483056556838}, {id: 14470, eventDate: 1518100595716, status: {id: 1, name: 'Active'}, reason: 'They wanted it back', lastModifiedUser: 32, lastModifiedDate: 1518100640339}, {id: 14429, eventDate: 1515782832087, status: {id: 3, name: 'Withdrawn by Developer'}, reason: null, lastModifiedUser: 5, lastModifiedDate: 1515782824875}];
                            var curr = [{id: 8251, eventDate: 1482382800000, status: {id: 1, name: 'Active'}, reason: null, lastModifiedUser: 9, lastModifiedDate: 1483056556838}, {id: 14429, eventDate: 1515782832087, status: {id: 3, name: 'Withdrawn by Developer'}, reason: null, lastModifiedUser: 5, lastModifiedDate: 1515782824875}];

                            var activity = ctrl._compareCertificationEvents(prev, curr);
                            expect(activity[0]).toEqual('Removed "Active" status at Feb 8, 2018 with reason: "They wanted it back"');
                        });
                    });
                });
            });
        });
    });
})();
