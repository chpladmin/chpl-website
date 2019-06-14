(() => {
    'use strict';

    describe('the Reports.ApiKeys component', () => {

        var $compile, $log, $q, ctrl, el, networkService, scope;

        beforeEach(() => {
            angular.mock.module('chpl.mock', 'chpl.admin', $provide => {
                $provide.decorator('networkService', $delegate => {
                    $delegate.getActivityMetadata = jasmine.createSpy('getActivityMetadata');
                    $delegate.getActivityById = jasmine.createSpy('getActivityById');
                    $delegate.getApiUserActivity = jasmine.createSpy('getApiUserActivity');
                    return $delegate;
                });
            });

            inject((_$compile_, $controller, _$log_, _$q_, $rootScope, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;

                networkService = _networkService_;
                networkService.getActivityMetadata.and.returnValue($q.when([]));
                networkService.getActivityById.and.returnValue($q.when({}));
                networkService.getApiUserActivity.and.returnValue($q.when([]));

                scope = $rootScope.$new()

                el = angular.element('<ai-reports></ai-reports');

                scope = $rootScope.$new()
                el = angular.element('<chpl-reports-api-keys></chpl-reports-api-keys>');
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
