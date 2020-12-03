(() => {
    'use strict';

    describe('the Developer Merge component', () => {
        var $compile, $log, $q, $state, ctrl, el, mock, networkService, scope, toaster;

        mock = {
            developer: {},
            developers: [],
            goodResponse: {
                job: {
                    jobDataMap: {
                        user: {
                            email: 'fake',
                        },
                    },
                },
                status: 200,
            },
        };

        beforeEach(() => {
            angular.mock.module('chpl.organizations', $provide => {
                $provide.factory('chplDeveloperDirective', () => ({}));
                $provide.decorator('networkService', $delegate => {
                    $delegate.mergeDeveloper = jasmine.createSpy('mergeDeveloper');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _$state_, _networkService_, _toaster_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                $state = _$state_;
                toaster = _toaster_;
                networkService = _networkService_;
                networkService.mergeDeveloper.and.returnValue($q.when(mock.goodResponse));

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
            let developer;
            beforeEach(() => {
                developer = {developerId: 'an id'};
                ctrl.developer = developer;
                ctrl.selectedDevelopers = [{developerId: 1}, {developerId: 2}];
            });

            it('should navigate back to the developers page on a good response', () => {
                spyOn($state, 'go');
                ctrl.merge(developer);
                scope.$digest();
                expect($state.go).toHaveBeenCalledWith('organizations.developers', {}, {reload: true});
            });

            it('should pop a notice on success', () => {
                spyOn(toaster, 'pop');
                ctrl.merge(developer);
                scope.$digest();
                expect(toaster.pop).toHaveBeenCalledWith({
                    type: 'success',
                    title: 'Merge submitted',
                    body: 'Your action has been submitted and you\'ll get an email at fake when it\'s done',
                });
            });

            it('should pass the the merging developer data to the network service', () => {
                ctrl.merge(developer);
                expect(networkService.mergeDeveloper).toHaveBeenCalledWith({
                    developer: developer,
                    developerIds: [1, 2, 'an id'],
                });
            });
        });
    });
})();
