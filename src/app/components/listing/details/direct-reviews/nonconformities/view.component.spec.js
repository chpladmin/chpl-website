(() => {
    'use strict';

    describe('the Direct Reviews / Nonconformities component', () => {
        var $log, ctrl, el, mock, scope;

        mock = [{
            startDate: 30000,
            endDate: 40000,
            id: 'closed-1',
        },{
            startDate: 20000,
            endDate: undefined,
            id: 'open-1',
        },{
            startDate: 30000,
            endDate: 45000,
            id: 'closed-2',
        },{
            startDate: 50000,
            endDate: undefined,
            id: 'open-2',
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
                    expect(ctrl.nonconformities[0].id).toBe('open-2');
                    expect(ctrl.nonconformities[1].id).toBe('open-1');
                    expect(ctrl.nonconformities[2].id).toBe('closed-2');
                    expect(ctrl.nonconformities[3].id).toBe('closed-1');
                });
            });
        });
    });
})();
