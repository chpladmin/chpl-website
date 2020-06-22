(() => {
    'use strict';

    fdescribe('the Direct Reviews component', () => {
        var $log, ctrl, el, mock, scope;

        mock = [{
            startDate: {
                dayOfMonth: 3,
                month: 'JUNE',
                year: 2020,
            },
            endDate: {
                dayOfMonth: 3,
                month: 'OCTOBER',
                year: 2020,
            },
        },{
            startDate: {
                dayOfMonth: 3,
                month: 'JUNE',
                year: 2020,
            },
            endDate: undefined,
        }];

        beforeEach(() => {
            angular.mock.module('chpl.components');

            inject(($compile, _$log_, $rootScope) => {
                $log = _$log_;

                scope = $rootScope.$new();
                scope.directReviews = mock;

                el = angular.element('<chpl-direct-reviews direct-reviews="directReviews"></chpl-direct-reviews>');

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

            describe('on load', () => {
                it('should create friendly dates', () => {
                    expect(ctrl.directReviews[0].friendlyStartDate).toBe('3 June 2020');
                    expect(ctrl.directReviews[0].friendlyEndDate).toBe('3 October 2020');
                });

                it('should handle empty end dates', () => {
                    expect(ctrl.directReviews[1].friendlyEndDate).toBe('Has not ended');
                });
            });
        });
    });
})();
