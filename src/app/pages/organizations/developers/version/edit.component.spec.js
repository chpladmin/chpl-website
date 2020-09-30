(() => {
    'use strict';

    describe('the Versions Edit component', () => {
        var $compile, $log, $q, $rootScope, ctrl, el, mock, networkService, scope;

        mock = {
            version: {
                name: 'a version',
            },
            stateParams: {
                developerId: 22,
                productId: 42,
                versionId: 32,
            },
        };

        beforeEach(() => {
            angular.mock.module('chpl.organizations', $provide => {
                $provide.factory('$stateParams', () => mock.stateParams);
                $provide.factory('chplVersionEditDirective', () => ({}));
                $provide.decorator('networkService', $delegate => {
                    $delegate.getVersion = jasmine.createSpy('getVersion');
                    return $delegate;
                });
            });
            inject((_$compile_, _$log_, _$q_, _$rootScope_, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                networkService = _networkService_;
                networkService.getVersion.and.returnValue($q.when(mock.version));

                scope = $rootScope.$new();

                el = angular.element('<chpl-versions-edit></chpl-versions-edit>');

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

            describe('during initialization', () => {
                it('should get data', () => {
                    expect(networkService.getVersion.calls.count()).toBe(1);
                });
            });
        });
    });
})();
