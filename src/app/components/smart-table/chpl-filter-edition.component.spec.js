(() => {
    'use strict';

    describe('the Filter Edition component', () => {
        var $compile, $log, ctrl, el, scope;

        beforeEach(() => {
            angular.mock.module('chpl.components');

            inject((_$compile_, _$log_, $rootScope) => {
                $compile = _$compile_;
                $log = _$log_;

                scope = $rootScope.$new();
                scope.onChange = jasmine.createSpy('onChange');
                scope.registerClearFilter = jasmine.createSpy('registerClearFilter');
                scope.registerRestoreState = jasmine.createSpy('registerRestoreState');
                scope.registerShowRetired = jasmine.createSpy('registerShowRetired');

                el = angular.element('<chpl-filter-edition st-table '
                                     + 'on-change="onChange(hasChanges)" '
                                     + 'register-clear-filter="registerClearFilter()" '
                                     + 'register-restore-state="registerRestoreState()" '
                                     + 'register-show-retired="registerShowRetired()" '
                                     + '"></chpl-filter-edition>');

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

            describe('on init', () => {
                it('should register handlers', () => {
                    expect(scope.registerClearFilter).toHaveBeenCalled();
                    expect(scope.registerRestoreState).toHaveBeenCalled();
                    expect(scope.registerShowRetired).toHaveBeenCalled();
                });
            });
        });

        describe('on filter', () => {
            it('should send a query to the table', () => {
                let items = [{value: 1, display: 2, selected: true, retired: false}];
                ctrl.items = items;
                ctrl.stTable = {
                    search: jasmine.createSpy('search'),
                };
                ctrl.filterChanged();
                expect(ctrl.stTable.search).toHaveBeenCalledWith({certificationEdition: { items: items }});
            });

            it('should pass an onChange event up', () => {
                let items = [{value: 1, display: 2, selected: true, retired: false}];
                ctrl.items = items;
                ctrl.stTable = {
                    search: jasmine.createSpy('search'),
                };
                ctrl.filterChanged();
                expect(scope.onChange).toHaveBeenCalledWith(false);
            });

            it('should update state', () => {
                let items = [{value: 1, display: 2, selected: true, retired: false}];
                ctrl.items = items;
                ctrl.stTable = {
                    search: jasmine.createSpy('search'),
                };
                ctrl.storeState = jasmine.createSpy('storeState');
                ctrl.filterChanged();
                expect(ctrl.storeState).toHaveBeenCalled();
            });
        });
    });
})();
