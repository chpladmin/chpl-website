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
                $provide.factory('chplDeveloperDirective', () => ({}));
                $provide.decorator('networkService', $delegate => {
                    $delegate.updateDeveloper = jasmine.createSpy('updateDeveloper');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _$state_, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                $state = _$state_;
                networkService = _networkService_;
                networkService.updateDeveloper.and.returnValue($q.when({
                    developer: 'a developer',
                    developerId: 32,
                }));

                scope = $rootScope.$new();
                scope.developer = mock.developer;
                scope.developers = { developers: mock.developers };

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
            it('should navigate back to the developer on a good response', () => {
                spyOn($state, 'go');
                let developer = {developerId: 'an id'};
                ctrl.selectedDevelopers = [{developerId: 1}, {developerId: 2}];
                networkService.updateDeveloper.and.returnValue($q.when({developerId: 200}));
                ctrl.merge(developer);
                scope.$digest();
                expect($state.go).toHaveBeenCalledWith(
                    'organizations.developers.developer',
                    { developerId: 200 },
                    { reload: true },
                );
            });

            it('should pass the the merging developer data to the network service', () => {
                let developer = {developerId: 'an id'};
                ctrl.developer = developer;
                ctrl.selectedDevelopers = [{developerId: 1}, {developerId: 2}];
                networkService.updateDeveloper.and.returnValue($q.when({developerId: 200}));
                ctrl.merge(developer);
                expect(networkService.updateDeveloper).toHaveBeenCalledWith({
                    developer: developer,
                    developerIds: [1, 2, 'an id'],
                });
            });
        });
    });
})();
