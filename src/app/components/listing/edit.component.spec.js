(() => {
    'use strict';

    fdescribe('the Listing Edit component', () => {
        var $compile, $log, $q, authService, ctrl, el, mock, networkService, scope, utilService;

        mock = {};
        mock.listing = {
            certificationEdition: {name: '2015'},
            certificationEvents: [
                { eventDate: 1498622400000, certificationStatusId: 1, status: { name: 'Active' }},
            ],
            certifyingBody: [],
            chplProductNumber: 'CHP-123123',
            classificationType: [],
            ics: { inherits: false },
            practiceType: [],
            product: { productId: 1 },
            qmsStandards: [
                {id: 1, qmsStandardName: 'name1'},
                {id: null, qmsStandardName: 'nullname'},
            ],
            targetedUsers: [],
        };
        mock.resources = {
            accessibilityStandards: [{id: 1, name: 'name1'}],
            bodies: [{id: 1, name: 'name1'}, {id: 2, name: 'name2'}],
            classifications: [{id: 1, name: 'name1'}],
            practices: [{id: 1, name: 'name1'}],
            qmsStandards: {data: [
                {id: 1, name: 'name1'},
                {id: 2, name: 'name2'},
            ]},
            statuses: [{id: 1, name: 'name1'}],
            testingLabs: [{id: 1, name: 'name1'}],
        }
        mock.relatedListings = [{id: 1, edition: '2015'}, {id: 2, edition: '2014'}];

        beforeEach(() => {
            angular.mock.module('chpl', 'chpl.components', $provide => {
                $provide.decorator('authService', $delegate => {
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');
                    return $delegate;
                });
                $provide.decorator('networkService', $delegate => {
                    $delegate.getRelatedListings = jasmine.createSpy('getRelatedListings');
                    return $delegate;
                });
                $provide.decorator('utilService', $delegate => {
                    $delegate.extendSelect = jasmine.createSpy('extendSelect');
                    return $delegate;
                });
            });

            inject((_$compile_, _$controller_, _$log_, _$q_, $rootScope, _authService_, _networkService_, _utilService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                authService = _authService_;
                authService.hasAnyRole.and.returnValue(true);
                networkService = _networkService_;
                networkService.getRelatedListings.and.returnValue($q.when(mock.relatedListings));
                utilService = _utilService_;
                utilService.extendSelect.and.returnValue([]);

                scope = $rootScope.$new();
                scope.listing = angular.copy(mock.listing);
                scope.isSaving = false;
                scope.onCancel = jasmine.createSpy('onCancel');
                scope.onSave = jasmine.createSpy('onSave');
                scope.resources = angular.copy(mock.resources);
                scope.workType = 'edit';

                el = angular.element('<chpl-listing-edit listing="listing" is-saving="isSaving" on-save="onSave(listing, reason)" on-cancel="onCancel()" resources="resources" work-type="workType"></chpl-listing-edit>');

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

        it('should exist', () => {
            expect(ctrl).toBeDefined();
        });

        it('should not create parents if they exist', () => {
            var cp = angular.copy(mock.listing);
            cp.ics.parents = [{name: 'a parent'}];
            scope.listing = cp;

            el = angular.element('<chpl-listing-edit listing="listing" work-type="workType" callbacks="callbacks" resources="resources"></chpl-listing-edit>');

            $compile(el)(scope);
            scope.$digest();
            ctrl = el.isolateScope().$ctrl;
            expect(ctrl.listing.ics.parents).toEqual([{name: 'a parent'}]);
        });

        it('should break the parts of the product number apart if it\'s the new style', () => {
            var cp = angular.copy(mock.listing);
            cp.chplProductNumber = '15.07.07.2713.CQ01.02.00.1.170331';
            scope.listing = cp;

            el = angular.element('<chpl-listing-edit listing="listing" work-type="workType" callbacks="callbacks" resources="resources"></chpl-listing-edit>');

            $compile(el)(scope);
            scope.$digest();
            ctrl = el.isolateScope().$ctrl;

            expect(ctrl.idFields).toEqual({
                prefix: '15.07.07.2713',
                prod: 'CQ01',
                ver: '02',
                ics: '00',
                suffix: '1.170331',
            });
        });

        it('should add QMS standards in the cp to the available standards on load', () => {
            expect(ctrl.resources.qmsStandards.data.map(item => {
                delete item.$$hashKey;
                return item;
            })).toEqual([
                {id: 1, name: 'name1'},
                {id: 2, name: 'name2'},
                {id: null, qmsStandardName: 'nullname', name: 'nullname'},
            ]);
        });

        describe('when deailing with ics family', () => {
            it('should call the common service to get related listings', () => {
                expect(networkService.getRelatedListings).toHaveBeenCalled();
            });

            it('should load the related listings on load, without the 2014 ones', () => {
                expect(ctrl.relatedListings).toEqual([mock.relatedListings[0]]);
            });

            it('should build an icsParents object if the Listing doesn\'t come with one', () => {
                expect(ctrl.listing.ics.parents).toEqual([]);
            });

            it('should not load family if the listing is 2014', () => {
                var callCount = networkService.getRelatedListings.calls.count();
                var cp = angular.copy(mock.listing);
                cp.certificationEdition = {name: '2014'};
                scope.listing = cp;

                el = angular.element('<chpl-listing-edit listing="listing" work-type="workType" callbacks="callbacks" resources="resources"></chpl-listing-edit>');

                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
                expect(networkService.getRelatedListings.calls.count()).toBe(callCount)
            });

            it('should not load family if the product has no productId', () => {
                var callCount = networkService.getRelatedListings.calls.count();
                var cp = angular.copy(mock.listing);
                cp.product = {productId: undefined};
                scope.listing = cp;

                el = angular.element('<chpl-listing-edit listing="listing" work-type="workType" callbacks="callbacks" resources="resources"></chpl-listing-edit>');

                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
                expect(networkService.getRelatedListings.calls.count()).toBe(callCount)
            });

            it('should not load family if the product does not exist', () => {
                var callCount = networkService.getRelatedListings.calls.count();
                var cp = angular.copy(mock.listing);
                cp.product = undefined;
                scope.listing = cp;

                el = angular.element('<chpl-listing-edit listing="listing" work-type="workType" callbacks="callbacks" resources="resources"></chpl-listing-edit>');

                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
                expect(networkService.getRelatedListings.calls.count()).toBe(callCount)
            });

            describe('when disabling related options', () => {
                it('should disable itself', () => {
                    expect(ctrl.disabledParent({ chplProductNumber: 'CHP-123123'})).toBe(true);
                });

                it('should disable ones that are already parents', () => {
                    expect(ctrl.disabledParent({ chplProductNumber: '123'})).toBe(false);
                    ctrl.listing.ics.parents = [{ chplProductNumber: '123' }];
                    expect(ctrl.disabledParent({ chplProductNumber: '123'})).toBe(true);
                });
            });

            describe('with respect to ics code calculations', () => {
                it('should expect the code to be 00 if no parents', () => {
                    ctrl.listing.ics.parents = [];
                    expect(ctrl.requiredIcsCode()).toBe('00');
                });

                it('should expect the code to be 1 if one parent and parent has ICS 00', () => {
                    ctrl.listing.ics.parents = [{chplProductNumber: '15.07.07.2713.CQ01.02.00.1.170331'}];
                    expect(ctrl.requiredIcsCode()).toBe('01');
                });

                it('should expect the code to be 1 if two parents and parents have ICS 00', () => {
                    ctrl.listing.ics.parents = [
                        {chplProductNumber: '15.07.07.2713.CQ01.02.00.1.170331'},
                        {chplProductNumber: '15.07.07.2713.CQ01.02.00.1.170331'},
                    ];
                    expect(ctrl.requiredIcsCode()).toBe('01');
                });

                it('should expect the code to be 2 if two parents and parents have ICS 01', () => {
                    ctrl.listing.ics.parents = [
                        {chplProductNumber: '15.07.07.2713.CQ01.02.01.1.170331'},
                        {chplProductNumber: '15.07.07.2713.CQ01.02.01.1.170331'},
                    ];
                    expect(ctrl.requiredIcsCode()).toBe('02');
                });

                it('should expect the code to be 3 if two parents and parents have ICS 01,02', () => {
                    ctrl.listing.ics.parents = [
                        {chplProductNumber: '15.07.07.2713.CQ01.02.01.1.170331'},
                        {chplProductNumber: '15.07.07.2713.CQ01.02.02.1.170331'},
                    ];
                    expect(ctrl.requiredIcsCode()).toBe('03');
                });

                it('should expect the code to be 10 if two parents and parents have ICS 03,09', () => {
                    ctrl.listing.ics.parents = [
                        {chplProductNumber: '15.07.07.2713.CQ01.02.09.1.170331'},
                        {chplProductNumber: '15.07.07.2713.CQ01.02.03.1.170331'},
                    ];
                    expect(ctrl.requiredIcsCode()).toBe('10');
                });

                it('should expect the code to be 18 if two parents and parents have ICS 17,11', () => {
                    ctrl.listing.ics.parents = [
                        {chplProductNumber: '15.07.07.2713.CQ01.02.17.1.170331'},
                        {chplProductNumber: '15.07.07.2713.CQ01.02.11.1.170331'},
                    ];
                    expect(ctrl.requiredIcsCode()).toBe('18');
                });
            });

            describe('with respect to missing ICS source', () => {
                it('should not require ics source for 2014 listings', () => {
                    ctrl.listing.certificationEdition.name = '2015';
                    expect(ctrl.missingIcsSource()).toBe(false);
                });

                it('should not require ics source if the listing does not inherit', () => {
                    expect(ctrl.missingIcsSource()).toBe(false);
                });

                it('should require ics source if the listing inherits without parents', () => {
                    ctrl.listing.ics.inherits = true;
                    expect(ctrl.missingIcsSource()).toBe(true);
                });

                it('should require ics source if the listing inherits without parents and without space for parents', () => {
                    ctrl.listing.ics.inherits = true;
                    ctrl.listing.ics.parents = [];
                    expect(ctrl.missingIcsSource()).toBe(true);
                });

                it('should not require ics source if the listing inherits and has parents', () => {
                    ctrl.listing.ics.inherits = true;
                    ctrl.listing.ics.parents = [1, 2];
                    expect(ctrl.missingIcsSource()).toBe(false);
                });
            });
        });

        it('should know which statuses should be disabled', () => {
            ctrl.workType = 'edit';
            expect(ctrl.disabledStatus('Pending')).toBe(true);
            expect(ctrl.disabledStatus('Active')).toBe(false);
            ctrl.workType = 'confirm';
            expect(ctrl.disabledStatus('Pending')).toBe(false);
            expect(ctrl.disabledStatus('Active')).toBe(true);
        });

        xit('should attach the model for the select boxes', () => {
            ctrl.listing.practiceType = {id: 1};
            ctrl.listing.classificationType = {id: 1};
            ctrl.listing.certifyingBody = {id: 2};
            ctrl.listing.certificationStatus = {id: 1};
            ctrl.attachModel();
            expect(ctrl.listing.practiceType).toEqual(mock.resources.practices[0]);
            expect(ctrl.listing.classificationType).toEqual(mock.resources.classifications[0]);
            expect(ctrl.listing.certifyingBody).toEqual(mock.resources.bodies[1]);
            expect(ctrl.listing.testingLab).not.toEqual(mock.resources.testingLabs[0]);
            ctrl.listing.testingLab = {id: 1};
            ctrl.attachModel();
            expect(ctrl.listing.testingLab).toEqual(mock.resources.testingLabs[0]);
        });

        describe('when saving a Listing', () => {
            it('should combine values to make the chpl product number if required', () => {
                ctrl.listing.chplProductNumber = '15.04.04.2879.Your.09.2.1.170530';
                ctrl.idFields = {
                    prefix: '14.03.03.2879',
                    prod: 'prod',
                    ver: 'vr',
                    ics: '02',
                    suffix: '0.140303',
                };
                ctrl.save();
                expect(ctrl.listing.chplProductNumber).toBe('14.03.03.2879.prod.vr.02.0.140303');
            });

            it('should add date longs from the date objects', () => {
                var aDate = new Date('1/1/2009');
                var dateValue = aDate.getTime();
                ctrl.listing.certificationEvents = [
                    {
                        status: {name: 'Active'},
                        statusDateObject: aDate,
                    },
                ];
                ctrl.save();
                expect(ctrl.listing.certificationEvents[0].eventDate).toBe(dateValue);
            });

            describe('that is pending', () => {
                xit('should close it\'s modal with the current Listing', () => {
                    ctrl.workType = 'confirm';
                    ctrl.save();
                });
            });
        });

        describe('when handling certification status history', () => {
            it('should add statusEventObjects for each statusDate in history', () => {
                expect(ctrl.listing.certificationEvents[0].statusDateObject).toEqual(new Date(ctrl.listing.certificationEvents[0].eventDate));
            });

            it('should remove previous statuses', () => {
                ctrl.addPreviousStatus();
                ctrl.addPreviousStatus();
                ctrl.addPreviousStatus();
                var initLength = ctrl.listing.certificationEvents.length;
                ctrl.removePreviousStatus(ctrl.listing.certificationEvents[0].statusDateObject);
                expect(ctrl.listing.certificationEvents.length).toBe(initLength - 1);
            });

            it('should add an empty status', () => {
                var initLength = ctrl.listing.certificationEvents.length;
                ctrl.addPreviousStatus();
                expect(ctrl.listing.certificationEvents.length).toBe(initLength + 1);
                expect(ctrl.listing.certificationEvents[ctrl.listing.certificationEvents.length - 1].statusDateObject).toBeDefined();
            });

            it('should know when the "earliest" status is not "Active"', () => {
                ctrl.listing.certificationEvents = [
                    { statusDateObject: new Date('1/1/2018'), status: { name: 'Withdrawn by Developer' } },
                    { statusDateObject: new Date('2/2/2018'), status: { name: 'Active' } },
                ];
                expect(ctrl.improperFirstStatus()).toBe(true);
                ctrl.listing.certificationEvents[1].statusDateObject = new Date('1/1/2017');
                expect(ctrl.improperFirstStatus()).toBe(false);
            });

            it('should not error on improper first status when confirming', () => {
                ctrl.workType = 'confirm';
                ctrl.listing.certificationEvents = [];
                expect(ctrl.improperFirstStatus()).toBe(false);
            });
        });

        describe('when validating the form', () => {
            it('should know when two status events were on the same day', () => {
                ctrl.listing.certificationEvents = [
                    {
                        status: {name: 'Active'},
                        statusDateObject: new Date('1/1/2009'),
                    },{
                        status: {name: 'Suspended by ONC'},
                        statusDateObject: new Date('1/1/2009'),
                    },
                ];
                expect(ctrl.hasDateMatches()).toBe(true);
                ctrl.listing.certificationEvents[0].statusDateObject = new Date('2/2/2002');
                expect(ctrl.hasDateMatches()).toBe(false);
            });

            it('should know when two status events are the same and consecutive', () => {
                ctrl.listing.certificationEvents = [
                    {
                        status: {name: 'Active'},
                        statusDateObject: new Date('1/1/2009'),
                    },{
                        status: {name: 'Active'},
                        statusDateObject: new Date('2/2/2009'),
                    },
                ];
                expect(ctrl.hasStatusMatches()).toBe(true);
                ctrl.listing.certificationEvents[0].status.name = 'Suspended by ONC';
                expect(ctrl.hasStatusMatches()).toBe(false);
            });
        });
    });
})();
