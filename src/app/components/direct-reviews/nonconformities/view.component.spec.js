(() => {
    'use strict';

    describe('the Direct Reviews / Nonconformities component', () => {
        var $log, ctrl, el, mock, scope;

        mock = [{
            nonconformityStatus: 'Closed',
            id: 'closed-1',
            capApprovalDate: {year: 2020, month: 'JUNE', dayOfMonth: 19},
            capEndDate: {year: 2021, month: 'JULY', dayOfMonth: 20},
            capMustCompleteDate: {year: 2022, month: 'AUGUST', dayOfMonth: 21},
            capStartDate: {year: 2023, month: 'SEPTEMBER', dayOfMonth: 22},
            dateOfDetermination: {year: 2024, month: 'OCTOBER', dayOfMonth: 23},
        },{
            nonconformityStatus: 'Open',
            id: 'open-1',
            capApprovalDate: undefined,
            capEndDate: undefined,
            capMustCompleteDate: undefined,
            capStartDate: undefined,
            dateOfDetermination: undefined,
        },{
            nonconformityStatus: undefined,
            id: 'undefined-2',
        },{
            nonconformityStatus: undefined,
            id: 'undefined-1',
        },{
            nonconformityStatus: 'Closed',
            id: 'closed-2',
        }];

        beforeEach(() => {
            angular.mock.module('chpl.components');

            inject(($compile, _$log_, $rootScope) => {
                $log = _$log_;

                scope = $rootScope.$new();
                scope.nonconformities = mock;

                el = angular.element('<chpl-direct-reviews-nonconformities nonconformities="nonconformities"></chpl-direct-reviews-nonconformities>');

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
                it('should sort NCs', () => {
                    expect(ctrl.nonconformities[0].id).toBe('open-1');
                    expect(ctrl.nonconformities[1].id).toBe('closed-1');
                    expect(ctrl.nonconformities[2].id).toBe('closed-2');
                    expect(ctrl.nonconformities[3].id).toBe('undefined-2');
                    expect(ctrl.nonconformities[4].id).toBe('undefined-1');
                });

                it('should translate dates', () => {
                    expect(ctrl.nonconformities[1].friendlyCapApprovalDate).toBe('19 June 2020');
                    expect(ctrl.nonconformities[1].friendlyCapEndDate).toBe('20 July 2021');
                    expect(ctrl.nonconformities[1].friendlyCapMustCompleteDate).toBe('21 August 2022');
                    expect(ctrl.nonconformities[1].friendlyCapStartDate).toBe('22 September 2023');
                    expect(ctrl.nonconformities[1].friendlyDateOfDetermination).toBe('23 October 2024');
                });

                it('should handle blank dates', () => {
                    expect(ctrl.nonconformities[0].friendlyCapApprovalDate).toBe('Has not been approved');
                    expect(ctrl.nonconformities[0].friendlyCapEndDate).toBe('Has not ended');
                    expect(ctrl.nonconformities[0].friendlyCapMustCompleteDate).toBe('Has not been approved');
                    expect(ctrl.nonconformities[0].friendlyCapStartDate).toBe('Has not started');
                    expect(ctrl.nonconformities[0].friendlyDateOfDetermination).toBe('Has not been determined');
                });
            });
        });
    });
})();
