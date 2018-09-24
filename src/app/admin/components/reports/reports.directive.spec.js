(function () {
    'use strict';

    describe('the Admin Reports', function () {

        var $compile, $log, $q, $uibModal, ActivityMock, Mock, actualOptions, authService, el, networkService, scope, vm;

        beforeEach(function () {
            angular.mock.module('chpl.mock', 'chpl.admin', function ($provide) {
                $provide.decorator('authService', function ($delegate) {
                    $delegate.isAcbAdmin = jasmine.createSpy('isAcbAdmin');
                    $delegate.isChplAdmin = jasmine.createSpy('isChplAdmin');
                    $delegate.isOncStaff = jasmine.createSpy('isOncStaff');
                    return $delegate;
                });

                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getCertifiedProductActivity = jasmine.createSpy('getCertifiedProductActivity');
                    $delegate.getCorrectiveActionPlanActivity = jasmine.createSpy('getCorrectiveActionPlanActivity');
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

            inject(function (_$compile_, $controller, _$log_, _$q_, $rootScope, _$uibModal_, _ActivityMock_, _Mock_, _authService_, _networkService_) {
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
                authService = _authService_;
                authService.isAcbAdmin.and.returnValue($q.when(true));
                authService.isChplAdmin.and.returnValue($q.when(true));
                authService.isOncStaff.and.returnValue($q.when(true));
                networkService = _networkService_;
                networkService.getCertifiedProductActivity.and.returnValue($q.when(Mock.listingActivity));
                networkService.getCorrectiveActionPlanActivity.and.returnValue($q.when([]));
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
                el = angular.element('<ai-reports></ai-reports');

                scope = $rootScope.$new()
                $compile(el)(scope);
                scope.$digest();
                vm = el.isolateScope().vm;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('directive', function () {
            it('should be compiled', function () {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', function () {
            it('should have loaded activity', function () {
                expect(vm.searchedCertifiedProducts).toBeDefined();
            });

            it('should set the start date to day 1 of chpl if on a single product', function () {
                var startDate = new Date('4/1/2016');
                el = angular.element('<ai-reports product-id="1"></ai-reports');

                $compile(el)(scope);
                scope.$digest();
                vm = el.isolateScope().vm;
                expect(vm.activityRange.listing.startDate).toEqual(startDate);
            });

            it('should know if the logged in user is ACB and/or CHPL admin', function () {
                expect(vm.isAcbAdmin).toBeTruthy();
                expect(vm.isChplAdmin).toBeTruthy();
            });

            describe('helper functions', function () {
                describe('for refreshing', function () {
                    beforeEach(function () {
                        spyOn(vm, 'singleCp');
                        spyOn(vm, 'refreshCp');
                        spyOn(vm, 'refreshCap');
                        spyOn(vm, 'refreshDeveloper');
                        spyOn(vm, 'refreshProduct');
                        spyOn(vm, 'refreshAcb');
                        spyOn(vm, 'refreshAtl');
                        spyOn(vm, 'refreshAnnouncement');
                        spyOn(vm, 'refreshUser');
                        spyOn(vm, 'refreshApi');
                        spyOn(vm, 'refreshApiKeyUsage');
                    });

                    it('should refresh everything sometimes', function () {
                        vm.refreshActivity(true);
                        expect(vm.singleCp).not.toHaveBeenCalled();
                        expect(vm.refreshCp).toHaveBeenCalled();
                        expect(vm.refreshCap).toHaveBeenCalled();
                        expect(vm.refreshDeveloper).toHaveBeenCalled();
                        expect(vm.refreshProduct).toHaveBeenCalled();
                        expect(vm.refreshAcb).toHaveBeenCalled();
                        expect(vm.refreshAtl).toHaveBeenCalled();
                        expect(vm.refreshAnnouncement).toHaveBeenCalled();
                        expect(vm.refreshUser).toHaveBeenCalled();
                        expect(vm.refreshApi).toHaveBeenCalled();
                        expect(vm.refreshApiKeyUsage).toHaveBeenCalled();
                    });

                    it('should refresh the single CP if on a single product', function () {
                        vm.productId = 1;
                        vm.refreshActivity(true);
                        expect(vm.singleCp).toHaveBeenCalled();
                        expect(vm.refreshCp).not.toHaveBeenCalled();
                        expect(vm.refreshCap).toHaveBeenCalled();
                        expect(vm.refreshDeveloper).toHaveBeenCalled();
                        expect(vm.refreshProduct).toHaveBeenCalled();
                        expect(vm.refreshAcb).toHaveBeenCalled();
                        expect(vm.refreshAtl).toHaveBeenCalled();
                        expect(vm.refreshAnnouncement).toHaveBeenCalled();
                        expect(vm.refreshUser).toHaveBeenCalled();
                        expect(vm.refreshApi).toHaveBeenCalled();
                        expect(vm.refreshApiKeyUsage).toHaveBeenCalled();
                    });

                    it('should refresh the CP data specifically', function () {
                        vm.workType = '';
                        vm.refreshActivity();
                        expect(vm.singleCp).not.toHaveBeenCalled();
                        expect(vm.refreshCp).toHaveBeenCalled();
                        expect(vm.refreshCap).not.toHaveBeenCalled();
                        expect(vm.refreshDeveloper).not.toHaveBeenCalled();
                        expect(vm.refreshProduct).not.toHaveBeenCalled();
                        expect(vm.refreshAcb).not.toHaveBeenCalled();
                        expect(vm.refreshAtl).not.toHaveBeenCalled();
                        expect(vm.refreshAnnouncement).not.toHaveBeenCalled();
                        expect(vm.refreshUser).not.toHaveBeenCalled();
                        expect(vm.refreshApi).not.toHaveBeenCalled();
                        expect(vm.refreshApiKeyUsage).not.toHaveBeenCalled();
                    });

                    it('should refresh the CP data specifically', function () {
                        vm.workType = '';
                        vm.productId = 1;
                        vm.refreshActivity();
                        expect(vm.singleCp).toHaveBeenCalled();
                        expect(vm.refreshCp).not.toHaveBeenCalled();
                        expect(vm.refreshCap).not.toHaveBeenCalled();
                        expect(vm.refreshDeveloper).not.toHaveBeenCalled();
                        expect(vm.refreshProduct).not.toHaveBeenCalled();
                        expect(vm.refreshAcb).not.toHaveBeenCalled();
                        expect(vm.refreshAtl).not.toHaveBeenCalled();
                        expect(vm.refreshAnnouncement).not.toHaveBeenCalled();
                        expect(vm.refreshUser).not.toHaveBeenCalled();
                        expect(vm.refreshApi).not.toHaveBeenCalled();
                        expect(vm.refreshApiKeyUsage).not.toHaveBeenCalled();
                    });

                    it('should refresh the cap data specifically', function () {
                        vm.workType = 'cap';
                        vm.refreshActivity();
                        expect(vm.singleCp).not.toHaveBeenCalled();
                        expect(vm.refreshCp).not.toHaveBeenCalled();
                        expect(vm.refreshCap).toHaveBeenCalled();
                        expect(vm.refreshDeveloper).not.toHaveBeenCalled();
                        expect(vm.refreshProduct).not.toHaveBeenCalled();
                        expect(vm.refreshAcb).not.toHaveBeenCalled();
                        expect(vm.refreshAtl).not.toHaveBeenCalled();
                        expect(vm.refreshAnnouncement).not.toHaveBeenCalled();
                        expect(vm.refreshUser).not.toHaveBeenCalled();
                        expect(vm.refreshApi).not.toHaveBeenCalled();
                        expect(vm.refreshApiKeyUsage).not.toHaveBeenCalled();
                    });

                    it('should refresh the dev data specifically', function () {
                        vm.workType = 'dev';
                        vm.refreshActivity();
                        expect(vm.singleCp).not.toHaveBeenCalled();
                        expect(vm.refreshCp).not.toHaveBeenCalled();
                        expect(vm.refreshCap).not.toHaveBeenCalled();
                        expect(vm.refreshDeveloper).toHaveBeenCalled();
                        expect(vm.refreshProduct).not.toHaveBeenCalled();
                        expect(vm.refreshAcb).not.toHaveBeenCalled();
                        expect(vm.refreshAtl).not.toHaveBeenCalled();
                        expect(vm.refreshAnnouncement).not.toHaveBeenCalled();
                        expect(vm.refreshUser).not.toHaveBeenCalled();
                        expect(vm.refreshApi).not.toHaveBeenCalled();
                        expect(vm.refreshApiKeyUsage).not.toHaveBeenCalled();
                    });

                    it('should refresh the product data specifically', function () {
                        vm.workType = 'prod';
                        vm.refreshActivity();
                        expect(vm.singleCp).not.toHaveBeenCalled();
                        expect(vm.refreshCp).not.toHaveBeenCalled();
                        expect(vm.refreshCap).not.toHaveBeenCalled();
                        expect(vm.refreshDeveloper).not.toHaveBeenCalled();
                        expect(vm.refreshProduct).toHaveBeenCalled();
                        expect(vm.refreshAcb).not.toHaveBeenCalled();
                        expect(vm.refreshAtl).not.toHaveBeenCalled();
                        expect(vm.refreshAnnouncement).not.toHaveBeenCalled();
                        expect(vm.refreshUser).not.toHaveBeenCalled();
                        expect(vm.refreshApi).not.toHaveBeenCalled();
                        expect(vm.refreshApiKeyUsage).not.toHaveBeenCalled();
                    });

                    it('should refresh the acb data specifically', function () {
                        vm.workType = 'acb';
                        vm.refreshActivity();
                        expect(vm.singleCp).not.toHaveBeenCalled();
                        expect(vm.refreshCp).not.toHaveBeenCalled();
                        expect(vm.refreshCap).not.toHaveBeenCalled();
                        expect(vm.refreshDeveloper).not.toHaveBeenCalled();
                        expect(vm.refreshProduct).not.toHaveBeenCalled();
                        expect(vm.refreshAcb).toHaveBeenCalled();
                        expect(vm.refreshAtl).not.toHaveBeenCalled();
                        expect(vm.refreshAnnouncement).not.toHaveBeenCalled();
                        expect(vm.refreshUser).not.toHaveBeenCalled();
                        expect(vm.refreshApi).not.toHaveBeenCalled();
                        expect(vm.refreshApiKeyUsage).not.toHaveBeenCalled();
                    });

                    it('should refresh the atl data specifically', function () {
                        vm.workType = 'atl';
                        vm.refreshActivity();
                        expect(vm.singleCp).not.toHaveBeenCalled();
                        expect(vm.refreshCp).not.toHaveBeenCalled();
                        expect(vm.refreshCap).not.toHaveBeenCalled();
                        expect(vm.refreshDeveloper).not.toHaveBeenCalled();
                        expect(vm.refreshProduct).not.toHaveBeenCalled();
                        expect(vm.refreshAcb).not.toHaveBeenCalled();
                        expect(vm.refreshAtl).toHaveBeenCalled();
                        expect(vm.refreshAnnouncement).not.toHaveBeenCalled();
                        expect(vm.refreshUser).not.toHaveBeenCalled();
                        expect(vm.refreshApi).not.toHaveBeenCalled();
                        expect(vm.refreshApiKeyUsage).not.toHaveBeenCalled();
                    });

                    it('should refresh the announcement data specifically', function () {
                        vm.workType = 'announcement';
                        vm.refreshActivity();
                        expect(vm.singleCp).not.toHaveBeenCalled();
                        expect(vm.refreshCp).not.toHaveBeenCalled();
                        expect(vm.refreshCap).not.toHaveBeenCalled();
                        expect(vm.refreshDeveloper).not.toHaveBeenCalled();
                        expect(vm.refreshProduct).not.toHaveBeenCalled();
                        expect(vm.refreshAcb).not.toHaveBeenCalled();
                        expect(vm.refreshAtl).not.toHaveBeenCalled();
                        expect(vm.refreshAnnouncement).toHaveBeenCalled();
                        expect(vm.refreshUser).not.toHaveBeenCalled();
                        expect(vm.refreshApi).not.toHaveBeenCalled();
                        expect(vm.refreshApiKeyUsage).not.toHaveBeenCalled();
                    });

                    it('should refresh the users data specifically', function () {
                        vm.workType = 'users';
                        vm.refreshActivity();
                        expect(vm.singleCp).not.toHaveBeenCalled();
                        expect(vm.refreshCp).not.toHaveBeenCalled();
                        expect(vm.refreshCap).not.toHaveBeenCalled();
                        expect(vm.refreshDeveloper).not.toHaveBeenCalled();
                        expect(vm.refreshProduct).not.toHaveBeenCalled();
                        expect(vm.refreshAcb).not.toHaveBeenCalled();
                        expect(vm.refreshAtl).not.toHaveBeenCalled();
                        expect(vm.refreshAnnouncement).not.toHaveBeenCalled();
                        expect(vm.refreshUser).toHaveBeenCalled();
                        expect(vm.refreshApi).not.toHaveBeenCalled();
                        expect(vm.refreshApiKeyUsage).not.toHaveBeenCalled();
                    });

                    it('should refresh the api key management data specifically', function () {
                        vm.workType = 'api_key_management';
                        vm.refreshActivity();
                        expect(vm.singleCp).not.toHaveBeenCalled();
                        expect(vm.refreshCp).not.toHaveBeenCalled();
                        expect(vm.refreshCap).not.toHaveBeenCalled();
                        expect(vm.refreshDeveloper).not.toHaveBeenCalled();
                        expect(vm.refreshProduct).not.toHaveBeenCalled();
                        expect(vm.refreshAcb).not.toHaveBeenCalled();
                        expect(vm.refreshAtl).not.toHaveBeenCalled();
                        expect(vm.refreshAnnouncement).not.toHaveBeenCalled();
                        expect(vm.refreshUser).not.toHaveBeenCalled();
                        expect(vm.refreshApi).toHaveBeenCalled();
                        expect(vm.refreshApiKeyUsage).not.toHaveBeenCalled();
                    });
                });

                it('should clear the API Key filter object', function () {
                    var aDate = new Date();
                    vm.activityRange.startDate = aDate;
                    vm.activityRange.endDate = aDate;
                    vm.apiKey = {
                        visiblePage: 34,
                        pageSize: 2,
                        startDate: new Date('1/1/2000'),
                        endDate: new Date('1/1/2000'),
                    };
                    vm.clearApiKeyFilter();
                    expect(vm.apiKey).toEqual({
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
                        expect(vm.modalInstance).toBeUndefined();
                        vm.compareSurveillances(oldS, newS);
                        expect(vm.modalInstance).toBeDefined();
                    });

                    it('should resolve elements', function () {
                        vm.compareSurveillances(oldS, newS);
                        expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                        expect(actualOptions.resolve.newSurveillance()).toEqual(newS);
                        expect(actualOptions.resolve.oldSurveillance()).toEqual(oldS);
                    });
                });

                describe('for date ranges', function () {
                    beforeEach(function () {
                        vm.activityRange = {
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
                        expect(vm.validDates).toBeDefined()
                    });

                    it('should allow dates with less than the range separation', function () {
                        expect(vm.validDates('key')).toBe(true);
                    });

                    it('should not allow dates separated by more than the range', function () {
                        vm.activityRange.range = 1;
                        expect(vm.validDates('key')).toBe(false);
                    });

                    it('should not allow dates where start is after end', function () {
                        vm.activityRange.key.startDate = new Date('3/15/2017');
                        expect(vm.validDates('key')).toBe(false);
                    });

                    it('should allow "all time" if on a single listing', function () {
                        vm.productId = 1;
                        expect(vm.validDates('listing')).toBe(true);
                    });

                    it('should not allow dates where start is after end on a single listing', function () {
                        vm.productId = 1;
                        vm.activityRange.listing.startDate = new Date('3/15/2017');
                        expect(vm.validDates('listing')).toBe(false);
                    });

                    it('should correctly validate dates crossing DST', function () {
                        vm.activityRange = {
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
                        expect(vm.validDates('badDst')).toBe(false);
                        expect(vm.validDates('notDst')).toBe(true);
                        expect(vm.validDates('badNotDst')).toBe(false);
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

                    vm._interpretCps([rawActivity]);
                    expect(vm.searchedCertifiedProducts[0]).toEqual(expectedActivity);
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
                        vm._interpretCps([rawActivity]);
                        expect(vm.searchedCertifiedProductsUpload[0]).toEqual(expectedActivity);
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
                        vm._interpretCps([rawActivity]);
                        expect(vm.searchedCertifiedProductsStatus[0]).toEqual(expectedActivity);
                    });

                    it('should interpret basic field changes', function () {
                        rawActivity.newData.productAdditionalSoftware = 'Some new software';
                        expectedActivity.details = ['Product-wide Relied Upon Software added: Some new software'];
                        expectedActivity.csvDetails = 'Product-wide Relied Upon Software added: Some new software';
                        vm._interpretCps([rawActivity]);
                        expect(vm.searchedCertifiedProducts[0]).toEqual(expectedActivity);
                    });

                    it('should interpret nested field changes', function () {
                        rawActivity.originalData.certifyingBody.name = 'ICSA Labs';
                        expectedActivity.details = ['Certifying Body changed from ICSA Labs to CCHIT'];
                        expectedActivity.csvDetails = 'Certifying Body changed from ICSA Labs to CCHIT';
                        vm._interpretCps([rawActivity]);
                        expect(vm.searchedCertifiedProducts[0]).toEqual(expectedActivity);
                    });

                    it('should handle accessibility standards', function () {
                        rawActivity.originalData.accessibilityStandards = [{accessibilityStandardName: 'a standard'}];
                        expectedActivity.details = ['Accessibility Standard "a standard" changes<ul><li>a standard removed</li></ul>'];
                        expectedActivity.csvDetails = 'Accessibility Standard "a standard" changes<ul><li>a standard removed</li></ul>';
                        vm._interpretCps([rawActivity]);
                        expect(vm.searchedCertifiedProducts[0]).toEqual(expectedActivity);
                    });

                    it('should handle criteria addition', function () {
                        rawActivity.originalData.certificationResults[0].success = false;
                        expectedActivity.details = ['Certification "170.302 (a)" changes<ul><li>Successful added: true</li></ul>'];
                        expectedActivity.csvDetails = 'Certification "170.302 (a)" changes<ul><li>Successful added: true</li></ul>';
                        vm._interpretCps([rawActivity]);
                        expect(vm.searchedCertifiedProducts[0]).toEqual(expectedActivity);
                    });

                    it('should handle cqm addition', function () {
                        rawActivity.originalData.cqmResults[0].success = false;
                        expectedActivity.details = ['CQM "null" changes<ul><li>Success added: true</li></ul>'];
                        expectedActivity.csvDetails = 'CQM "null" changes<ul><li>Success added: true</li></ul>';
                        vm._interpretCps([rawActivity]);
                        expect(vm.searchedCertifiedProducts[0]).toEqual(expectedActivity);
                    });

                    it('should handle qms standards', function () {
                        rawActivity.originalData.qmsStandards = [{qmsStandardName: 'a standard', qmsModification: 'a mod', applicableCriteria: 'none'}];
                        rawActivity.newData.qmsStandards = [{qmsStandardName: 'a standard', qmsModification: 'no mods', applicableCriteria: 'all'}];
                        expectedActivity.details = ['QMS Standard "a standard" changes<ul><li>QMS Modification changed from a mod to no mods</li><li>Applicable Criteria changed from none to all</li></ul>'];
                        expectedActivity.csvDetails = 'QMS Standard "a standard" changes<ul><li>QMS Modification changed from a mod to no mods</li><li>Applicable Criteria changed from none to all</li></ul>';
                        vm._interpretCps([rawActivity]);
                        expect(vm.searchedCertifiedProducts[0]).toEqual(expectedActivity);
                    });

                    it('should handle targeted users', function () {
                        rawActivity.originalData.targetedUsers = [{targetedUserName: 'name 1'}];
                        rawActivity.newData.targetedUsers = [{targetedUserName: 'name 2'}];
                        expectedActivity.details = ['Targeted User "name 1" changes<ul><li>name 1 removed</li></ul>','Targeted User "name 2" changes<ul><li>name 2 added</li></ul>'];
                        expectedActivity.csvDetails = 'Targeted User "name 1" changes<ul><li>name 1 removed</li></ul>\nTargeted User "name 2" changes<ul><li>name 2 added</li></ul>';
                        vm._interpretCps([rawActivity]);
                        expect(vm.searchedCertifiedProducts[0]).toEqual(expectedActivity);
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

                        vm._interpretCps([rawActivity]);
                        expect(vm.searchedCertifiedProducts[0]).toEqual(expectedActivity);
                    });

                    it('should recognize added/removed ICS Children', function () {
                        rawActivity.originalData.ics.children = [{chplProductNumber: 'ID2',certificationDate: 1490194030517,certifiedProductId: 2},{chplProductNumber: 'ID3',certificationDate: 1490194030517,certifiedProductId: 3}];
                        rawActivity.newData.ics.children =[{chplProductNumber: 'ID',certificationDate: 1490194030517,certifiedProductId: 1},{chplProductNumber: 'ID2',certificationDate: 1490194030517,certifiedProductId: 2}];
                        expectedActivity.details = ['ICS Child "ID3" changes<ul><li>ID3 removed</li></ul>', 'ICS Child "ID" changes<ul><li>ID added</li></ul>'];
                        expectedActivity.csvDetails = 'ICS Child "ID3" changes<ul><li>ID3 removed</li></ul>\nICS Child "ID" changes<ul><li>ID added</li></ul>';

                        vm._interpretCps([rawActivity]);
                        expect(vm.searchedCertifiedProducts[0]).toEqual(expectedActivity);
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
                        vm._interpretCps([rawActivity]);
                        expect(vm.searchedCertifiedProductsSurveillance[0]).toEqual(expectedActivity);
                    });

                    it('upload should be recognized', function () {
                        rawActivity.description = 'Surveillance upload';
                        expectedActivity.action = 'Surveillance was uploaded for CHPL Product <a href="#/product/1480">CHP-009351</a>';
                        vm._interpretCps([rawActivity]);
                        expect(vm.searchedCertifiedProductsSurveillance[0]).toEqual(expectedActivity);
                    });

                    it('addition shouls be recognized', function () {
                        rawActivity.description = 'Surveillance was added';
                        expectedActivity.action = 'Surveillance was added for CHPL Product <a href="#/product/1480">CHP-009351</a>';
                        vm._interpretCps([rawActivity]);
                        expect(vm.searchedCertifiedProductsSurveillance[0]).toEqual(expectedActivity);
                    });

                    it('strangeness should be handled', function () {
                        rawActivity.description = 'Surveillance was changed in a weird way';
                        expectedActivity.action = 'Surveillance was changed in a weird way<br /><a href="#/product/1480">CHP-009351</a>';
                        vm._interpretCps([rawActivity]);
                        expect(vm.searchedCertifiedProductsSurveillance[0]).toEqual(expectedActivity);
                    });

                    it('documentation upload should be reported', function () {
                        rawActivity.description = 'Documentation';
                        expectedActivity.action = 'Documentation was added to a nonconformity for <a href="#/product/1480">CHP-009351</a>';
                        vm._interpretCps([rawActivity]);
                        expect(vm.searchedCertifiedProductsSurveillance[0]).toEqual(expectedActivity);

                    });

                    it('documentation removal should be reported', function () {
                        rawActivity.description = 'A document was removed';
                        expectedActivity.action = 'Documentation was removed from a nonconformity for <a href="#/product/1480">CHP-009351</a>';
                        vm._interpretCps([rawActivity]);
                        expect(vm.searchedCertifiedProductsSurveillance[0]).toEqual(expectedActivity);
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
                            vm._interpretCps([rawActivity]);
                            expect(vm.searchedCertifiedProductsSurveillance[0]).toEqual(expectedActivity);
                        });

                        it('should parse some simple fields', function () {
                            rawActivity.originalData.surveillance[0].randomizedSitesUsed = 4;
                            rawActivity.newData.surveillance[0].randomizedSitesUsed = 6;
                            expectedActivity.details = ['SURV01<ul><li>Number of sites surveilled changed from 4 to 6</li></ul>']
                            vm._interpretCps([rawActivity]);
                            expect(vm.searchedCertifiedProductsSurveillance[0]).toEqual(expectedActivity);
                        });

                        it('should parse nested fields', function () {
                            rawActivity.originalData.surveillance[0].type = { name: 'randomized' };
                            rawActivity.newData.surveillance[0].type = { name: 'reactive' };
                            expectedActivity.details = ['SURV01<ul><li>Certification Type changed from randomized to reactive</li></ul>']
                            vm._interpretCps([rawActivity]);
                            expect(vm.searchedCertifiedProductsSurveillance[0]).toEqual(expectedActivity);
                        });
                    });
                });

                describe('SED', function () {
                    describe('UCD Processes', function () {
                        it('should recognize changed details', function () {
                            var activity;
                            activity = vm._compareSed(ActivityMock.sed[0].originalData, ActivityMock.sed[0].newData);
                            expect(activity[0]).toEqual('<li>UCD Process Name "A process" changes<ul><li>UCD Process Details changed from some details to Changed details</li></ul></li>');
                        });

                        it('should recognize removed processes', function () {
                            var activity;
                            activity = vm._compareSed(ActivityMock.sed[0].originalData, ActivityMock.sed[0].newData);
                            expect(activity[1]).toEqual('<li>UCD Process Name "A second" changes<ul><li>A second removed</li></ul></li>');
                        });

                        it('should recognize changed criteria', function () {
                            var activity;
                            activity = vm._compareSed(ActivityMock.sed[0].originalData, ActivityMock.sed[0].newData);
                            expect(activity[2]).toEqual('<li>UCD Process Name "Fourth" changes<ul><li>Added Certification Criteria:<ul><li>170.315 (a)(2)</li></ul></li><li>Removed Certification Criteria:<ul><li>170.315 (a)(1)</li></ul></li></ul></li>');
                        });

                        it('should recognize added processes', function () {
                            var activity;
                            activity = vm._compareSed(ActivityMock.sed[0].originalData, ActivityMock.sed[0].newData);
                            expect(activity[3]).toEqual('<li>UCD Process Name "A third" changes<ul><li>A third added</li></ul></li>');
                        });
                    });

                    describe('Tasks', function () {
                        it('should recognize changed elements', function () {
                            var activity;
                            activity = vm._compareSed(ActivityMock.sed[1].originalData, ActivityMock.sed[1].newData);
                            expect(activity[0]).toEqual('<li>Task Description "A description that changed" changes<ul><li>Description changed from A description that changes to A description that changed</li></ul></li>');
                        });

                        it('should recognize removed tasks', function () {
                            var activity;
                            activity = vm._compareSed(ActivityMock.sed[1].originalData, ActivityMock.sed[1].newData);
                            expect(activity[1]).toEqual('<li>Task Description "A removed task" changes<ul><li>A removed task removed</li></ul></li>');
                        });

                        it('should recognize added participants', function () {
                            var activity;
                            activity = vm._compareSed(ActivityMock.sed[1].originalData, ActivityMock.sed[1].newData);
                            expect(activity[2]).toEqual('<li>Task Description "Added participant" changes<ul><li>Added 1 Test Participant</li></ul></li>');
                        });

                        it('should recognize removed participants', function () {
                            var activity;
                            activity = vm._compareSed(ActivityMock.sed[1].originalData, ActivityMock.sed[1].newData);
                            expect(activity[3]).toEqual('<li>Task Description "Removed participant" changes<ul><li>Removed 1 Test Participant</li></ul></li>');
                        });

                        it('should recognize adding criteria', function () {
                            var activity;
                            activity = vm._compareSed(ActivityMock.sed[1].originalData, ActivityMock.sed[1].newData);
                            expect(activity[4]).toEqual('<li>Task Description "Adding criteria" changes<ul><li>Added Certification Criteria:<ul><li>number</li></ul></li></ul></li>');
                        });

                        it('should recognize removed criteria', function () {
                            var activity;
                            activity = vm._compareSed(ActivityMock.sed[1].originalData, ActivityMock.sed[1].newData);
                            expect(activity[5]).toEqual('<li>Task Description "Removing criteria" changes<ul><li>Removed Certification Criteria:<ul><li>number</li></ul></li></ul></li>');
                        });

                        it('should recognize added tasks', function () {
                            var activity;
                            activity = vm._compareSed(ActivityMock.sed[1].originalData, ActivityMock.sed[1].newData);
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
                            vm._compareSed(prev, curr);
                            expect(prev.allParticipants.length).toBe(3);
                            expect(curr.allParticipants.length).toBe(3);
                        });

                        it('should recognize changed age', function () {
                            activity = vm._compareSed(prev, curr);
                            expect(activity[2]).toEqual('<li>Participant changes<ul><li>Age Range changed from 1-9 to 100+</li></ul></li>');
                        });

                        it('should recognize changed gender', function () {
                            activity = vm._compareSed(prev, curr);
                            expect(activity[3]).toEqual('<li>Participant changes<ul><li>Gender changed from Male to Female</li></ul></li>');
                        });
                    });
                });

                describe('certification event history', function () {
                    describe('in the old style', function () {
                        it('should recognize when nothing changed', function () {
                            var prev = [{id: 8251, eventDate: 1482364800000, certificationStatusId: 1, certificationStatusName: 'Active', lastModifiedUser: 9, lastModifiedDate: 1483038556838}];
                            var curr = [{id: 8251, eventDate: 1482364800000, certificationStatusId: 1, certificationStatusName: 'Active', lastModifiedUser: 9, lastModifiedDate: 1483038556838}];

                            var activity = vm._compareCertificationEvents(prev, curr);
                            expect(activity).toEqual([]);
                        });

                        it('should recognize an added event', function () {
                            var prev = [{id: 8251, eventDate: 1482364800000, certificationStatusId: 1, certificationStatusName: 'Active', lastModifiedUser: 9, lastModifiedDate: 1483038556838}];
                            var curr = [{id: 8251, eventDate: 1482364800000, certificationStatusId: 1, certificationStatusName: 'Active', lastModifiedUser: 9, lastModifiedDate: 1483038556838}, {id: 14429, eventDate: 1515764832087, certificationStatusId: 3, certificationStatusName: 'Withdrawn by Developer', lastModifiedUser: 5, lastModifiedDate: 1515764824875}];

                            var activity = vm._compareCertificationEvents(prev, curr);
                            expect(activity[0]).toEqual('Added "Withdrawn by Developer" status at Jan 12, 2018');
                        });

                        it('should recognize when a date changed', function () {
                            var prev = [{id: 8251, eventDate: 1482364800000, certificationStatusId: 1, certificationStatusName: 'Active', lastModifiedUser: 9, lastModifiedDate: 1483038556838}];
                            var curr = [{id: 8251, eventDate: 1515764832087, certificationStatusId: 1, certificationStatusName: 'Active', lastModifiedUser: 9, lastModifiedDate: 1483038556838}];

                            var activity = vm._compareCertificationEvents(prev, curr);
                            expect(activity[0]).toEqual('"Active" status changed effective date to Jan 12, 2018');
                        });

                        it('should recognize a changed status event', function () {
                            var prev = [{id: 8251, eventDate: 1482364800000, certificationStatusId: 1, certificationStatusName: 'Active', lastModifiedUser: 9, lastModifiedDate: 1483038556838}, {id: 14429, eventDate: 1515764832087, certificationStatusId: 3, certificationStatusName: 'Withdrawn by Developer', lastModifiedUser: 5, lastModifiedDate: 1515764824875}];
                            var curr = [{id: 8251, eventDate: 1482364800000, certificationStatusId: 1, certificationStatusName: 'Active', lastModifiedUser: 9, lastModifiedDate: 1483038556838}, {id: 14430, eventDate: 1515764832087, certificationStatusId: 3, certificationStatusName: 'Withdrawn by ONC-ACB', lastModifiedUser: 5, lastModifiedDate: 1515764824875}];

                            var activity = vm._compareCertificationEvents(prev, curr);
                            expect(activity[0]).toEqual('"Withdrawn by Developer" status became "Withdrawn by ONC-ACB" at Jan 12, 2018');
                        });
                    });

                    describe('in the new style', function () {
                        it('should recognize when nothing changed', function () {
                            var prev = [{id: 8251, eventDate: 1482382800000, status: {id: 1, name: 'Active'}, reason: null, lastModifiedUser: 9, lastModifiedDate: 1483056556838}, {id: 14470, eventDate: 1518100595716, status: {id: 1, name: 'Active'}, reason: 'They wanted it back', lastModifiedUser: 32, lastModifiedDate: 1518100640339}, {id: 14429, eventDate: 1515782832087, status: {id: 3, name: 'Withdrawn by Developer'}, reason: null, lastModifiedUser: 5, lastModifiedDate: 1515782824875}];
                            var curr = [{id: 8251, eventDate: 1482382800000, status: {id: 1, name: 'Active'}, reason: null, lastModifiedUser: 9, lastModifiedDate: 1483056556838}, {id: 14470, eventDate: 1518100595716, status: {id: 1, name: 'Active'}, reason: 'They wanted it back', lastModifiedUser: 32, lastModifiedDate: 1518100640339}, {id: 14429, eventDate: 1515782832087, status: {id: 3, name: 'Withdrawn by Developer'}, reason: null, lastModifiedUser: 5, lastModifiedDate: 1515782824875}];

                            var activity = vm._compareCertificationEvents(prev, curr);
                            expect(activity).toEqual([]);
                        });

                        it('should recognize an added event', function () {
                            var prev = [{id: 8251, eventDate: 1482382800000, status: {id: 1, name: 'Active'}, reason: null, lastModifiedUser: 9, lastModifiedDate: 1483056556838}, {id: 14429, eventDate: 1515782832087, status: {id: 3, name: 'Withdrawn by Developer'}, reason: null, lastModifiedUser: 5, lastModifiedDate: 1515782824875}];
                            var curr = [{id: 8251, eventDate: 1482382800000, status: {id: 1, name: 'Active'}, reason: null, lastModifiedUser: 9, lastModifiedDate: 1483056556838}, {id: 14470, eventDate: 1518100595716, status: {id: 1, name: 'Active'}, reason: 'They wanted it back', lastModifiedUser: 32, lastModifiedDate: 1518100640339}, {id: 14429, eventDate: 1515782832087, status: {id: 3, name: 'Withdrawn by Developer'}, reason: null, lastModifiedUser: 5, lastModifiedDate: 1515782824875}];

                            var activity = vm._compareCertificationEvents(prev, curr);
                            expect(activity[0]).toEqual('Added "Active" status at Feb 8, 2018 with reason: "They wanted it back"');
                        });

                        it('should recognize when a date changed', function () {
                            var prev = [{id: 8251, eventDate: 1482382800000, status: {id: 1, name: 'Active'}, reason: null, lastModifiedUser: 9, lastModifiedDate: 1483056556838}, {id: 14470, eventDate: 1518100595716, status: {id: 1, name: 'Active'}, reason: 'They wanted it back', lastModifiedUser: 32, lastModifiedDate: 1518100640339}, {id: 14429, eventDate: 1515782832087, status: {id: 3, name: 'Withdrawn by Developer'}, reason: null, lastModifiedUser: 5, lastModifiedDate: 1515782824875}];
                            var curr = [{id: 8251, eventDate: 1482382800000, status: {id: 1, name: 'Active'}, reason: null, lastModifiedUser: 9, lastModifiedDate: 1483056556838}, {id: 14470, eventDate: 1518100595716, status: {id: 1, name: 'Active'}, reason: 'They wanted it back', lastModifiedUser: 32, lastModifiedDate: 1518100640339}, {id: 14429, eventDate: 1516555888888, status: {id: 3, name: 'Withdrawn by Developer'}, reason: null, lastModifiedUser: 5, lastModifiedDate: 1515782824875}];

                            var activity = vm._compareCertificationEvents(prev, curr);
                            expect(activity[0]).toEqual('"Withdrawn by Developer" status changed effective date to Jan 21, 2018');
                        });

                        it('should recognize a changed status event', function () {
                            var prev = [{id: 8251, eventDate: 1482382800000, status: {id: 1, name: 'Active'}, reason: null, lastModifiedUser: 9, lastModifiedDate: 1483056556838}, {id: 14470, eventDate: 1518100595716, status: {id: 1, name: 'Active'}, reason: 'They wanted it back', lastModifiedUser: 32, lastModifiedDate: 1518100640339}, {id: 14429, eventDate: 1515782832087, status: {id: 3, name: 'Withdrawn by Developer'}, reason: null, lastModifiedUser: 5, lastModifiedDate: 1515782824875}];
                            var curr = [{id: 8251, eventDate: 1482382800000, status: {id: 1, name: 'Active'}, reason: null, lastModifiedUser: 9, lastModifiedDate: 1483056556838}, {id: 14470, eventDate: 1518100595716, status: {id: 1, name: 'Active'}, reason: 'They wanted it back', lastModifiedUser: 32, lastModifiedDate: 1518100640339}, {id: 14429, eventDate: 1515782832087, status: {id: 3, name: 'Withdrawn by ONC-ACB'}, reason: null, lastModifiedUser: 5, lastModifiedDate: 1515782824875}];

                            var activity = vm._compareCertificationEvents(prev, curr);
                            expect(activity[0]).toEqual('"Withdrawn by Developer" status became "Withdrawn by ONC-ACB" at Jan 12, 2018');
                        });

                        it('should recognize a removed event', function () {
                            var prev = [{id: 8251, eventDate: 1482382800000, status: {id: 1, name: 'Active'}, reason: null, lastModifiedUser: 9, lastModifiedDate: 1483056556838}, {id: 14470, eventDate: 1518100595716, status: {id: 1, name: 'Active'}, reason: 'They wanted it back', lastModifiedUser: 32, lastModifiedDate: 1518100640339}, {id: 14429, eventDate: 1515782832087, status: {id: 3, name: 'Withdrawn by Developer'}, reason: null, lastModifiedUser: 5, lastModifiedDate: 1515782824875}];
                            var curr = [{id: 8251, eventDate: 1482382800000, status: {id: 1, name: 'Active'}, reason: null, lastModifiedUser: 9, lastModifiedDate: 1483056556838}, {id: 14429, eventDate: 1515782832087, status: {id: 3, name: 'Withdrawn by Developer'}, reason: null, lastModifiedUser: 5, lastModifiedDate: 1515782824875}];

                            var activity = vm._compareCertificationEvents(prev, curr);
                            expect(activity[0]).toEqual('Removed "Active" status at Feb 8, 2018 with reason: "They wanted it back"');
                        });
                    });
                });
            });
        });
    });
})();
