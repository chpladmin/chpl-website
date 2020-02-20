(() => {
    'use strict';

    describe('the RelevantListings component', () => {
        var $compile, $log, ctrl, el, scope;

        beforeEach(() => {
            angular.mock.module('chpl.surveillance', $provide => {
                $provide.factory('chplRelevantListingDirective', () => ({}));
            });
            inject((_$compile_, _$log_, $rootScope, ) => {
                $compile = _$compile_;
                $log = _$log_;

                scope = $rootScope.$new();
                scope.onSave = jasmine.createSpy('onSave');

                el = angular.element('<chpl-surveillance-report-relevant-listings listings="listings" on-save="onSave(listing)"></chpl-surveillance-report-relevant-listings>');

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
                ctrl.activeListing = {id: 1};
                ctrl.cancelEdit();
                expect(ctrl.activeListing).toBe(undefined);
            });

            it('should save the listing', () => {
                let given = { id: 1 };
                ctrl.activeListing = given;
                ctrl.save(given)
                expect(scope.onSave).toHaveBeenCalledWith((given));
                expect(ctrl.activeListing).toBe(undefined);
            });
        });
    });
})();
