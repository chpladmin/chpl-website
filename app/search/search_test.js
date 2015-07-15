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
                expect(controller.hasResults).toBeDefined;
            });
        });

        describe('[search services]', function () {
            var searchService, $httpBackend, $q, $rootScope;

            beforeEach(inject(function (_searchService_, _$httpBackend_, _$q_, _$rootScope_) {
                searchService = _searchService_;
                $httpBackend = _$httpBackend_;
                $q = _$q_;
                $rootScope = _$rootScope_;

                $httpBackend.whenGET('http://ainq.com/search?q=all').respond([1, 2, 3]);
            }));

            afterEach(function() {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            it('should return a promise', function () {
                $httpBackend.expectGET('http://ainq.com/search?q=all');
                expect(searchService.search('all').then).toBeDefined();
                $httpBackend.flush();
            });

            it('should resolve with [something]', function () {
                searchService.search('all').then(function(response) {
                    expect(response).toEqual([1, 2, 3]);
                });
                $httpBackend.flush();
            });

        });
    });
})();
