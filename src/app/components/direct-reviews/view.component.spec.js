(() => {
    'use strict';

    describe('the Direct Reviews component', () => {
        var $log, ctrl, el, mock, scope;

        mock = [{
            startDate: 30000,
            endDate: 40000,
            id: 'closed-1',
            nonConformities: [{
                nonConformityStatus: 'Closed',
            }],
        },{
            startDate: 20000,
            endDate: undefined,
            id: 'open-1',
            nonConformities: [{
                nonConformityStatus: 'Closed',
            },{
                nonConformityStatus: 'Open',
            },{
                nonConformityStatus: 'Closed',
            }],
        },{
            startDate: 30000,
            endDate: 45000,
            id: 'closed-2',
            nonConformities: [],
        },{
            startDate: 50000,
            endDate: undefined,
            id: 'open-2',
            nonConformities: [],
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
                it('should sort DRs', () => {
                    expect(ctrl.directReviews[0].id).toBe('open-2');
                    expect(ctrl.directReviews[1].id).toBe('open-1');
                    expect(ctrl.directReviews[2].id).toBe('closed-2');
                    expect(ctrl.directReviews[3].id).toBe('closed-1');
                });

                it('should count NC statuses', () => {
                    expect(ctrl.directReviews[1].ncSummary).toBe('1 open / 3 non-conformities found');
                    expect(ctrl.directReviews[3].ncSummary).toBe('1 closed non-conformity found');
                    expect(ctrl.directReviews[2].ncSummary).toBe('no non-conformities found');
                });
            });
        });
    });
})();
