(function () {
    'use strict';

    describe('chpl.collections.apiCollection.controller', function () {

        var commonService, scope, vm, $log, $q, Mock, mock;

        beforeEach(function () {
            module('chpl.mock', 'chpl.collections', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, _$q_, $rootScope, _Mock_, _commonService_) {
                $log = _$log_;
                $q = _$q_;
                Mock = _Mock_;
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
