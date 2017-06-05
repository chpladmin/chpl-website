(function () {
    'use strict';

    describe('chpl.decertifications.nonconformities.controller', function () {

        var commonService, scope, vm, $log, $q, Mock;

        beforeEach(function () {
            module('chpl.mock', 'chpl.decertifications', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.getAllNonconformities = jasmine.createSpy('getAllNonconformities');
                    $delegate.getSearchOptions = jasmine.createSpy('getSearchOptions');
                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, _$q_, $rootScope, _Mock_, _commonService_) {
                $log = _$log_;
                $q = _$q_;
                Mock = _Mock_;
                commonService = _commonService_;
                commonService.getAllNonconformities.and.returnValue($q.when({'results': Mock.allNonconformities}));
                commonService.getSearchOptions.and.returnValue($q.when(Mock.search_options));

                scope = $rootScope.$new();
                vm = $controller('NonconformitiesController', {
                    $scope: scope,
                    commonService: commonService
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.log('Debug log, ' + $log.debug.logs.length + ' length:\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        it('should exist', function () {
            expect(vm).toBeDefined();
        });
    });
})();
