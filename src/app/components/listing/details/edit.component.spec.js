(() => {
    'use strict';

    describe('the Listing Details Edit component', () => {
        var $compile, $log, Mock, ctrl, el, mock, networkService, scope;

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
        mock.relatedListings = [{id: 1, edition: '2015'}, {id: 2, edition: '2014'}];

        beforeEach(() => {
            angular.mock.module('chpl.mock', 'chpl.components', $provide => {
                $provide.factory('aiSedDirective', () => ({}));
                $provide.decorator('networkService', $delegate => {
                    $delegate.getRelatedListings = jasmine.createSpy('getRelatedListings');
                    $delegate.getSurveillanceLookups = jasmine.createSpy('getSurveillanceLookups');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, $q, $rootScope, _Mock_, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                Mock = _Mock_;
                networkService = _networkService_;
                networkService.getRelatedListings.and.returnValue($q.when(mock.relatedListings));
                networkService.getSurveillanceLookups.and.returnValue($q.when({}));

                scope = $rootScope.$new();
                scope.listing = Mock.fullListings[1];
                scope.listing.sed = {testTasks: [], ucdProcesses: []};

                el = angular.element('<chpl-listing-details-edit listing="listing"></chpl-listing-details-edit>');

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
            it('should have isolate scope object with instanciate members', () => {
                expect(ctrl).toEqual(jasmine.any(Object));
            });

            describe('initial state', () => {
                it('should be open to criteria by default', () => {
                    expect(ctrl.panelShown).toBe('cert');
                });

                it('should be able to be open to nothing', () => {
                    el = angular.element('<chpl-listing-details-edit listing="listing" initial-panel="none"></chpl-listing-details-edit>');
                    $compile(el)(scope);
                    scope.$digest();
                    ctrl = el.isolateScope().$ctrl;
                    expect(ctrl.panelShown).toBeUndefined();
                });

                it('should be able to be open to surveillance', () => {
                    el = angular.element('<chpl-listing-details-edit listing="listing" initial-panel="surveillance"></chpl-listing-details-edit>');
                    $compile(el)(scope);
                    scope.$digest();
                    ctrl = el.isolateScope().$ctrl;
                    expect(ctrl.panelShown).toBe('surveillance');
                });
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
                    expect(networkService.getRelatedListings.calls.count()).toBe(callCount);
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
                    expect(networkService.getRelatedListings.calls.count()).toBe(callCount);
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
                    expect(networkService.getRelatedListings.calls.count()).toBe(callCount);
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
        });
    });
})();
