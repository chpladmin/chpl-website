;(function () {
    'use strict';

    describe('[app.product module]', function () {

        beforeEach(module('app.product'));

        var $log;
        beforeEach(inject(function (_$log_) {
            $log = _$log_;
        }));
        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.log("\n Debug: " + $log.debug.logs.join("\n Debug: "));
            }
        });

        describe('[product controller]', function () {
            var scope, createController;

            beforeEach(inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();

                createController = function () {
                    return $controller('ProductController', {
                        '$scope': scope
                    });
                };
            }));

            it('should exist', function () {
                var productCtrl = createController();
                expect(productCtrl).toBeDefined();
            });
        });
    });
})();
