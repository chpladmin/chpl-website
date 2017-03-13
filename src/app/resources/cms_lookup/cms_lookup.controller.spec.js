(function () {
    'use strict';

    describe('chpl.cms_lookup', function () {

        var $log, scope, vm;

        beforeEach(function () {
            module('chpl.cms_lookup')

            inject(function ($controller, $rootScope, _$log_) {
                $log = _$log_;

                scope = $rootScope.$new();
                vm = $controller('CmsLookupController', {
                    $scope: scope
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.log('Debug log, ' + $log.debug.logs.length + ' length:\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        describe('controller', function () {
            it('should exist', function () {
                expect(vm).toBeDefined();
            });
        });
    });
})();
