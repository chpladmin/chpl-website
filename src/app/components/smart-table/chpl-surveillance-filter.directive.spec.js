(() => {
    'use strict';

    describe('the Surveillance Filter', () => {
        var $analytics, $compile, $localStorage, $log, SPLIT_PRIMARY, el, scope, vm;

        var stateKey = 'testState';

        beforeEach(() => {
            angular.mock.module('chpl.components');

            inject((_$analytics_, _$compile_, _$localStorage_, _$log_, $q, $rootScope, _SPLIT_PRIMARY_) => {
                $analytics = _$analytics_;
                $compile = _$compile_;
                $localStorage = _$localStorage_;
                delete($localStorage[stateKey]);
                $log = _$log_;
                SPLIT_PRIMARY = _SPLIT_PRIMARY_;

                el = angular.element('<chpl-surveillance-filter st-table ' +
                                     'register-clear-filter="cfFun" register-restore-state="rsFun" register-allow-all="aaFun"' +
                                     '></chpl-surveillance-filter>');
                scope = $rootScope.$new();
                scope.cfFun = jasmine.createSpy('clearFilter');
                scope.rsFun = jasmine.createSpy('restoreState');
                scope.aaFun = jasmine.createSpy('allowAll');
                $compile(el)(scope);
                scope.$digest();
                vm = el.isolateScope().vm;
            });
        });

        afterEach(() => {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('directive', () => {
            it('should be compiled', () => {
                expect(el.html()).not.toEqual(null);
            });

            it('should pick up the initial State', () => {
                el = angular.element('<chpl-surveillance-filter st-table ' +
                                     'initial-state="initState" ' +
                                     'register-clear-filter="cfFun" register-restore-state="rsFun" register-allow-all="aaFun"' +
                                     '></chpl-surveillance-filter>');
                scope.initState = {surveillance: 'has-had', NC: {}};
                $compile(el)(scope);
                scope.$digest();
                vm = el.isolateScope().vm;
                expect(vm.query).toEqual({surveillance: 'has-had', NC: {}});
            });
        });

        describe('controller', () => {
            it('should have isolate scope object with instanciate members', () => {
                expect(vm).toEqual(jasmine.any(Object));
                expect(vm.query).toEqual({separator: SPLIT_PRIMARY, NC: {}, surveillance: {}, dates: {}});
            });

            it('should be able to clear the filter', () => {
                vm.query = 'before';
                spyOn(vm, 'filterChanged');
                vm.clearFilter();
                expect(vm.query).toEqual({separator: SPLIT_PRIMARY, NC: {}, surveillance: {}, dates: {}});
                expect(vm.filterChanged).toHaveBeenCalled();
            });

            it('should be able to allow all', () => {
                vm.query = 'fake';
                spyOn(vm, 'filterChanged');
                vm.allowAll();
                expect(vm.query).toEqual({separator: SPLIT_PRIMARY, NC: {}, surveillance: {}, dates: {}});
                expect(vm.filterChanged).toHaveBeenCalled();
            });

            describe('with respect to state', () => {
                it('should store it', () => {
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

                describe('restoration', () => {
                    var state
                    beforeEach(() => {
                        spyOn(vm, 'filterChanged');
                        state = {
                            search: {
                                predicateObject: {
                                    surveillance: {NC: {}, surveillance: {}, dates: {}},
                                },
                            },
                        };
                    });

                    it('should trigger a filterChanged event', () => {
                        vm.restoreState(state);
                        expect(vm.filterChanged).toHaveBeenCalled();
                    });

                    it('should not trigger a filterChanged event if there\'s no stored predicate', () => {
                        state.search.predicateObject = {};
                        vm.restoreState(state);
                        expect(vm.filterChanged).not.toHaveBeenCalled();
                    });

                    it('should restore the element\'s value', () => {
                        state.search.predicateObject.surveillance = 'searchTerm';
                        vm.restoreState(state);
                        expect(vm.query).toEqual('searchTerm');
                    });
                });
            });

            describe('when the filter is triggered', () => {
                var query;
                beforeEach(() => {
                    vm.tableCtrl = {
                        search: jasmine.createSpy('search'),
                        tableState: jasmine.createSpy('tableState'),
                    };
                    spyOn(vm, 'storeState');
                    vm.tableCtrl.tableState.and.returnValue({search: {predicateObject: {}}});
                    query = {separator: SPLIT_PRIMARY, NC: {}, surveillance: {}, dates: {}};
                });

                describe('and there are no changes', () => {
                    it('should delete the tableState surveillance object', () => {
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

                    it('should call the tableCtrl.search', () => {
                        vm.filterChanged();
                        expect(vm.tableCtrl.search).toHaveBeenCalled();
                    });

                    it('should not store state', () => {
                        vm.filterChanged();
                        expect(vm.storeState).not.toHaveBeenCalled();
                    });

                    it('should store state if nameSpace is defined', () => {
                        vm.nameSpace = stateKey;
                        vm.filterChanged();
                        expect(vm.storeState).toHaveBeenCalled();
                    });

                    it('should not track analytics', () => {
                        spyOn($analytics, 'eventTrack');
                        vm.filterChanged();
                        expect($analytics.eventTrack).not.toHaveBeenCalled();
                    });

                    it('should report that there are no changes', () => {
                        vm.filterChanged();
                        expect(vm.hasChanges).toBe(false);
                    });
                });

                describe('and there is no initial state', () => {
                    describe('and there are changes', () => {
                        beforeEach(() => {
                            query.surveillance.status = 'has-had';
                            vm.query = query;
                        });

                        it('should track analytics', () => {
                            spyOn($analytics, 'eventTrack');
                            vm.filterChanged();
                            expect($analytics.eventTrack).toHaveBeenCalledWith('Surveillance Filter', {category: 'Search', label: 'Has had Surveillance'});
                            vm.query.surveillance.status = 'never';
                            vm.filterChanged();
                            expect($analytics.eventTrack).toHaveBeenCalledWith('Surveillance Filter', {category: 'Search', label: 'Never Surveilled'});
                            vm.query.surveillance.status = '';
                            vm.query.NC = {
                                never: true,
                                open: true,
                                closed: true,
                                matchAll: true,
                            };
                            vm.filterChanged();
                            expect($analytics.eventTrack).toHaveBeenCalledWith('Surveillance Filter', {category: 'Search', label: 'Never had a Nonconformity,Open Nonconformity,Closed Nonconformity,Matching All'});
                        });

                        it('should report changes', () => {
                            vm.filterChanged();
                            expect(vm.hasChanges).toBe(true);
                        });

                        it('should call the tableCtrl.search function', () => {
                            vm.filterChanged();
                            expect(vm.tableCtrl.search).toHaveBeenCalledWith(query, 'surveillance');
                        });
                    });
                });

                describe('and there is an initial state', () => {
                    beforeEach(() => {
                        vm.initialState = {
                            separator: SPLIT_PRIMARY,
                            surveillance: {status: 'has-had'},
                            NC: {
                                never: true,
                                open: true,
                                closed: true,
                            },
                            dates: {},
                            matchAll: true,
                        };
                    });

                    it('should call the tableCtrl.search function', () => {
                        vm.filterChanged();
                        expect(vm.tableCtrl.search).toHaveBeenCalledWith(query, 'surveillance');
                    });

                    describe('and there are changes', () => {
                        it('should track anlytics', () => {
                            spyOn($analytics, 'eventTrack');
                            vm.query = {
                                surveillance: {status: 'never'},
                                separator: SPLIT_PRIMARY,
                                NC: {
                                    never: false,
                                    open: false,
                                    closed: false,
                                },
                                dates: {},
                                matchAll: false,
                            }
                            vm.filterChanged();
                            expect($analytics.eventTrack).toHaveBeenCalledWith('Surveillance Filter', {category: 'Search', label: 'Never Surveilled,Cleared Never had a Nonconformity,Cleared Open Nonconformity,Cleared Closed Nonconformity,Matching Any'});
                            vm.initialState = {
                                surveillance: {status: 'never'},
                                separator: SPLIT_PRIMARY,
                                NC: {
                                    never: false,
                                    open: false,
                                    closed: false,
                                },
                                dates: {},
                                matchAll: false,
                            }
                            vm.query = {
                                surveillance: {status: 'has-had'},
                                separator: SPLIT_PRIMARY,
                                NC: {
                                    never: true,
                                    open: true,
                                    closed: true,
                                },
                                dates: {},
                                matchAll: true,
                            };
                            vm.filterChanged();
                            expect($analytics.eventTrack).toHaveBeenCalledWith('Surveillance Filter', {category: 'Search', label: 'Has had Surveillance,Never had a Nonconformity,Open Nonconformity,Closed Nonconformity,Matching All'});
                            vm.initialState = {
                                surveillance: {},
                                separator: SPLIT_PRIMARY,
                                NC: {},
                                dates: {},
                            };
                            vm.query = {
                                NC: {},
                                surveillance: {},
                                dates: {},
                            };
                            vm.filterChanged();
                            expect($analytics.eventTrack.calls.count()).toBe(2);
                        });

                        it('should report changes', () => {
                            vm.query.surveillance.status = '';
                            vm.filterChanged();
                            expect(vm.hasChanges).toBe(true);
                        });
                    });
                });
            });
        });
    });
})();
