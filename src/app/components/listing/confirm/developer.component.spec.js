(() => {
    'use strict';

    describe('the Developer Confirmation component', () => {
        let $compile, $log, $q, ctrl, el, mock, networkService, scope;

        mock = {
            listing: {
                developer: {
                    developerId: 1,
                    website: 'http://www.example.com',
                    address: {
                        line1: 'line 1',
                    },
                    contact: {
                        fullName: undefined,
                    },
                },
                transparencyAttestation: 'Affirmative',
                certifyingBody: {
                    code: '04',
                    name: 'Drummond Group',
                    id: 3,
                },
            },
            developer: {
                website: 'https://www.example.com',
                address: {
                    line1: undefined,
                },
                contact: {
                    fullName: 'a name',
                },
            },
            developers: [{
                name: 'a',
                developerId: 1,
            }],
        };

        beforeEach(() => {
            angular.mock.module('chpl.components', $provide => {
                $provide.decorator('networkService', $delegate => {
                    $delegate.updateDeveloper = jasmine.createSpy('updateDeveloper');

                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.updateDeveloper.and.returnValue($q.when({}));

                scope = $rootScope.$new();
                scope.developers = mock.developers;
                scope.pending = mock.developer;
                scope.uploaded = mock.listing.developer;

                el = angular.element('<chpl-confirm-developer developer="developers" pending="pending" uploaded="uploaded"></chpl-confirm-developer>');
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

            describe('when saving new developer', () => {
                it('should call the network service', () => {
                    ctrl.pending = angular.copy(ctrl.uploaded);
                    ctrl.saveConfirmingDeveloper();
                    scope.$digest();
                    expect(networkService.updateDeveloper).toHaveBeenCalled();
                });
            });

            describe('when parsing differences', () => {
                it('should know when something was added', () => {
                    expect(ctrl.uploaded.styles.line1).toBe('confirm__item--added');
                });

                it('should know when something was removed', () => {
                    expect(ctrl.pending.styles.fullName).toBe('confirm__item--removed');
                });

                it('should know when something was modified', () => {
                    expect(ctrl.pending.styles.website).toBe('confirm__item--modified');
                    expect(ctrl.uploaded.styles.website).toBe('confirm__item--modified');
                });
            });
        });
    });
})();
