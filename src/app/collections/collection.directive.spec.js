(function () {
    'use strict';

    describe('chpl.collection.directive', function () {
        var el, scope, $log, $q, commonService, vm;

        beforeEach(function () {
            module('chpl.mock', 'chpl.templates', 'chpl.collections', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.getCollection = jasmine.createSpy('getCollection');

                    return $delegate;
                });
            });

            inject(function ($compile, $controller, _$log_, _$q_, $rootScope, _commonService_) {
                $log = _$log_;
                $q = _$q_;
                commonService = _commonService_;
                commonService.getCollection.and.returnValue($q.when({results: []}));

                el = angular.element('<ai-collection body-text="bodyText" columns="columns" filter="filter"></ai-collection>');

                scope = $rootScope.$new();
                scope.bodyText = 'This is my body text';
                scope.columns = [];
                scope.filter = jasmine.any(Function);
                $compile(el)(scope);
                scope.$digest();
                vm = el.isolateScope().vm;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + angular.toJson($log.debug.logs));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('loading', function () {
            it('should be compiled', function () {
                expect(el.html()).not.toEqual(null);
            });

            it('should exist', function () {
                expect(vm).toBeDefined();
            });
        });
    });
})();
