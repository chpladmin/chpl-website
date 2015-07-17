;(function () {
    'use strict';

    describe('[app.compare module]', function () {

        beforeEach(module('app.compare'));

        var $log;
        beforeEach(inject(function (_$log_) {
            $log = _$log_;
        }));
        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.log("\n Debug: " + $log.debug.logs.join("\n Debug: "));
            }
        });

        describe('[compare controller]', function () {
            var scope, createController;

            beforeEach(inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();

                createController = function () {
                    return $controller('CompareController', {
                        '$scope': scope
                    });
                };
            }));

            it('should exist', function () {
                var compareCtrl = createController();
                expect(compareCtrl).toBeDefined();
            });
        });
    });
})();
