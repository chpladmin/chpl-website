(function () {
    'use strict';

    describe('the Ai Nonconformity Filter', function () {
        var $compile, $localStorage, $log, el, scope, vm;

        var stateKey = 'test';

        beforeEach(function () {
            angular.mock.module('chpl');
        });

        beforeEach(inject(function (_$compile_, $controller, _$localStorage_, _$log_, $rootScope) {
            $compile = _$compile_;
            $localStorage = _$localStorage_;
            delete($localStorage[stateKey]);
            $log = _$log_;

            el = angular.element('<div st-table><ai-nonconformity-filter register-clear-filter="cfFun" register-restore-state="rsFun"></ai-nonconformity-filter></div>');
            scope = $rootScope.$new();
            scope.cfFun = jasmine.createSpy('clearFilter');
            scope.rsFun = jasmine.createSpy('restoreState');
            $compile(el)(scope);

            vm = $controller('NonconformityFilterController', {
                '$scope': scope,
            });
            scope.$digest();
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('directive', function () {
            it('should be compiled', function () {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', function () {
            it('should have isolate scope object with instanciate members', function () {
                expect(vm).toEqual(jasmine.any(Object));
            });

            it('should be able to clear the filter', function () {
                vm.query = {
                    nonconformities: {
                        open: true,
                        closed: false,
                    },
                };
                vm.hasChanges = true;
                spyOn(vm, 'filterChanged');
                vm.clearFilter();
                expect(vm.query).toEqual({
                    nonconformities: {
                        open: false,
                        closed: false,
                        matchAll: false,
                    },
                });
                expect(vm.filterChanged).toHaveBeenCalled();
            });

            describe('with respect to state', function () {
                it('should store it', function () {
                    vm.tableCtrl = {
                        tableState: jasmine.createSpy('tableState'),
                    };
                    vm.tableCtrl.tableState.and.returnValue({});
                    expect($localStorage[stateKey]).toBeUndefined();
                    vm.storeState();
                    expect($localStorage[stateKey]).toBeUndefined();
                    vm.nameSpace = stateKey;
                    vm.storeState();
                    expect($localStorage[stateKey]).toEqual('{}');
                    expect(vm.tableCtrl.tableState).toHaveBeenCalled();
                });

                describe('restoration', function () {
                    var state
                    beforeEach(function () {
                        spyOn(vm, 'filterChanged');
                        vm.predicate = 'nonconformity';
                        state = {
                            search: {
                                predicateObject: {
                                    nonconformities: {NC: {}},
                                },
                            },
                        };
                    });

                    it('should trigger a filterChanged event', function () {
                        vm.restoreState(state);
                        expect(vm.filterChanged).toHaveBeenCalled();
                    });

                    it('should not trigger a filterChanged event if there\'s no stored predicate', function () {
                        state.search.predicateObject = {};
                        vm.restoreState(state);
                        expect(vm.filterChanged).not.toHaveBeenCalled();
                    });

                    it('should restore the query', function () {
                        var queryObj = {
                            nonconformities: {
                                open: true,
                            },
                        };
                        state.search.predicateObject.nonconformities = queryObj;
                        vm.restoreState(state);
                        expect(vm.query).toEqual(queryObj);
                    });
                });
            });

            describe('when the filter changes', function () {
                beforeEach(function () {
                    vm.predicate = 'nonconformities';
                    vm.tableCtrl = {
                        search: jasmine.createSpy('search'),
                        tableState: jasmine.createSpy('tableState'),
                    };
                    spyOn(vm, 'storeState');
                    vm.query = {
                        nonconformities: {
                            open: false,
                            closed: false,
                            matchAll: false,
                        },
                    };
                });

                it('should call the search and store state functions', function () {
                    vm.nameSpace = stateKey;
                    vm.filterChanged();
                    expect(vm.tableCtrl.search).toHaveBeenCalled();
                    expect(vm.storeState).toHaveBeenCalled();
                });

                it('should have correct "hasChanges" values', function () {
                    vm.filterChanged();
                    expect(vm.hasChanges).toBeFalsy();
                    vm.query.nonconformities.open = true;
                    vm.filterChanged();
                    expect(vm.hasChanges).toBeTruthy();
                    vm.query.nonconformities.closed = true;
                    vm.filterChanged();
                    expect(vm.hasChanges).toBeTruthy();
                    vm.query.nonconformities.open = false;
                    vm.filterChanged();
                    expect(vm.hasChanges).toBeTruthy();
                    vm.query.nonconformities.closed = false;
                    vm.filterChanged();
                    expect(vm.hasChanges).toBeFalsy();
                    vm.query.nonconformities.matchAll = true;
                    vm.filterChanged();
                    expect(vm.hasChanges).toBeTruthy();
                });
            });
        });
    });
})();
