(() => {
    'use strict';

    fdescribe('the Surveillance Management component', () => {
        var $compile, $log, $q, ctrl, el, mock, networkService, scope;

        mock = {
            listings: [
                {
                    acb: 'one', developer: 'developer', product: 'product', version: 'version', chplProductNumber: 'cpn', edition: '2015',
                    surveillanceCount: 10, openNonconformityCount: 3, closedNonconformityCount: 5,
                },{
                    acb: 'two', developer: 'developer', product: 'product', version: 'version', chplProductNumber: 'cpn', edition: '2015',
                    surveillanceCount: 10, openNonconformityCount: 3, closedNonconformityCount: 5,
                },{
                    acb: 'three', developer: 'developer', product: 'product', version: 'version', chplProductNumber: 'cpn', edition: '2015',
                    surveillanceCount: 10, openNonconformityCount: 3, closedNonconformityCount: 5,
                },
            ],
            acbs: [{ name: 'two' }],
        };

        beforeEach(() => {
            angular.mock.module('chpl.mock', 'chpl.surveillance', $provide => {
                $provide.decorator('networkService', $delegate => {
                    $delegate.getListing = jasmine.createSpy('getListing');
                    $delegate.search = jasmine.createSpy('search');

                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.getListing.and.returnValue($q.when(mock.listing));
                networkService.search.and.returnValue($q.when([]));

                scope = $rootScope.$new();
                scope.acbs = {acbs: mock.acbs};
                scope.listings = {results: mock.listings};

                el = angular.element('<chpl-surveillance-management allowed-acbs="acbs" listings="listings"></chpl-surveillance-management>');

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

            describe('when prepping data', () => {
                it('should filter out listings without permission', () => {
                    ctrl.allowedAcbs = [{name: 'two'}];
                    expect(mock.listings.filter(l => ctrl.hasPermission(l))).toEqual([mock.listings[1]]);
                });

                it('should format data for display / search', () => {
                    ctrl.allowedAcbs = [{name: 'one'}];
                    ctrl.parse();
                    let expected = [Object.assign({}, mock.listings[0], {
                        mainSearch: 'developer|product|version|cpn',
                        surveillance: '{"surveillanceCount":10,"openNonconformityCount":3,"closedNonconformityCount":5}',
                    })];
                    expect(ctrl.availableListings).toEqual(expected);
                });
            });

            describe('with respect to filters', () => {
                it('should know when any filter has changed', () => {
                    ctrl.categoryChanged = {
                        cat1: false,
                        cat2: false,
                    };
                    expect(ctrl.isCategoryChanged()).toBe(false);
                    ctrl.categoryChanged.cat2 = true;
                    expect(ctrl.isCategoryChanged()).toBe(true);
                });
            });
        });
    });
})();
