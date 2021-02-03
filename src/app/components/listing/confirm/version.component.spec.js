(() => {
    'use strict';

    describe('the Version Confirmation component', () => {
        let $compile, $log, $q, ctrl, el, mock, networkService, scope;

        mock = {
            listing: {
                version: {
                    versionId: 1,
                    version: 'a version',
                },
            },
            version: {
                version: 'a version',
            },
            versions: [{
                version: 'a version',
                versionId: 1,
            }],
        };

        beforeEach(() => {
            angular.mock.module('chpl.components', $provide => {
                $provide.decorator('networkService', $delegate => {
                    $delegate.getVersionsByDeveloper = jasmine.createSpy('getVersionsByDeveloper');
                    $delegate.getVersion = jasmine.createSpy('getVersion');
                    $delegate.updateVersion = jasmine.createSpy('updateVersion');

                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.getVersionsByDeveloper.and.returnValue($q.when({}));
                networkService.getVersion.and.returnValue($q.when({}));
                networkService.updateVersion.and.returnValue($q.when({}));

                scope = $rootScope.$new();
                scope.versions = mock.versions;
                scope.pending = mock.version;
                scope.uploaded = mock.listing.version;

                el = angular.element('<chpl-confirm-version version="versions" pending="pending" uploaded="uploaded"></chpl-confirm-version>');
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

            describe('when saving new version', () => {
                it('should call the network service', () => {
                    ctrl.pending = angular.copy(ctrl.uploaded);
                    ctrl.saveConfirmingVersion();
                    scope.$digest();
                    expect(networkService.updateVersion).toHaveBeenCalled();
                });
            });
        });
    });
})();
