(() => {
    'use strict';

    fdescribe('the ChangeRequest component', () => {
        var $compile, $log, ctrl, el, mock, scope;

        mock = {
            changeRequest: {
                changeRequestId: 43,
                statuses: [],
            },
        };

        beforeEach(() => {
            angular.mock.module('chpl.components');

            inject((_$compile_, _$log_, $rootScope) => {
                $compile = _$compile_;
                $log = _$log_;

                scope = $rootScope.$new();
                scope.changeRequest = mock.changeRequest;
                scope.takeAction = jasmine.createSpy('takeAction');

                el = angular.element('<chpl-change-request change-request="changeRequest" take-action="takeAction(action, data)"></chpl-change-request>');

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

            describe('on change/init', () => {
                it('should make copies of inputs', () => {
                    expect(ctrl.changeRequest).not.toBe(mock.changeRequest);
                    expect(ctrl.changeRequest).toEqual(mock.changeRequest);
                });

                it('shouldn\'t change anything that shouldn\'t change', () => {
                    let changeRequest = ctrl.changeRequest;
                    ctrl.$onChanges({});
                    expect(changeRequest).toBe(ctrl.changeRequest);
                });
            });

            describe('when using callbacks', () => {
                it('should handle update', () => {
                    ctrl.update();
                    expect(scope.takeAction).toHaveBeenCalledWith('update', mock.changeRequest);
                });

                it('should handle cancel', () => {
                    ctrl.cancel();
                    expect(scope.takeAction).toHaveBeenCalledWith('cancel', undefined);
                });
            });
        });
    });
})();
