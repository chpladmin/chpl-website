(() => {
    'use strict';

    describe('the Compliance Filter', () => {
        var $analytics, $compile, $localStorage, $log, el, scope, vm;

        var stateKey = 'testState';

        beforeEach(() => {
            angular.mock.module('chpl.components');

            inject((_$analytics_, _$compile_, _$localStorage_, _$log_, $q, $rootScope) => {
                $analytics = _$analytics_;
                $compile = _$compile_;
                $localStorage = _$localStorage_;
                delete($localStorage[stateKey]);
                $log = _$log_;

                el = angular.element('<ai-compliance-filter st-table ' +
                                     'register-clear-filter="cfFun" register-restore-state="rsFun" register-allow-all="aaFun"' +
                                     '></ai-compliance-filter>');
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
                el = angular.element('<ai-compliance-filter st-table ' +
                                     'initial-state="initState" ' +
                                     'register-clear-filter="cfFun" register-restore-state="rsFun" register-allow-all="aaFun"' +
                                     '></ai-compliance-filter>');
                scope.initState = {compliance: 'has-had', NC: {}};
                $compile(el)(scope);
                scope.$digest();
                vm = el.isolateScope().vm;
                expect(vm.query).toEqual({compliance: 'has-had', NC: {}});
            });
        });

        describe('controller', () => {
            it('should have isolate scope object with instanciate members', () => {
                expect(vm).toEqual(jasmine.any(Object));
                expect(vm.query).toEqual({NC: {}});
            });

            it('should be able to clear the filter', () => {
                vm.query = 'before';
                spyOn(vm, 'filterChanged');
                vm.clearFilter();
                expect(vm.query).toEqual({NC: {}});
                expect(vm.filterChanged).toHaveBeenCalled();
            });

            it('should be able to allow all', () => {
                vm.query = 'fake';
                spyOn(vm, 'filterChanged');
                vm.allowAll();
                expect(vm.query).toEqual({NC: {}});
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
                    var state;
                    beforeEach(() => {
                        spyOn(vm, 'filterChanged');
                        state = {
                            search: {
                                predicateObject: {
                                    compliance: {NC: {}},
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
                        state.search.predicateObject.compliance = 'searchTerm';
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
                    query = {NC: {}};
                });

                describe('and there are no changes', () => {
                    it('should delete the tableState compliance object', () => {
                        var tableState = {
                            search: {
                                predicateObject: {
                                    compliance: 'a compliance',
                                },
                            },
                        };
                        vm.tableCtrl.tableState.and.returnValue(tableState);
                        vm.filterChanged();
                        expect(tableState.search.predicateObject.compliance).toBeUndefined();
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
                            query.compliance = 'has-had';
                            vm.query = query;
                        });

                        it('should track anlytics', () => {
                            spyOn($analytics, 'eventTrack');
                            vm.filterChanged();
                            expect($analytics.eventTrack).toHaveBeenCalledWith('Compliance Filter', {category: 'Search', label: 'Has had Compliance'});
                            vm.query.compliance = 'never';
                            vm.filterChanged();
                            expect($analytics.eventTrack).toHaveBeenCalledWith('Compliance Filter', {category: 'Search', label: 'Never Surveilled'});
                            vm.query.compliance = '';
                            vm.query.NC = {
                                never: true,
                                open: true,
                                closed: true,
                                matchAll: true,
                            };
                            vm.filterChanged();
                            expect($analytics.eventTrack).toHaveBeenCalledWith('Compliance Filter', {category: 'Search', label: 'Never had a Nonconformity,Open Nonconformity,Closed Nonconformity,Matching All'});
                        });

                        it('should report changes', () => {
                            vm.filterChanged();
                            expect(vm.hasChanges).toBe(true);
                        });

                        it('should call the tableCtrl.search function', () => {
                            vm.filterChanged();
                            expect(vm.tableCtrl.search).toHaveBeenCalledWith(query, 'compliance');
                        });
                    });
                });

                describe('and there is an initial state', () => {
                    beforeEach(() => {
                        vm.initialState = {
                            compliance: 'has-had',
                            NC: {
                                never: true,
                                open: true,
                                closed: true,
                            },
                            matchAll: true,
                        };
                    });

                    it('should call the tableCtrl.search function', () => {
                        vm.filterChanged();
                        expect(vm.tableCtrl.search).toHaveBeenCalledWith(query, 'compliance');
                    });

                    describe('and there are changes', () => {
                        it('should track anlytics', () => {
                            spyOn($analytics, 'eventTrack');
                            vm.query = {
                                compliance: 'never',
                                NC: {
                                    never: false,
                                    open: false,
                                    closed: false,
                                },
                                matchAll: false,
                            };
                            vm.filterChanged();
                            expect($analytics.eventTrack).toHaveBeenCalledWith('Compliance Filter', {category: 'Search', label: 'Never Surveilled,Cleared Never had a Nonconformity,Cleared Open Nonconformity,Cleared Closed Nonconformity,Matching Any'});
                            vm.initialState = {
                                compliance: 'never',
                                NC: {
                                    never: false,
                                    open: false,
                                    closed: false,
                                },
                                matchAll: false,
                            };
                            vm.query = {
                                compliance: 'has-had',
                                NC: {
                                    never: true,
                                    open: true,
                                    closed: true,
                                },
                                matchAll: true,
                            };
                            vm.filterChanged();
                            expect($analytics.eventTrack).toHaveBeenCalledWith('Compliance Filter', {category: 'Search', label: 'Has had Compliance,Never had a Nonconformity,Open Nonconformity,Closed Nonconformity,Matching All'});
                            vm.initialState = {
                                NC: {},
                            };
                            vm.query = {
                                NC: {},
                            };
                            vm.filterChanged();
                            expect($analytics.eventTrack.calls.count()).toBe(2);
                        });

                        it('should report changes', () => {
                            vm.query.compliance = '';
                            vm.filterChanged();
                            expect(vm.hasChanges).toBe(true);
                        });
                    });
                });
            });
        });
    });
})();
