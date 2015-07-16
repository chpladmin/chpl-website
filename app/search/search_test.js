;(function () {
    'use strict';

    describe('[app.search module]', function () {

        beforeEach(module('app.search'));

        var $log;
        beforeEach(inject(function (_$log_) {
            $log = _$log_;
        }));
        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.log("\n Debug: " + $log.debug.logs.join("\n Debug: "));
            }
        });

        describe('[search controller]', function () {
            var scope, createController;

            beforeEach(inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();

                createController = function () {
                    return $controller('SearchController', {
                        '$scope': scope
                    });
                };
            }));

            it('should exist', function () {
                var searchCtrl = createController();
                expect(searchCtrl).toBeDefined();
            });

            it('should have a method to search', function () {
                var controller = createController();
                expect(controller.search).toBeDefined();
            });

            it('should know if it has results', function () {
                var controller = createController();
                expect(controller.hasResults).toBeDefined;
            });
        });
    });
})();
