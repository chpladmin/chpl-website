(function () {
    'use strict';

    describe('the Surveillance Filter', function () {
        var $analytics, $compile, $localStorage, $log, el, scope, vm;

        var stateKey = 'testState';

        beforeEach(function () {
            angular.mock.module(/*'chpl.templates',*/ 'chpl');

            inject(function (_$analytics_, _$compile_, _$localStorage_, _$log_, $q, $rootScope) {
                $analytics = _$analytics_;
                $compile = _$compile_;
                $localStorage = _$localStorage_;
                delete($localStorage[stateKey]);
                $log = _$log_;

                el = angular.element('<ai-surveillance-filter st-table ' +
                                     'register-clear-filter="cfFun" register-restore-state="rsFun" register-allow-all="aaFun"' +
                                     '></ai-surveillance-filter>');
                scope = $rootScope.$new();
                scope.cfFun = jasmine.createSpy('clearFilter');
                scope.rsFun = jasmine.createSpy('restoreState');
                scope.aaFun = jasmine.createSpy('allowAll');
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

            it('should pick up the initial State', function () {
                el = angular.element('<ai-surveillance-filter st-table ' +
                                     'initial-state="initState" ' +
                                     'register-clear-filter="cfFun" register-restore-state="rsFun" register-allow-all="aaFun"' +
                                     '></ai-surveillance-filter>');
                scope.initState = {surveillance: 'has-had', NC: {}};
                $compile(el)(scope);
                scope.$digest();
                vm = el.isolateScope().vm;
                expect(vm.query).toEqual({surveillance: 'has-had', NC: {}});
            });
        });

        describe('controller', function () {
            it('should have isolate scope object with instanciate members', function () {
                expect(vm).toEqual(jasmine.any(Object));
                expect(vm.query).toEqual({NC: {}});
            });

            it('should be able to clear the filter', function () {
                vm.query = 'before';
                spyOn(vm, 'filterChanged');
                vm.clearFilter();
                expect(vm.query).toEqual({NC: {}});
                expect(vm.filterChanged).toHaveBeenCalled();
            });

            it('should be able to allow all', function () {
                vm.query = 'fake';
                spyOn(vm, 'filterChanged');
                vm.allowAll();
                expect(vm.query).toEqual({NC: {}});
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
                                    surveillance: {NC: {}},
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
                        state.search.predicateObject.surveillance = 'searchTerm';
                        vm.restoreState(state);
                        expect(vm.query).toEqual('searchTerm');
                    });
                });
            });

            describe('when the filter is triggered', function () {
                var query;
                beforeEach(function () {
                    vm.tableCtrl = {
                        search: jasmine.createSpy('search'),
                        tableState: jasmine.createSpy('tableState'),
                    };
                    spyOn(vm, 'storeState');
                    vm.tableCtrl.tableState.and.returnValue({search: {predicateObject: {}}});
                    query = {NC: {}};
                });

                describe('and there are no changes', function () {
                    it('should delete the tableState surveillance object', function () {
                        var tableState = {
                            search: {
                                predicateObject: {
                                    surveillance: 'a surveillance',
                                },
                            },
                        };
                        vm.tableCtrl.tableState.and.returnValue(tableState);
                        vm.filterChanged();
                        expect(tableState.search.predicateObject.surveillance).toBeUndefined();
                    });

                    it('should call the tableCtrl.search', function () {
                        vm.filterChanged();
                        expect(vm.tableCtrl.search).toHaveBeenCalled();
                    });

                    it('should not store state', function () {
                        vm.filterChanged();
                        expect(vm.storeState).not.toHaveBeenCalled();
                    });

                    it('should store state if nameSpace is defined', function () {
                        vm.nameSpace = stateKey;
                        vm.filterChanged();
                        expect(vm.storeState).toHaveBeenCalled();
                    });

                    it('should not track analytics', function () {
                        spyOn($analytics, 'eventTrack');
                        vm.filterChanged();
                        expect($analytics.eventTrack).not.toHaveBeenCalled();
                    });

                    it('should report that there are no changes', function () {
                        vm.filterChanged();
                        expect(vm.hasChanges).toBe(false);
                    });
                });

                describe('and there is no initial state', function () {
                    describe('and there are changes', function () {
                        beforeEach(function () {
                            query.surveillance = 'has-had';
                            vm.query = query;
                        });

                        it('should track anlytics', function () {
                            spyOn($analytics, 'eventTrack');
                            vm.filterChanged();
                            expect($analytics.eventTrack).toHaveBeenCalledWith('Surveillance Filter', {category: 'Search', label: 'Has had Surveillance'});
                            vm.query.surveillance = 'never';
                            vm.filterChanged();
                            expect($analytics.eventTrack).toHaveBeenCalledWith('Surveillance Filter', {category: 'Search', label: 'Never Surveilled'});
                            vm.query.surveillance = '';
                            vm.query.NC = {
                                never: true,
                                open: true,
                                closed: true,
                                matchAll: true,
                            };
                            vm.filterChanged();
                            expect($analytics.eventTrack).toHaveBeenCalledWith('Surveillance Filter', {category: 'Search', label: 'Never had a Nonconformity,Open Nonconformity,Closed Nonconformity,Matching All'});
                        });

                        it('should report changes', function () {
                            vm.filterChanged();
                            expect(vm.hasChanges).toBe(true);
                        });

                        it('should call the tableCtrl.search function', function () {
                            vm.filterChanged();
                            expect(vm.tableCtrl.search).toHaveBeenCalledWith(query, 'surveillance');
                        });
                    });
                });

                describe('and there is an initial state', function () {
                    beforeEach(function () {
                        vm.initialState = {
                            surveillance: 'has-had',
                            NC: {
                                never: true,
                                open: true,
                                closed: true,
                            },
                            matchAll: true,
                        };
                    });

                    it('should call the tableCtrl.search function', function () {
                        vm.filterChanged();
                        expect(vm.tableCtrl.search).toHaveBeenCalledWith(query, 'surveillance');
                    });

                    describe('and there are changes', function () {
                        it('should track anlytics', function () {
                            spyOn($analytics, 'eventTrack');
                            vm.query = {
                                surveillance: 'never',
                                NC: {
                                    never: false,
                                    open: false,
                                    closed: false,
                                },
                                matchAll: false,
                            }
                            vm.filterChanged();
                            expect($analytics.eventTrack).toHaveBeenCalledWith('Surveillance Filter', {category: 'Search', label: 'Never Surveilled,Cleared Never had a Nonconformity,Cleared Open Nonconformity,Cleared Closed Nonconformity,Matching Any'});
                            vm.initialState = {
                                surveillance: 'never',
                                NC: {
                                    never: false,
                                    open: false,
                                    closed: false,
                                },
                                matchAll: false,
                            }
                            vm.query = {
                                surveillance: 'has-had',
                                NC: {
                                    never: true,
                                    open: true,
                                    closed: true,
                                },
                                matchAll: true,
                            };
                            vm.filterChanged();
                            expect($analytics.eventTrack).toHaveBeenCalledWith('Surveillance Filter', {category: 'Search', label: 'Has had Surveillance,Never had a Nonconformity,Open Nonconformity,Closed Nonconformity,Matching All'});
                            vm.initialState = {
                                NC: {},
                            };
                            vm.query = {
                                NC: {},
                            };
                            vm.filterChanged();
                            expect($analytics.eventTrack.calls.count()).toBe(2);
                        });

                        it('should report changes', function () {
                            vm.query.surveillance = '';
                            vm.filterChanged();
                            expect(vm.hasChanges).toBe(true);
                        });
                    });
                });
            });
        });
    });
})();
