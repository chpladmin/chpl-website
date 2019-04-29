import {getActivity, getMetadata} from './history.mock';

(() => {
    'use strict';

    describe('the Reports.ATLs component', () => {
        var $compile, $log, $q, ctrl, el, networkService, scope;

        beforeEach(() => {
            angular.mock.module('chpl', 'chpl.mock', 'chpl.reports', $provide => {
                $provide.decorator('networkService', $delegate => {
                    $delegate.getActivityById = jasmine.createSpy('getActivityById');
                    $delegate.getActivityMetadata = jasmine.createSpy('getActivityMetadata');
                    return $delegate;
                });
            });

            inject((_$compile_, $controller, _$log_, _$q_, $rootScope, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.getActivityById.and.callFake(id => $q.when(getActivity(id)));
                networkService.getActivityMetadata.and.returnValue($q.when(getMetadata('atl')));

                scope = $rootScope.$new()

                el = angular.element('<chpl-reports-atls></chpl-reports-atls>');

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
            it('should be compiled', () => {
                expect(ctrl).toBeDefined();
            });

            describe('when loading', () => {
                it('should get activity from the network', () => {
                    expect(networkService.getActivityMetadata).toHaveBeenCalledWith('atls');
                });
            });
        });
    });
})();
