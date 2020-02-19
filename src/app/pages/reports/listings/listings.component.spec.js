(() => {
    'use strict';

    xdescribe('the Reports.Listing component', () => {

        var $compile, $log, $q, $uibModal, ActivityMock, Mock, actualOptions, ctrl, el, networkService, scope;

        beforeEach(() => {
            angular.mock.module('chpl.mock', 'chpl.reports', $provide => {
                $provide.factory('chplFilterDirective', () => ({}));
                $provide.decorator('networkService', $delegate => {
                    $delegate.getActivityMetadata = jasmine.createSpy('getActivityMetadata');
                    $delegate.getActivityById = jasmine.createSpy('getActivityById');
                    $delegate.getSingleListingActivityMetadata = jasmine.createSpy('getSingleListingActivityMetadata');
                    return $delegate;
                });
            });

            inject((_$compile_, $controller, _$log_, _$q_, $rootScope, _$uibModal_, _ActivityMock_, _Mock_, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                ActivityMock = _ActivityMock_;
                Mock = _Mock_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(options => {
                    actualOptions = options;
                    return Mock.fakeModal;
                });
                networkService = _networkService_;
                networkService.getActivityMetadata.and.returnValue($q.when({activities: Mock.listingActivityMetadata}));
                networkService.getActivityById.and.returnValue($q.when(Mock.listingActivity));
                networkService.getSingleListingActivityMetadata.and.returnValue($q.when([]));

                scope = $rootScope.$new()

                el = angular.element('<chpl-reports-listings></chpl-reports-listings>');

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
            describe('helper functions', () => {
                describe('for comparing surveillances', () => {
                    var modalOptions, newS, oldS;
                    beforeEach(() => {
                        modalOptions = {
                            component: 'chplCompareSurveillances',
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

                    it('should resolve elements', () => {
                        ctrl.compareSurveillances(oldS, newS);
                        expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                        expect(actualOptions.resolve.newSurveillance()).toEqual(newS);
                        expect(actualOptions.resolve.oldSurveillance()).toEqual(oldS);
                    });
                });
            });

            describe('when parsing', () => {
                it('unknown descriptions should report directly', () => {
                    var expectedActivity, rawActivity;
                    rawActivity = angular.copy(Mock.listingActivity[1]);
                    rawActivity.description = 'Something odd with a Listing';

                    expectedActivity = angular.copy(rawActivity);
                    expectedActivity.action = 'Something odd with a Listing';
                    expectedActivity.details = [];
                    expectedActivity.csvDetails = '';

                    networkService.getActivityById.and.returnValue($q.when(rawActivity));

                    ctrl.parse(rawActivity);
                    scope.$digest();
                    expect(rawActivity).toEqual(expectedActivity);
                });

                describe('newly created Listings', () => {
                    var expectedActivity, rawActivity;

                    beforeEach(() => {
                        rawActivity = angular.copy(Mock.listingActivity[1]);
                    });

                    it('should create an upload activity', () => {
                        expectedActivity = {
                            action: 'Created a certified product',
                            details: [],
                            csvDetails: '',
                            ...rawActivity,
                        }
                        networkService.getActivityById.and.returnValue($q.when(rawActivity));
                        ctrl.parse(rawActivity);
                        scope.$digest();
                        expect(rawActivity).toEqual(expectedActivity);
                    });
                });

                describe('updated Listings', () => {
                    var expectedActivity, rawActivity;

                    beforeEach(() => {
                        rawActivity = angular.copy(Mock.listingActivity[0]);
                    });

                    it('should interpret status changes', () => {
                        rawActivity.newData.certificationStatus = {
                            name: 'Active',
                            id: 1,
                        };
                        networkService.getActivityById.and.returnValue($q.when(rawActivity));
                        expectedActivity = {
                            action: 'Updated a certified product',
                            details: ['Certification Status changed from Retired to Active'],
                            csvDetails: 'Certification Status changed from Retired to Active',
                            ...rawActivity,
                        }
                        ctrl.parse(rawActivity);
                        scope.$digest();
                        expect(rawActivity).toEqual(expectedActivity);
                    });

                    it('should interpret basic field changes', () => {
                        rawActivity.newData.productAdditionalSoftware = 'Some new software';
                        networkService.getActivityById.and.returnValue($q.when(rawActivity));
                        expectedActivity = {
                            action: 'Updated a certified product',
                            details: ['Product-wide Relied Upon Software added: Some new software'],
                            csvDetails: 'Product-wide Relied Upon Software added: Some new software',
                            ...rawActivity,
                        }
                        ctrl.parse(rawActivity);
                        scope.$digest();
                        expect(rawActivity).toEqual(expectedActivity);
                    });

                    it('should interpret nested field changes', () => {
                        rawActivity.originalData.certifyingBody.name = 'ICSA Labs';
                        networkService.getActivityById.and.returnValue($q.when(rawActivity));
                        expectedActivity = {
                            action: 'Updated a certified product',
                            details: ['Certifying Body changed from ICSA Labs to CCHIT'],
                            csvDetails: 'Certifying Body changed from ICSA Labs to CCHIT',
                            ...rawActivity,
                        }
                        ctrl.parse(rawActivity);
                        scope.$digest();
                        expect(rawActivity).toEqual(expectedActivity);
                    });

                    it('should handle accessibility standards', () => {
                        rawActivity.originalData.accessibilityStandards = [{accessibilityStandardName: 'a standard'}];
                        networkService.getActivityById.and.returnValue($q.when(rawActivity));
                        expectedActivity = {
                            action: 'Updated a certified product',
                            details: ['Accessibility Standard "a standard" changes<ul><li>a standard removed</li></ul>'],
                            csvDetails: 'Accessibility Standard "a standard" changes<ul><li>a standard removed</li></ul>',
                            ...rawActivity,
                        }
                        ctrl.parse(rawActivity);
                        scope.$digest();
                        expect(rawActivity).toEqual(expectedActivity);
                    });

                    it('should handle criteria addition', () => {
                        rawActivity.originalData.certificationResults[0].success = false;
                        networkService.getActivityById.and.returnValue($q.when(rawActivity));
                        expectedActivity = {
                            action: 'Updated a certified product',
                            details: ['Certification "170.302 (a)" changes<ul><li>Successful added: true</li></ul>'],
                            csvDetails: 'Certification "170.302 (a)" changes<ul><li>Successful added: true</li></ul>',
                            ...rawActivity,
                        }
                        ctrl.parse(rawActivity);
                        scope.$digest();
                        expect(rawActivity).toEqual(expectedActivity);
                    });

                    it('should handle cqm addition', () => {
                        rawActivity.originalData.cqmResults[0].success = false;
                        networkService.getActivityById.and.returnValue($q.when(rawActivity));
                        expectedActivity = {
                            action: 'Updated a certified product',
                            details: ['CQM "null" changes<ul><li>Success added: true</li></ul>'],
                            csvDetails: 'CQM "null" changes<ul><li>Success added: true</li></ul>',
                            ...rawActivity,
                        }
                        ctrl.parse(rawActivity);
                        scope.$digest();
                        expect(rawActivity).toEqual(expectedActivity);
                    });
                });

                describe('ICS family activity', () => {
                    var expectedActivity, rawActivity;

                    beforeEach(() => {
                        rawActivity = angular.copy(Mock.listingActivity[0]);
                    });

                    it('should recognize added/removed ICS Parents', () => {
                        rawActivity.originalData.ics.parents =[{chplProductNumber: 'ID',certificationDate: 1490194030517,certifiedProductId: 1},{chplProductNumber: 'ID2',certificationDate: 1490194030517,certifiedProductId: 2}];
                        rawActivity.newData.ics.parents = [{chplProductNumber: 'ID2',certificationDate: 1490194030517,certifiedProductId: 2},{chplProductNumber: 'ID3',certificationDate: 1490194030517,certifiedProductId: 3}];
                        networkService.getActivityById.and.returnValue($q.when(rawActivity));
                        expectedActivity = {
                            action: 'Updated a certified product',
                            details: ['ICS Parent "ID" changes<ul><li>ID removed</li></ul>', 'ICS Parent "ID3" changes<ul><li>ID3 added</li></ul>'],
                            csvDetails: 'ICS Parent "ID" changes<ul><li>ID removed</li></ul>\nICS Parent "ID3" changes<ul><li>ID3 added</li></ul>',
                            ...rawActivity,
                        }
                        ctrl.parse(rawActivity);
                        scope.$digest();
                        expect(rawActivity).toEqual(expectedActivity);
                    });

                    it('should recognize added/removed ICS Children', () => {
                        rawActivity.originalData.ics.children = [{chplProductNumber: 'ID2',certificationDate: 1490194030517,certifiedProductId: 2},{chplProductNumber: 'ID3',certificationDate: 1490194030517,certifiedProductId: 3}];
                        rawActivity.newData.ics.children =[{chplProductNumber: 'ID',certificationDate: 1490194030517,certifiedProductId: 1},{chplProductNumber: 'ID2',certificationDate: 1490194030517,certifiedProductId: 2}];
                        networkService.getActivityById.and.returnValue($q.when(rawActivity));
                        expectedActivity = {
                            action: 'Updated a certified product',
                            details: ['ICS Child "ID3" changes<ul><li>ID3 removed</li></ul>', 'ICS Child "ID" changes<ul><li>ID added</li></ul>'],
                            csvDetails: 'ICS Child "ID3" changes<ul><li>ID3 removed</li></ul>\nICS Child "ID" changes<ul><li>ID added</li></ul>',
                            ...rawActivity,
                        }
                        ctrl.parse(rawActivity);
                        scope.$digest();
                        expect(rawActivity).toEqual(expectedActivity);
                    });
                });

                describe('Surveillance', () => {
                    var expectedActivity, rawActivity;

                    beforeEach(() => {
                        rawActivity = angular.copy(Mock.listingActivity[0]);
                    });

                    it('deletion should be recognized', () => {
                        rawActivity.description = 'Surveillance was deleted from CHP-1231';
                        networkService.getActivityById.and.returnValue($q.when(rawActivity));
                        expectedActivity = {
                            action: 'Surveillance was deleted',
                            details: [],
                            csvDetails: '',
                            ...rawActivity,
                        }
                        ctrl.parse(rawActivity);
                        scope.$digest();
                        expect(rawActivity).toEqual(expectedActivity);
                    });

                    it('upload should be recognized', () => {
                        rawActivity.description = 'Surveillance upload';
                        networkService.getActivityById.and.returnValue($q.when(rawActivity));
                        expectedActivity = {
                            action: 'Surveillance was uploaded',
                            details: [],
                            csvDetails: '',
                            ...rawActivity,
                        }
                        ctrl.parse(rawActivity);
                        scope.$digest();
                        expect(rawActivity).toEqual(expectedActivity);
                    });

                    it('addition shouls be recognized', () => {
                        rawActivity.description = 'Surveillance was added';
                        networkService.getActivityById.and.returnValue($q.when(rawActivity));
                        expectedActivity = {
                            action: 'Surveillance was added',
                            details: [],
                            csvDetails: '',
                            ...rawActivity,
                        }
                        ctrl.parse(rawActivity);
                        scope.$digest();
                        expect(rawActivity).toEqual(expectedActivity);
                    });

                    it('strangeness should be handled', () => {
                        rawActivity.description = 'Surveillance was changed in a weird way';
                        networkService.getActivityById.and.returnValue($q.when(rawActivity));
                        expectedActivity = {
                            action: 'Surveillance was changed in a weird way<br />undefined',
                            details: [],
                            csvDetails: '',
                            ...rawActivity,
                        }
                        ctrl.parse(rawActivity);
                        scope.$digest();
                        expect(rawActivity).toEqual(expectedActivity);
                    });

                    it('documentation upload should be reported', () => {
                        rawActivity.description = 'Documentation';
                        networkService.getActivityById.and.returnValue($q.when(rawActivity));
                        expectedActivity = {
                            action: 'Documentation was added to a nonconformity',
                            details: [],
                            csvDetails: '',
                            ...rawActivity,
                        }
                        ctrl.parse(rawActivity);
                        scope.$digest();
                        expect(rawActivity).toEqual(expectedActivity);
                    });

                    it('documentation removal should be reported', () => {
                        rawActivity.description = 'A document was removed';
                        networkService.getActivityById.and.returnValue($q.when(rawActivity));
                        expectedActivity = {
                            action: 'Documentation was removed from a nonconformity',
                            details: [],
                            csvDetails: '',
                            ...rawActivity,
                        }
                        ctrl.parse(rawActivity);
                        scope.$digest();
                        expect(rawActivity).toEqual(expectedActivity);
                    });

                    describe('update', () => {
                        beforeEach(() => {
                            rawActivity.description = 'Surveillance was updated';
                            rawActivity.originalData.surveillance = [{friendlyId: 'SURV01'}];
                            rawActivity.newData.surveillance = [{friendlyId: 'SURV01'}];
                        });

                        it('should punt to user feedback if no specified changes are found', () => {
                            networkService.getActivityById.and.returnValue($q.when(rawActivity));
                            expectedActivity = {
                                action: 'Surveillance was updated',
                                details: [],
                                csvDetails: '',
                                source: {
                                    oldS: rawActivity.originalData,
                                    newS: rawActivity.newData,
                                },
                                ...rawActivity,
                            }
                            ctrl.parse(rawActivity);
                            scope.$digest();
                            expect(rawActivity).toEqual(expectedActivity);
                        });

                        it('should parse some simple fields', () => {
                            rawActivity.originalData.surveillance[0].randomizedSitesUsed = 4;
                            rawActivity.newData.surveillance[0].randomizedSitesUsed = 6;
                            networkService.getActivityById.and.returnValue($q.when(rawActivity));
                            expectedActivity = {
                                action: 'Surveillance was updated',
                                details: ['SURV01<ul><li>Number of sites surveilled changed from 4 to 6</li></ul>'],
                                csvDetails: 'SURV01<ul><li>Number of sites surveilled changed from 4 to 6</li></ul>',
                                ...rawActivity,
                            }
                            ctrl.parse(rawActivity);
                            scope.$digest();
                            expect(rawActivity).toEqual(expectedActivity);
                        });

                        it('should parse nested fields', () => {
                            rawActivity.originalData.surveillance[0].type = { name: 'randomized' };
                            rawActivity.newData.surveillance[0].type = { name: 'reactive' };
                            networkService.getActivityById.and.returnValue($q.when(rawActivity));
                            expectedActivity = {
                                action: 'Surveillance was updated',
                                details: ['SURV01<ul><li>Certification Type changed from randomized to reactive</li></ul>'],
                                csvDetails: 'SURV01<ul><li>Certification Type changed from randomized to reactive</li></ul>',
                                ...rawActivity,
                            }
                            ctrl.parse(rawActivity);
                            scope.$digest();
                            expect(rawActivity).toEqual(expectedActivity);
                        });
                    });
                });

                describe('SED', () => {
                    describe('UCD Processes', () => {
                        it('should recognize changed details', () => {
                            var activity;
                            activity = ctrl.compareSed(ActivityMock.sed[0].originalData, ActivityMock.sed[0].newData);
                            expect(activity[0]).toEqual('<li>UCD Process Name "A process" changes<ul><li>UCD Process Details changed from some details to Changed details</li></ul></li>');
                        });

                        it('should recognize removed processes', () => {
                            var activity;
                            activity = ctrl.compareSed(ActivityMock.sed[0].originalData, ActivityMock.sed[0].newData);
                            expect(activity[1]).toEqual('<li>UCD Process Name "A second" changes<ul><li>A second removed</li></ul></li>');
                        });

                        it('should recognize changed criteria', () => {
                            var activity;
                            activity = ctrl.compareSed(ActivityMock.sed[0].originalData, ActivityMock.sed[0].newData);
                            expect(activity[2]).toEqual('<li>UCD Process Name "Fourth" changes<ul><li>Added Certification Criteria:<ul><li>170.315 (a)(2)</li></ul></li><li>Removed Certification Criteria:<ul><li>170.315 (a)(1)</li></ul></li></ul></li>');
                        });

                        it('should recognize added processes', () => {
                            var activity;
                            activity = ctrl.compareSed(ActivityMock.sed[0].originalData, ActivityMock.sed[0].newData);
                            expect(activity[3]).toEqual('<li>UCD Process Name "A third" changes<ul><li>A third added</li></ul></li>');
                        });
                    });

                    describe('Tasks', () => {
                        it('should recognize changed elements', () => {
                            var activity;
                            activity = ctrl.compareSed(ActivityMock.sed[1].originalData, ActivityMock.sed[1].newData);
                            expect(activity[0]).toEqual('<li>Task Description "A description that changed" changes<ul><li>Description changed from A description that changes to A description that changed</li></ul></li>');
                        });

                        it('should recognize removed tasks', () => {
                            var activity;
                            activity = ctrl.compareSed(ActivityMock.sed[1].originalData, ActivityMock.sed[1].newData);
                            expect(activity[1]).toEqual('<li>Task Description "A removed task" changes<ul><li>A removed task removed</li></ul></li>');
                        });

                        it('should recognize added participants', () => {
                            var activity;
                            activity = ctrl.compareSed(ActivityMock.sed[1].originalData, ActivityMock.sed[1].newData);
                            expect(activity[2]).toEqual('<li>Task Description "Added participant" changes<ul><li>Added 1 Test Participant</li></ul></li>');
                        });

                        it('should recognize removed participants', () => {
                            var activity;
                            activity = ctrl.compareSed(ActivityMock.sed[1].originalData, ActivityMock.sed[1].newData);
                            expect(activity[3]).toEqual('<li>Task Description "Removed participant" changes<ul><li>Removed 1 Test Participant</li></ul></li>');
                        });

                        it('should recognize adding criteria', () => {
                            var activity;
                            activity = ctrl.compareSed(ActivityMock.sed[1].originalData, ActivityMock.sed[1].newData);
                            expect(activity[4]).toEqual('<li>Task Description "Adding criteria" changes<ul><li>Added Certification Criteria:<ul><li>number</li></ul></li></ul></li>');
                        });

                        it('should recognize removed criteria', () => {
                            var activity;
                            activity = ctrl.compareSed(ActivityMock.sed[1].originalData, ActivityMock.sed[1].newData);
                            expect(activity[5]).toEqual('<li>Task Description "Removing criteria" changes<ul><li>Removed Certification Criteria:<ul><li>number</li></ul></li></ul></li>');
                        });

                        it('should recognize added tasks', () => {
                            var activity;
                            activity = ctrl.compareSed(ActivityMock.sed[1].originalData, ActivityMock.sed[1].newData);
                            expect(activity[6]).toEqual('<li>Task Description "An added task" changes<ul><li>An added task added</li></ul></li>');
                        });
                    });

                    describe('Participants', () => {
                        var activity, curr, prev;
                        beforeEach(() => {
                            prev = ActivityMock.sed[2].originalData;
                            curr = ActivityMock.sed[2].newData
                        });

                        it('should dedupe participants', () => {
                            ctrl.compareSed(prev, curr);
                            expect(prev.allParticipants.length).toBe(3);
                            expect(curr.allParticipants.length).toBe(3);
                        });

                        it('should recognize changed age', () => {
                            activity = ctrl.compareSed(prev, curr);
                            expect(activity[2]).toEqual('<li>Participant changes<ul><li>Age Range changed from 1-9 to 100+</li></ul></li>');
                        });

                        it('should recognize changed gender', () => {
                            activity = ctrl.compareSed(prev, curr);
                            expect(activity[3]).toEqual('<li>Participant changes<ul><li>Gender changed from Male to Female</li></ul></li>');
                        });
                    });
                });

                describe('certification event history', () => {
                    describe('in the old style', () => {
                        it('should recognize when nothing changed', () => {
                            var prev = [{id: 8251, eventDate: 1482364800000, certificationStatusId: 1, certificationStatusName: 'Active', lastModifiedUser: 9, lastModifiedDate: 1483038556838}];
                            var curr = [{id: 8251, eventDate: 1482364800000, certificationStatusId: 1, certificationStatusName: 'Active', lastModifiedUser: 9, lastModifiedDate: 1483038556838}];

                            var activity = ctrl.compareCertificationEvents(prev, curr);
                            expect(activity).toEqual([]);
                        });

                        it('should recognize an added event', () => {
                            var prev = [{id: 8251, eventDate: 1482364800000, certificationStatusId: 1, certificationStatusName: 'Active', lastModifiedUser: 9, lastModifiedDate: 1483038556838}];
                            var curr = [{id: 8251, eventDate: 1482364800000, certificationStatusId: 1, certificationStatusName: 'Active', lastModifiedUser: 9, lastModifiedDate: 1483038556838}, {id: 14429, eventDate: 1515764832087, certificationStatusId: 3, certificationStatusName: 'Withdrawn by Developer', lastModifiedUser: 5, lastModifiedDate: 1515764824875}];

                            var activity = ctrl.compareCertificationEvents(prev, curr);
                            expect(activity[0]).toEqual('Added "Withdrawn by Developer" status at Jan 12, 2018');
                        });

                        it('should recognize when a date changed', () => {
                            var prev = [{id: 8251, eventDate: 1482364800000, certificationStatusId: 1, certificationStatusName: 'Active', lastModifiedUser: 9, lastModifiedDate: 1483038556838}];
                            var curr = [{id: 8251, eventDate: 1515764832087, certificationStatusId: 1, certificationStatusName: 'Active', lastModifiedUser: 9, lastModifiedDate: 1483038556838}];

                            var activity = ctrl.compareCertificationEvents(prev, curr);
                            expect(activity[0]).toEqual('"Active" status changed effective date to Jan 12, 2018');
                        });

                        it('should recognize a changed status event', () => {
                            var prev = [{id: 8251, eventDate: 1482364800000, certificationStatusId: 1, certificationStatusName: 'Active', lastModifiedUser: 9, lastModifiedDate: 1483038556838}, {id: 14429, eventDate: 1515764832087, certificationStatusId: 3, certificationStatusName: 'Withdrawn by Developer', lastModifiedUser: 5, lastModifiedDate: 1515764824875}];
                            var curr = [{id: 8251, eventDate: 1482364800000, certificationStatusId: 1, certificationStatusName: 'Active', lastModifiedUser: 9, lastModifiedDate: 1483038556838}, {id: 14430, eventDate: 1515764832087, certificationStatusId: 3, certificationStatusName: 'Withdrawn by ONC-ACB', lastModifiedUser: 5, lastModifiedDate: 1515764824875}];

                            var activity = ctrl.compareCertificationEvents(prev, curr);
                            expect(activity[0]).toEqual('"Withdrawn by Developer" status became "Withdrawn by ONC-ACB" at Jan 12, 2018');
                        });
                    });

                    describe('in the new style', () => {
                        it('should recognize when nothing changed', () => {
                            var prev = [{id: 8251, eventDate: 1482382800000, status: {id: 1, name: 'Active'}, reason: null, lastModifiedUser: 9, lastModifiedDate: 1483056556838}, {id: 14470, eventDate: 1518100595716, status: {id: 1, name: 'Active'}, reason: 'They wanted it back', lastModifiedUser: 32, lastModifiedDate: 1518100640339}, {id: 14429, eventDate: 1515782832087, status: {id: 3, name: 'Withdrawn by Developer'}, reason: null, lastModifiedUser: 5, lastModifiedDate: 1515782824875}];
                            var curr = [{id: 8251, eventDate: 1482382800000, status: {id: 1, name: 'Active'}, reason: null, lastModifiedUser: 9, lastModifiedDate: 1483056556838}, {id: 14470, eventDate: 1518100595716, status: {id: 1, name: 'Active'}, reason: 'They wanted it back', lastModifiedUser: 32, lastModifiedDate: 1518100640339}, {id: 14429, eventDate: 1515782832087, status: {id: 3, name: 'Withdrawn by Developer'}, reason: null, lastModifiedUser: 5, lastModifiedDate: 1515782824875}];

                            var activity = ctrl.compareCertificationEvents(prev, curr);
                            expect(activity).toEqual([]);
                        });

                        it('should recognize an added event', () => {
                            var prev = [{id: 8251, eventDate: 1482382800000, status: {id: 1, name: 'Active'}, reason: null, lastModifiedUser: 9, lastModifiedDate: 1483056556838}, {id: 14429, eventDate: 1515782832087, status: {id: 3, name: 'Withdrawn by Developer'}, reason: null, lastModifiedUser: 5, lastModifiedDate: 1515782824875}];
                            var curr = [{id: 8251, eventDate: 1482382800000, status: {id: 1, name: 'Active'}, reason: null, lastModifiedUser: 9, lastModifiedDate: 1483056556838}, {id: 14470, eventDate: 1518100595716, status: {id: 1, name: 'Active'}, reason: 'They wanted it back', lastModifiedUser: 32, lastModifiedDate: 1518100640339}, {id: 14429, eventDate: 1515782832087, status: {id: 3, name: 'Withdrawn by Developer'}, reason: null, lastModifiedUser: 5, lastModifiedDate: 1515782824875}];

                            var activity = ctrl.compareCertificationEvents(prev, curr);
                            expect(activity[0]).toEqual('Added "Active" status at Feb 8, 2018 with reason: "They wanted it back"');
                        });

                        it('should recognize when a date changed', () => {
                            var prev = [{id: 8251, eventDate: 1482382800000, status: {id: 1, name: 'Active'}, reason: null, lastModifiedUser: 9, lastModifiedDate: 1483056556838}, {id: 14470, eventDate: 1518100595716, status: {id: 1, name: 'Active'}, reason: 'They wanted it back', lastModifiedUser: 32, lastModifiedDate: 1518100640339}, {id: 14429, eventDate: 1515782832087, status: {id: 3, name: 'Withdrawn by Developer'}, reason: null, lastModifiedUser: 5, lastModifiedDate: 1515782824875}];
                            var curr = [{id: 8251, eventDate: 1482382800000, status: {id: 1, name: 'Active'}, reason: null, lastModifiedUser: 9, lastModifiedDate: 1483056556838}, {id: 14470, eventDate: 1518100595716, status: {id: 1, name: 'Active'}, reason: 'They wanted it back', lastModifiedUser: 32, lastModifiedDate: 1518100640339}, {id: 14429, eventDate: 1516555888888, status: {id: 3, name: 'Withdrawn by Developer'}, reason: null, lastModifiedUser: 5, lastModifiedDate: 1515782824875}];

                            var activity = ctrl.compareCertificationEvents(prev, curr);
                            expect(activity[0]).toEqual('"Withdrawn by Developer" status changed effective date to Jan 21, 2018');
                        });

                        it('should recognize a changed status event', () => {
                            var prev = [{id: 8251, eventDate: 1482382800000, status: {id: 1, name: 'Active'}, reason: null, lastModifiedUser: 9, lastModifiedDate: 1483056556838}, {id: 14470, eventDate: 1518100595716, status: {id: 1, name: 'Active'}, reason: 'They wanted it back', lastModifiedUser: 32, lastModifiedDate: 1518100640339}, {id: 14429, eventDate: 1515782832087, status: {id: 3, name: 'Withdrawn by Developer'}, reason: null, lastModifiedUser: 5, lastModifiedDate: 1515782824875}];
                            var curr = [{id: 8251, eventDate: 1482382800000, status: {id: 1, name: 'Active'}, reason: null, lastModifiedUser: 9, lastModifiedDate: 1483056556838}, {id: 14470, eventDate: 1518100595716, status: {id: 1, name: 'Active'}, reason: 'They wanted it back', lastModifiedUser: 32, lastModifiedDate: 1518100640339}, {id: 14429, eventDate: 1515782832087, status: {id: 3, name: 'Withdrawn by ONC-ACB'}, reason: null, lastModifiedUser: 5, lastModifiedDate: 1515782824875}];

                            var activity = ctrl.compareCertificationEvents(prev, curr);
                            expect(activity[0]).toEqual('"Withdrawn by Developer" status became "Withdrawn by ONC-ACB" at Jan 12, 2018');
                        });

                        it('should recognize a removed event', () => {
                            var prev = [{id: 8251, eventDate: 1482382800000, status: {id: 1, name: 'Active'}, reason: null, lastModiefiedUser: 9, lastModifiedDate: 1483056556838}, {id: 14470, eventDate: 1518100595716, status: {id: 1, name: 'Active'}, reason: 'They wanted it back', lastModifiedUser: 32, lastModifiedDate: 1518100640339}, {id: 14429, eventDate: 1515782832087, status: {id: 3, name: 'Withdrawn by Developer'}, reason: null, lastModifiedUser: 5, lastModifiedDate: 1515782824875}];
                            var curr = [{id: 8251, eventDate: 1482382800000, status: {id: 1, name: 'Active'}, reason: null, lastModifiedUser: 9, lastModifiedDate: 1483056556838}, {id: 14429, eventDate: 1515782832087, status: {id: 3, name: 'Withdrawn by Developer'}, reason: null, lastModifiedUser: 5, lastModifiedDate: 1515782824875}];

                            var activity = ctrl.compareCertificationEvents(prev, curr);
                            expect(activity[0]).toEqual('Removed "Active" status at Feb 8, 2018 with reason: "They wanted it back"');
                        });
                    });
                });
            });
        });
    });
})();
