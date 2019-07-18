(() => {
    'use strict';

    fdescribe('the Fuzzy Type component', () => {
        var $compile, $log, ctrl, el, mock, scope;

        mock = {
            type: {
                fuzzyType: 'a type',
                choices: [1, 2, 3],
            },
        };

        beforeEach(() => {
            angular.mock.module('chpl.components');

            inject((_$compile_, _$log_, $rootScope) => {
                $compile = _$compile_;
                $log = _$log_;

                scope = $rootScope.$new();
                scope.fuzzyType = mock.type
                scope.takeAction = jasmine.createSpy('takeAction');

                el = angular.element('<chpl-fuzzy-type fuzzy-type="fuzzyType" take-action="takeAction(data, action)"></chpl-fuzzy-type>');

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
                    expect(ctrl.fuzzyType).not.toBe(mock.type);
                    expect(ctrl.fuzzyType).toEqual(mock.type);
                });

                it('shouldn\'t change anything that shouldn\'t change', () => {
                    // save old state
                    let fuzzyType = ctrl.fuzzyType;

                    // make changes
                    ctrl.$onChanges({});

                    //assert
                    expect(fuzzyType).toBe(ctrl.fuzzyType);
                });
            });

            describe('when using callbacks', () => {
                it('should send back data on edit', () => {
                    ctrl.edit();
                    expect(scope.takeAction).toHaveBeenCalledWith(mock.type, 'edit');
                });

                it('should send back data on save', () => {
                    ctrl.save();
                    expect(scope.takeAction).toHaveBeenCalledWith(mock.type, 'save');
                });

                it('should send back data on cancel', () => {
                    ctrl.cancel();
                    expect(scope.takeAction).toHaveBeenCalledWith(mock.type, 'cancel');
                });
            });
        });
    });
})();
