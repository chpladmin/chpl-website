(() => {
    'use strict';

    describe('the Direct Reviews / NonConformities component', () => {
        var $log, DateUtil, ctrl, el, mock, scope;

        mock = [{
            nonConformityStatus: 'Closed',
            id: 'closed-1',
            capApprovalDate: '2020-06-19',
            capEndDate: '2021-07-20',
            capMustCompleteDate: '2022-08-21',
            capStartDate: '2023-09-22',
            dateOfDetermination: '2024-10-23',
        },{
            nonConformityStatus: 'Open',
            id: 'open-1',
            capApprovalDate: undefined,
            capEndDate: undefined,
            capMustCompleteDate: undefined,
            capStartDate: undefined,
            dateOfDetermination: undefined,
        },{
            nonConformityStatus: undefined,
            id: 'undefined-2',
        },{
            nonConformityStatus: undefined,
            id: 'undefined-1',
        },{
            nonConformityStatus: 'Closed',
            id: 'closed-2',
        }];

        beforeEach(() => {
            angular.mock.module('chpl.components', function ($provide) {
                $provide.decorator('DateUtil', function ($delegate) {
                    $delegate.getDisplayDateFormat = jasmine.createSpy('getDisplayDateFormat');
                    return $delegate;
                });
            });

            inject(($compile, _$log_, $rootScope, _DateUtil_) => {
                $log = _$log_;

                scope = $rootScope.$new();

                DateUtil = _DateUtil_;
                DateUtil.getDisplayDateFormat.and.returnValue('aaa');

                scope.nonConformities = mock;

                el = angular.element('<chpl-direct-reviews-non-conformities non-conformities="nonConformities"></chpl-direct-reviews-non-conformities>');

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
                    expect(ctrl.nonConformities[0].id).toBe('open-1');
                    expect(ctrl.nonConformities[1].id).toBe('closed-1');
                    expect(ctrl.nonConformities[2].id).toBe('closed-2');
                    expect(ctrl.nonConformities[3].id).toBe('undefined-2');
                    expect(ctrl.nonConformities[4].id).toBe('undefined-1');
                });

                it('should translate dates', () => {
                    expect(DateUtil.getDisplayDateFormat).toHaveBeenCalled();
                    expect(DateUtil.getDisplayDateFormat).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String));
                });
            });
        });
    });
})();
