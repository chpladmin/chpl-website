(() => {
    'use strict';

    describe('the version inspection component', () => {
        let $compile, $log, $q, ctrl, el, mock, networkService, scope;

        mock = {
            availableVersions: [
                { versionId: 3 },
            ],
            foundVersion: {
                version: 'found',
                versionId: 8,
            },
            newVersion: {
                version: 'version value',
            },
            systemVersion: {
                version: 'system',
                versionId: 4,
                lastModifiedDate: 33939,
            },
            foundProduct: {
                productId: 2,
            },
            newProduct: {
            },
        };

        beforeEach(() => {
            angular.mock.module('chpl.components', $provide => {
                $provide.decorator('networkService', $delegate => {
                    $delegate.getVersionsByProduct = jasmine.createSpy('getVersionsByProduct');
                    $delegate.getVersion = jasmine.createSpy('getVersion');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.getVersionsByProduct.and.returnValue($q.when(mock.availableVersions));
                networkService.getVersion.and.returnValue($q.when(mock.systemVersion));

                scope = $rootScope.$new();

                el = angular.element('<ai-inspect-version></ai-inspect-version>');
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

        describe('controller', () => {
            it('should exist', () => {
                expect(ctrl).toBeDefined();
            });

            describe('when a product and version exist', () => {
                beforeEach(() => {
                    scope.pendingVersion = mock.foundVersion;
                    scope.product = mock.foundProduct;

                    el = angular.element('<ai-inspect-version pending-version="pendingVersion" product="product"></ai-inspect-version>');
                    $compile(el)(scope);
                    scope.$digest();
                    ctrl = el.isolateScope().$ctrl;
                });

                it('should know to allow for choice of a version', () => {
                    expect(ctrl.choice).toBe('choose');
                });

                it('should know what the bindings are, and break them from the original', () => {
                    expect(ctrl.pendingVersion).not.toBe(mock.foundVersion);
                    expect(ctrl.pendingVersion).toEqual(mock.foundVersion);
                    expect(ctrl.product).not.toBe(mock.foundProduct);
                    expect(ctrl.product).toEqual(mock.foundProduct);
                });

                it('should get versions based on found product', () => {
                    expect(networkService.getVersionsByProduct).toHaveBeenCalledWith(mock.foundProduct.productId);
                    expect(ctrl.availableVersions).toEqual(mock.availableVersions);
                });

                it('should get version data based on found version', () => {
                    expect(networkService.getVersion).toHaveBeenCalledWith(mock.foundVersion.versionId);
                    expect(ctrl.systemVersion).toEqual(mock.systemVersion);
                });
            });

            describe('when there\'s no product id', () => {
                beforeEach(() => {
                    scope.pendingVersion = mock.newVersion;
                    scope.product = mock.newProduct;

                    el = angular.element('<ai-inspect-version pending-version="pendingVersion" product="product"></ai-inspect-version>');
                    $compile(el)(scope);
                    scope.$digest();
                    ctrl = el.isolateScope().$ctrl;
                });

                it('should know to create a new version', () => {
                    expect(ctrl.choice).toBe('create');
                });

                it('should not get available versions', () => {
                    expect(networkService.getVersionsByProduct).not.toHaveBeenCalled();
                    expect(ctrl.availableVersions).toBeUndefined();
                });

                it('should not get the system version', () => {
                    expect(networkService.getVersion).not.toHaveBeenCalled();
                    expect(ctrl.systemVersion).toBeUndefined();
                });
            });

            describe('when selecting a version', () => {
                let selectSpy;

                beforeEach(() => {
                    selectSpy = jasmine.createSpy('selectSpy');
                    scope.pendingVersion = mock.foundVersion;
                    scope.product = mock.foundProduct;
                    scope.selectSpy = selectSpy;

                    el = angular.element('<ai-inspect-version pending-version="pendingVersion" product="product" on-select="selectSpy(versionId)"></ai-inspect-version>');

                    $compile(el)(scope);
                    scope.$digest();
                    ctrl = el.isolateScope().$ctrl;
                });

                it('should have an onChange function', () => {
                    expect(typeof(ctrl.onSelect)).toEqual('function');
                });

                it('should call the spy', () => {
                    ctrl.onSelect();
                    expect(selectSpy).toHaveBeenCalled();
                });

                it('should set the pendingVersion id', () => {
                    ctrl.versionSelect = { versionId: 323 };
                    ctrl.select();
                    expect(ctrl.pendingVersion.versionId).toBe(323);
                });

                it('should call the callback function', () => {
                    ctrl.versionSelect = { versionId: 33 };
                    ctrl.select();
                    expect(selectSpy).toHaveBeenCalledWith(33);
                });

                it('should update the systemVersion', () => {
                    const callCount = networkService.getVersion.calls.count();
                    ctrl.versionSelect = { versionId: 33 };
                    ctrl.select();
                    scope.$digest();
                    expect(networkService.getVersion.calls.count()).toBe(callCount + 1);
                });
            });
        });
    });
})();
