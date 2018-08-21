(function () {
    'use strict';

    describe('the Ai Date Range', function () {
        var $analytics, $compile, $localStorage, $log, el, scope, vm;

        var stateKey = 'test';

        beforeEach(function () {
            angular.mock.module(/*'chpl.templates',*/ 'chpl');

            inject(function (_$analytics_, _$compile_, $controller, _$localStorage_, _$log_, $rootScope) {
                $analytics = _$analytics_;
                $compile = _$compile_;
                $localStorage = _$localStorage_;
                delete($localStorage[stateKey]);
                $log = _$log_;

                el = angular.element('<div st-table><ai-date-range register-clear-filter="cfFun" register-restore-state="rsFun"></ai-date-range></div>');
                scope = $rootScope.$new();
                scope.cfFun = jasmine.createSpy('clearFilter');
                scope.rsFun = jasmine.createSpy('restoreState');
                $compile(el)(scope);

                vm = $controller('AiDateRangeController', {
                    '$scope': scope,
                });
                scope.$digest();
            })
        });

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
                vm.before = 'before';
                vm.after = 'after';
                vm.hasChanges = true;
                spyOn(vm, 'filterChanged');
                vm.clearFilter();
                expect(vm.before).toBeUndefined();
                expect(vm.after).toBeUndefined();
                expect(vm.hasChanges).toBe(false);
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
                        vm.predicate = 'dateRange';
                        state = {
                            search: {
                                predicateObject: {
                                    dateRange: {},
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

                    it('should restore "after"', function () {
                        var afterObj = new Date();
                        state.search.predicateObject.dateRange.after = afterObj.getTime();
                        vm.restoreState(state);
                        expect(vm.after).toEqual(afterObj);
                    });

                    it('should restore "before"', function () {
                        var beforeObj = new Date();
                        state.search.predicateObject.dateRange.before = beforeObj.getTime();
                        vm.restoreState(state);
                        expect(vm.before).toEqual(new Date(beforeObj.setUTCDate(beforeObj.getUTCDate() - 1)));
                    });
                });
            });

            describe('when the filter changes', function () {
                beforeEach(function () {
                    vm.predicate = 'dateRange';
                    vm.tableCtrl = {
                        search: jasmine.createSpy('search'),
                    };
                    spyOn(vm, 'storeState');
                });

                it('should call the search and store state functions', function () {
                    vm.filterChanged();
                    expect(vm.tableCtrl.search).toHaveBeenCalled();
                    expect(vm.storeState).toHaveBeenCalled();
                });

                it('should have correct "hasChanges" values', function () {
                    vm.filterChanged();
                    expect(vm.hasChanges).toBeFalsy();
                    vm.after = 2;
                    vm.filterChanged();
                    expect(vm.hasChanges).toBeTruthy();
                    vm.before = 2;
                    vm.filterChanged();
                    expect(vm.hasChanges).toBeTruthy();
                    vm.after = undefined
                    vm.filterChanged();
                    expect(vm.hasChanges).toBeTruthy();
                    vm.before = undefined
                    vm.filterChanged();
                    expect(vm.hasChanges).toBeFalsy();
                });

                describe('the after date', function () {
                    it('should query as Time, not a date object', function () {
                        var dateObj = new Date();
                        vm.after = dateObj;
                        vm.filterChanged();
                        expect(vm.tableCtrl.search).toHaveBeenCalledWith({after: dateObj.getTime()}, vm.predicate);
                    });

                    it('should run analytics if turned on', function () {
                        var dateObj = new Date();
                        vm.after = dateObj;
                        vm.trackAnalytics = true;
                        spyOn($analytics, 'eventTrack');
                        vm.filterChanged();
                        expect($analytics.eventTrack).toHaveBeenCalled();
                    });
                });

                describe('the before date', function () {
                    it('should query as Time, not a date object', function () {
                        var dateObj = new Date();
                        vm.before = dateObj;
                        vm.filterChanged();
                        expect(vm.tableCtrl.search).toHaveBeenCalledWith({before: dateObj.setUTCDate(dateObj.getUTCDate() + 1)}, vm.predicate);
                    });

                    it('should run analytics if turned on', function () {
                        var dateObj = new Date();
                        vm.before = dateObj;
                        vm.trackAnalytics = true;
                        spyOn($analytics, 'eventTrack');
                        vm.filterChanged();
                        expect($analytics.eventTrack).toHaveBeenCalled();
                    });
                });
            });
        });
    });
})();
