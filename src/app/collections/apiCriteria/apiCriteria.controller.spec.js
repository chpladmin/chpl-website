(function () {
    'use strict';

    describe('chpl.collections.apiCollection.controller', function () {

        var commonService, scope, vm, $log;

        beforeEach(function () {
            module('chpl.mock', 'chpl.collections', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, $rootScope, _commonService_) {
                $log = _$log_;
                commonService = _commonService_;

                scope = $rootScope.$new();
                vm = $controller('ApiCriteriaController', {
                    $scope: scope,
                    commonService: commonService,
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
