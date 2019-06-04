(() => {
    'use strict';

    fdescribe('the Reports.Announcements component', () => {

        var $compile, $log, $q, ctrl, el, networkService, scope;

        beforeEach(() => {
            angular.mock.module('chpl.reports', $provide => {
                $provide.decorator('networkService', $delegate => {
                    $delegate.getAnnouncementActivity = jasmine.createSpy('getAnnouncementActivity');
                    $delegate.getActivityMetadata = jasmine.createSpy('getActivityMetadata');
                    $delegate.getActivityById = jasmine.createSpy('getActivityById');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;

                networkService = _networkService_;
                networkService.getAnnouncementActivity.and.returnValue($q.when([]));
                networkService.getActivityMetadata.and.returnValue($q.when([]));
                networkService.getActivityById.and.returnValue($q.when({}));

                scope = $rootScope.$new()

                scope = $rootScope.$new()
                el = angular.element('<chpl-reports-announcements></chpl-reports-announcements>');
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
            it('should exist', function () {
                expect(ctrl).toBeDefined();
            });
        });
    });
})();
