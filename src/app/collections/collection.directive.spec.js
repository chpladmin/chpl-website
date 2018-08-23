(function () {
    'use strict';

    describe('the Collections', function () {
        var $log, $q, el, networkService, scope, vm;

        beforeEach(function () {
            angular.mock.module('chpl.mock', 'chpl.collections', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getCollection = jasmine.createSpy('getCollection');

                    return $delegate;
                });
            });

            inject(function ($compile, $controller, _$log_, _$q_, $rootScope, _networkService_) {
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.getCollection.and.returnValue($q.when({results: []}));

                el = angular.element('<ai-collection collection-key="key" columns="columns" filters="filters" refine-model="refineModel"><ai-body-text>This is body text</ai-body-text><ai-title>Title</ai-title></ai-collection>');

                scope = $rootScope.$new();
                scope.columns = [];
                scope.filters = [];
                scope.refineModel = {};
                $compile(el)(scope);
                scope.$digest();
                vm = el.isolateScope().vm;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('directive', function () {
            it('should be compiled', function () {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', function () {
            it('should exist', function () {
                expect(vm).toBeDefined();
            });

            describe('when figuring out if filters have changed', function () {
                it('should report true if any filter has changes', function () {
                    vm.filters = ['acb', 'atl'];
                    vm.categoryChanged = {
                        acb: false,
                        atl: true,
                    };
                    expect(vm.isCategoryChanged()).toBe(true);
                });
            });
        });
    });
})();
