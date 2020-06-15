(() => {
    'use strict';

    describe('the Developer Merge component', () => {
        var $compile, $log, $q, $state, ctrl, el, mock, networkService, scope;

        mock = {
            developer: {},
            developers: [],
        };

        beforeEach(() => {
            angular.mock.module('chpl.organizations', $provide => {
                $provide.decorator('networkService', $delegate => {
                    $delegate.mergeDeveloper = jasmine.createSpy('mergeDeveloper');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _$state_, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                $state = _$state_;
                networkService = _networkService_;
                networkService.mergeDeveloper.and.returnValue($q.when({
                    developer: 'a developer',
                }));

                scope = $rootScope.$new();
                scope.developer = mock.developer;
                scope.developers = mock.developers;

                el = angular.element('<chpl-developers-merge developer="developer" developers="developers"></chpl-developers-merge>');

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

        describe('template', () => {
            it('should be compiled', () => {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', () => {
            it('should exist', () => {
                expect(ctrl).toBeDefined();
            });
        });

        describe('when a developer merge is saved', () => {
            it('should navigate back to the developer on a status:200 response', () => {
                spyOn($state, 'go');
                ctrl.developer = {developerId: 'an id'};
                networkService.mergeDeveloper.and.returnValue($q.when({status: 200}));
                ctrl.mergeDeveloper = {
                    newDeveloper: {},
                    oldDeveloper: {},
                    newProducts: [],
                    oldProducts: [],
                };
                ctrl.merge();
                scope.$digest();
                expect($state.go).toHaveBeenCalled();
            });

            it('should report errors if response has errors', () => {
                spyOn($state, 'go');
                networkService.mergeDeveloper.and.returnValue($q.when({status: 401, data: {errorMessages: ['This is an error', 'This is another error']}}));
                ctrl.mergeDeveloper = {
                    newDeveloper: {},
                    oldDeveloper: {},
                    newProducts: [],
                    oldProducts: [],
                };
                ctrl.errorMessages = [];
                ctrl.merge();
                scope.$digest();
                expect(ctrl.errorMessages.length).toBe(2);
            });

            it('should pass the the merge developer data to the network service', () => {
                spyOn($state, 'go');
                networkService.mergeDeveloper.and.returnValue($q.when({status: 200}));
                ctrl.mergeDeveloper = {
                    newDeveloper: {},
                    oldDeveloper: {},
                    newProducts: [],
                    oldProducts: [],
                };
                ctrl.merge({});
                scope.$digest();
                expect(networkService.mergeDeveloper).toHaveBeenCalledWith(ctrl.mergeDeveloper);
            });
        });
    });
})();
