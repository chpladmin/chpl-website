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
                expect(angular.isFunction(controller.search)).toBe(true);
            });

            it('should know if it has results', function () {
                var controller = createController();
                expect(angular.isFunction(controller.hasResults)).toBe(true);
                expect(controller.hasResults()).toBe(false);
                controller.search();
                expect(controller.hasResults()).toBe(true);
            });
        });

        describe('[search services]', function () {
            var searchService;

            beforeEach(inject(function (_searchService_) {
                searchService = _searchService_;
            }));

            it('should return results when searched', function () {
                /*
                searchService.search().then(function(results) {
                    expect(results.size()).toBeGreaterThan(1);
                });
                */
                expect(searchService.search().length).toBeGreaterThan(1);
            });
        });
    });
})();
