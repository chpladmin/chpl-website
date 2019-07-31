(() => {
    'use strict';

    fdescribe('the Announcements component', () => {
        let $compile, $log, $q, ctrl, el, mock, networkService, scope;

        mock = {
            announcements: [
                {name: 'name1'},
                {name: 'name2'},
                {name: 'name3'},
            ],
        };

        beforeEach(() => {
            angular.mock.module('chpl.administration', $provide => {
                $provide.decorator('networkService', $delegate => {
                    $delegate.createAnnualSurveillanceReport = jasmine.createSpy('createAnnualSurveillanceReport');

                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.createAnnualSurveillanceReport.and.returnValue($q.when({}));

                scope = $rootScope.$new();
                scope.announcements = mock.announcements;

                el = angular.element('<chpl-announcements announcements="{announcements: announcements}"></chpl-announcements>');

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

            describe('during initiation', () => {
                it('should have constructed stuff', () => {
                    expect(ctrl.$log).toBeDefined();
                });

                it('should do things $onChanges', () => {
                    expect(ctrl.announcements).toBeDefined();
                    expect(ctrl.announcements.length).toBe(3);
                });
            });
        });
    });
})();
