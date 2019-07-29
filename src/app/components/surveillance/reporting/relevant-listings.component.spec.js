(() => {
    'use strict';

    fdescribe('the RelevantListings component', () => {
        var $compile, $log, $q, ctrl, el, scope;

        let mock = {
            listings: [
                { 'id': 3056, 'chplProductNumber': 'CHP-024046', 'lastModifiedDate': '1532467621312', 'edition': '2014', 'certificationDate': 1410408000000, 'reason': 'This is my Reason', 'excluded': true },
                { 'id': 3136, 'chplProductNumber': 'CHP-024900', 'lastModifiedDate': '1532466539550', 'edition': '2014', 'certificationDate': 1418878800000, 'reason': null, 'excluded': false },
                { 'id': 3264, 'chplProductNumber': 'CHP-024205', 'lastModifiedDate': '1533944258873', 'edition': '2014', 'certificationDate': 1411617600000, 'reason': 'Whatever', 'excluded': true },
            ],
        };

        beforeEach(() => {
            angular.mock.module('chpl.surveillance', $provide => {
                $provide.factory('chplRelevantListingDirective', () => ({}));
            });
            inject((_$compile_, _$log_, _$q_, $rootScope, ) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;

                scope = $rootScope.$new();
                scope.onSave = jasmine.createSpy('onSave');

                el = angular.element('<chpl-surveillance-report-relevant-listings listings="listings" on-save="onSave()"></chpl-surveillance-report-relevant-listings>');

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

            it('should cancel edit of a listing', () => {
                ctrl.listingBeingEdited = {id: 1};
                ctrl.cancelEdit();
                expect(ctrl.listingBeingEdited).toBe(undefined);
            });

            it('should exclude the listing', () => {
                let listing = { id: 1 };
                ctrl.listingBeingEdited = listing;
                ctrl.excludeRelevantListing(listing)
                expect(scope.onSave).toHaveBeenCalled();
                expect(ctrl.listingBeingEdited).toBe(undefined);
            });

            it('should undo the exclude of the listing', () => {
                let listing = { id: 1 };
                ctrl.listingBeingEdited = listing;
                ctrl.excludeRelevantListing(listing)
                expect(scope.onSave).toHaveBeenCalled();
            });
        });
    });
})();
