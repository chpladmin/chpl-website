(function () {
    'use strict';

    describe('the Enhanced Text Filter', function () {
        var $compile, $localStorage, $log, $timeout, el, scope, vm;

        var stateKey = 'testState';

        beforeEach(function () {
            module('chpl.templates', 'chpl');

            inject(function (_$compile_, _$localStorage_, _$log_, $q, $rootScope, _$timeout_) {
                var stConfig = {
                    search: {
                        delay: 400,
                    },
                };
                $compile = _$compile_;
                $localStorage = _$localStorage_;
                delete($localStorage[stateKey]);
                $log = _$log_;
                $timeout = _$timeout_;

                el = angular.element('<input st-table type="text" ng-model="vm.query" ' +
                                     'ai-enhanced-text predicate="testPredicate" ' +
                                     'st-delay="300" ' +
                                     'register-clear-filter="cfFun" register-restore-state="rsFun" />');
                scope = $rootScope.$new();
                scope.cfFun = jasmine.createSpy('clearFilter');
                scope.rsFun = jasmine.createSpy('restoreState');
                scope.stConfig = stConfig;
                $compile(el)(scope);
                scope.$digest();
                vm = el.isolateScope().vm;
            });
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

            it('should pick up the st-delay throttle value', function () {
                expect(vm.throttle).toBe('300');
            });

            it('should pick up the stConfig throttle value', function () {
                el = angular.element('<input st-table type="text" ng-model="vm.query" ' +
                                     'ai-enhanced-text predicate="testPredicate" ' +
                                     'register-clear-filter="cfFun" register-restore-state="rsFun" />');
                $compile(el)(scope);
                scope.$digest();
                vm = el.isolateScope().vm;
                expect(vm.throttle).toBe(400);
            });
        });

        describe('controller', function () {
            it('should have isolate scope object with instanciate members', function () {
                expect(vm).toEqual(jasmine.any(Object));
            });

            it('should be able to clear the filter', function () {
                vm.element[0].value = 'before';
                vm.hasChanges = true;
                spyOn(vm, 'filterChanged');
                vm.clearFilter();
                expect(vm.element[0].value).toBe('');
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
                        state = {
                            search: {
                                predicateObject: {
                                    testPredicate: {},
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

                    it('should restore the element\'s value', function () {
                        state.search.predicateObject.testPredicate = 'searchTerm';
                        vm.restoreState(state);
                        expect(vm.element[0].value).toEqual('searchTerm');
                    });
                });
            });

            describe('when the filter changes', function () {
                it('should mark has changes correctly', function () {
                    expect(vm.hasChanges).toBeFalsy();
                    vm.filterChanged();
                    expect(vm.hasChanges).toBeFalsy();
                    vm.element[0].value = 'searchTerm';
                    vm.filterChanged();
                    expect(vm.hasChanges).toBe(true);
                    vm.element[0].value = '';
                    vm.filterChanged();
                    expect(vm.hasChanges).toBe(false);
                });

                describe('if there is a search term', function () {
                    beforeEach(function () {
                        vm.tableCtrl = {
                            search: jasmine.createSpy('search'),
                        };
                        vm.element[0].value = 'searchTerm';
                    });

                    it('should call the tableCtrl search function', function () {
                        vm.filterChanged();
                        expect(vm.tableCtrl.search).not.toHaveBeenCalled();
                        $timeout.flush();
                        expect(vm.tableCtrl.search).toHaveBeenCalledWith('searchTerm', 'testPredicate');
                    });

                    it('should store state if required', function () {
                        spyOn(vm, 'storeState');
                        vm.filterChanged();
                        $timeout.flush();
                        expect(vm.storeState).not.toHaveBeenCalled();
                        vm.nameSpace = stateKey;
                        vm.filterChanged();
                        $timeout.flush();
                        expect(vm.storeState).toHaveBeenCalled();
                    });

                    it('should create a promise', function () {
                        expect(vm.promise).toBeUndefined();
                        vm.filterChanged();
                        expect(vm.promise).toBeDefined();
                        $timeout.flush();
                        expect(vm.promise).toBe(null);
                    });

                    it('should cancel the promise if throttle hasn\'t been reached', function () {
                        spyOn($timeout, 'cancel');
                        expect(vm.promise).toBeUndefined();
                        vm.filterChanged();
                        expect($timeout.cancel).not.toHaveBeenCalled();
                        vm.filterChanged();
                        expect($timeout.cancel).toHaveBeenCalled();
                    });
                });
            });
        });
    });
})();
