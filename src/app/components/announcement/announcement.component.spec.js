(() => {
    'use strict';

    fdescribe('the Announcement component', () => {
        var $compile, $log, ctrl, el, mock, scope;

        mock = {
            announcement: {
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
                scope.announcement = mock.announcement
                scope.takeAction = jasmine.createSpy('takeAction');

                el = angular.element('<chpl-announcement announcement="announcement" take-action="takeAction(data, action)"></chpl-announcement>');

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
                    expect(ctrl.announcement).not.toBe(mock.announcement);
                    expect(ctrl.announcement).toEqual(mock.announcement);
                });

                it('shouldn\'t change anything that shouldn\'t change', () => {
                    // save old state
                    let announcement = ctrl.announcement;

                    // make changes
                    ctrl.$onChanges({});

                    //assert
                    expect(announcement).toBe(ctrl.announcement);
                });
            });

            describe('when using callbacks', () => {
                it('should send back data on save', () => {
                    ctrl.save();
                    expect(scope.takeAction).toHaveBeenCalledWith(mock.announcement, 'save');
                });

                it('should send back data on cancel', () => {
                    ctrl.cancel();
                    expect(scope.takeAction).toHaveBeenCalledWith(mock.announcement, 'cancel');
                });

                it('should send back data on create', () => {
                    ctrl.cancel();
                    expect(scope.takeAction).toHaveBeenCalledWith(mock.announcement, 'create');
                });
            });
        });
    });
})();
