(() => {
    'use strict';

    fdescribe('the Versions component', () => {
        var $compile, $log, $q, authService, ctrl, el, mock, networkService, scope;

        mock = {
            developer: {
                developerId: 'developerId',
                status: {
                    status: 'Active',
                },
            },
            product: {
                productId: 'productId',
                name: 'a product',
            },
            version: {
                versionId: 636, version: 'V1.', lastModifiedDate: null,
            },
            versions: [
                { versionId: 636, version: 'a version' },
                { versionId: 637, version: 'a version' },
            ],
            listings: [
                { name: 'a listing' },
            ],
        };

        beforeEach(() => {
            angular.mock.module('chpl', 'chpl.organizations', $provide => {
                $provide.decorator('authService', $delegate => {
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');
                    return $delegate;
                });
                $provide.decorator('networkService', $delegate => {
                    $delegate.updateVersion = jasmine.createSpy('updateVersion');
                    return $delegate;
                });
                $provide.decorator('chplVersionsDirective', $delegate => {
                    $delegate[0].terminal = true;
                    return $delegate;
                });
                $provide.decorator('chplDeveloperDirective', $delegate => {
                    $delegate[0].controller = class {};
                    $delegate[0].terminal = true;
                    $delegate[0].template = '';
                    $delegate[0].templateUrl = undefined;
                    return $delegate;
                });
                $provide.decorator('chplProductDirective', $delegate => {
                    $delegate[0].controller = class {};
                    $delegate[0].terminal = true;
                    $delegate[0].template = '';
                    $delegate[0].templateUrl = undefined;
                    return $delegate;
                });
            });
            inject((_$compile_, _$log_, _$q_, $rootScope, _authService_, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                authService = _authService_;
                authService.hasAnyRole.and.returnValue(true);
                networkService = _networkService_;
                networkService.updateVersion.and.returnValue($q.when({}));

                scope = $rootScope.$new();
                scope.developer = mock.developer;
                scope.product = mock.product;
                scope.version = mock.version;
                scope.versions = mock.versions;
                scope.listings = mock.listings;

                el = angular.element('<chpl-versions developer="developer" product="product" version="version" versions="versions" listings="listings"></chpl-versions>');

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

            describe('on change/init', () => {
                it('should make copies of inputs', () => {
                    expect(ctrl.developer).not.toBe(mock.developer);
                    expect(ctrl.developer).toEqual(mock.developer);
                    expect(ctrl.product).not.toBe(mock.product);
                    expect(ctrl.product).toEqual(mock.product);
                    expect(ctrl.version).not.toBe(mock.version);
                    expect(ctrl.version).toEqual(mock.version);
                    expect(ctrl.listings).not.toBe(mock.listings);
                    expect(ctrl.listings).toEqual(mock.listings);
                });

                it('should split versions for merging', () => {
                    expect(ctrl.versions).toEqual([mock.versions[1]]);
                    expect(ctrl.mergingVersions).toEqual([mock.versions[0]]);
                });

                it('should make backups of things that can be changed', () => {
                    expect(ctrl.backup.version).toEqual(mock.version);
                    expect(ctrl.backup.versions).toEqual([mock.versions[1]]);
                    expect(ctrl.backup.mergingVersions).toEqual([mock.versions[0]]);
                });

                it('shouldn\'t change anything that shouldn\'t change', () => {
                    // save old state
                    let developer = ctrl.developer;
                    let product = ctrl.product;
                    let version = ctrl.version;
                    let listings = ctrl.listings;
                    let versions = ctrl.version;
                    let mergingVersions = ctrl.mergingVersions;

                    // make changes
                    ctrl.$onChanges({});

                    //assert
                    expect(developer).toBe(ctrl.developer);
                    expect(product).toBe(ctrl.product);
                    expect(version).toBe(ctrl.version);
                    expect(listings).toBe(ctrl.listings);
                    expect(versions).toBe(ctrl.version);
                    expect(mergingVersions).toBe(ctrl.mergingVersions);
                });
            });

            describe('when determining who can do what', () => {
                it('should let ADMIN & ONC do everything', () => {
                    expect(ctrl.can('edit')).toBe(true);
                    expect(ctrl.can('merge')).toBe(true);
                });

                it('should not let anyone other than ADMIN or ONC do anything', () => {
                    authService.hasAnyRole.and.returnValue(false);
                    expect(ctrl.can('edit')).toBe(false);
                    expect(ctrl.can('merge')).toBe(false);
                });

                it('should let ACBs edit if developer is active', () => {
                    authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ACB') >= 0)
                    expect(ctrl.can('edit')).toBe(true);
                    expect(ctrl.can('merge')).toBe(false);
                });

                it('should not let ACBs edit if developer is active', () => {
                    ctrl.developer.status.status = 'Suspended by ONC';
                    authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ACB') >= 0)
                    expect(ctrl.can('edit')).toBe(false);
                    expect(ctrl.can('merge')).toBe(false);
                });
            });

            describe('when cancelling', () => {
                it('should restore things', () => {
                    ctrl.version = 'fake';
                    ctrl.versions = [];
                    ctrl.mergingVersions = [];
                    ctrl.action = 'do something'
                    ctrl.cancel();
                    expect(ctrl.backup.version).toEqual(mock.version);
                    expect(ctrl.backup.versions).toEqual([mock.versions[1]]);
                    expect(ctrl.backup.mergingVersions).toEqual([mock.versions[0]]);
                    expect(ctrl.action).toBeUndefined();
                });
            });

            describe('when handling actions', () => {
                it('should cancel and take action', () => {
                    spyOn(ctrl, 'cancel').and.callThrough();
                    ctrl.action = 'before';
                    ctrl.takeAction('after');
                    expect(ctrl.cancel).toHaveBeenCalled();
                    expect(ctrl.action).toBe('after');
                });

                it('should take developer action', () => {
                    spyOn(ctrl.$state, 'go').and.returnValue(null);
                    ctrl.takeDeveloperAction();
                    expect(ctrl.$state.go).toHaveBeenCalledWith('organizations.developers', {
                        action: undefined,
                        developerId: 'developerId',
                    });
                });

                it('should take product action', () => {
                    spyOn(ctrl.$state, 'go').and.returnValue(null);
                    ctrl.takeProductAction();
                    expect(ctrl.$state.go).toHaveBeenCalledWith('organizations.developers.products', {
                        action: undefined,
                        productId: 'productId',
                    });
                });

                it('should take listing action', () => {
                    spyOn(ctrl.$state, 'go').and.returnValue(null);
                    ctrl.takeListingAction('listingId');
                    expect(ctrl.$state.go).toHaveBeenCalledWith('listing', {
                        id: 'listingId',
                    });
                });
            });

            describe('while handling merges', () => {
                it('should handle adding a version to the merge', () => {
                    ctrl.toggleMerge(mock.versions[1], true);
                    expect(ctrl.versions).toEqual([]);
                    expect(ctrl.mergingVersions.length).toBe(2);
                });

                it('should handle removing a version from the merge', () => {
                    ctrl.toggleMerge(mock.versions[0], false);
                    expect(ctrl.mergingVersions).toEqual([]);
                    expect(ctrl.versions.length).toBe(2);
                });
            });

            describe('when saving', () => {
                /*
                 * Todo: figure out what the actual responses are to a save and handle them correctly
                 */

                describe('an edit', () => {
                    let newVersion = { versionId: 'newId', version: 'newVersion' };

                    it('should call the network service', () => {
                        ctrl.action = 'edit';
                        ctrl.save(newVersion);
                        expect(networkService.updateVersion).toHaveBeenCalledWith({
                            version: newVersion,
                            versionIds: [636],
                            newProductId: 'productId',
                        });
                    });
                });

                describe('a merge', () => {
                    let newVersion = { versionId: 'newId', version: 'newVersion' };

                    it('should call the network service', () => {
                        ctrl.action = 'merge';
                        ctrl.toggleMerge(mock.versions[1], true);
                        ctrl.save(newVersion);
                        expect(networkService.updateVersion).toHaveBeenCalledWith({
                            version: newVersion,
                            versionIds: [636, 637],
                            newProductId: 'productId',
                        });
                    });
                });
            });
        });
    });
})();
