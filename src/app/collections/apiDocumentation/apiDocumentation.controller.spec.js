(function () {
    'use strict';

    describe('chpl.collections.apiDocumentation.controller', function () {

        var $log, networkService, scope, vm;

        beforeEach(function () {
            angular.mock.module('chpl.mock', 'chpl.collections', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, $rootScope, _networkService_) {
                $log = _$log_;
                networkService = _networkService_;

                scope = $rootScope.$new();
                vm = $controller('ApiDocumentationController', {
                    $scope: scope,
                    networkService: networkService,
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        it('should exist', function () {
            expect(vm).toBeDefined();
        });

        describe('transforming API Documentation data', function () {
            it('should return "Unknown" if no data', function () {
                var data;
                expect(vm.apiTransform(data)).toBe('Unknown');
            });

            it('should create a list of three elements if the APIs are all different', function () {
                var data = '170.315 (g)(7)☹http://example1.com☺170.315 (g)(8)☹http://example2.com☺170.315 (g)(9)☹http://example3.com';
                expect(vm.apiTransform(data)).toBe('<dl><dt>170.315 (g)(7)</dt><dd><a ai-a href="http://example1.com">http://example1.com</a></dd><dt>170.315 (g)(8)</dt><dd><a ai-a href="http://example2.com">http://example2.com</a></dd><dt>170.315 (g)(9)</dt><dd><a ai-a href="http://example3.com">http://example3.com</a></dd></dl>');
            });

            it('should combine elements a list of three elements if the APIs the same', function () {
                var data = '170.315 (g)(7)☹http://example1.com☺170.315 (g)(8)☹http://example1.com☺170.315 (g)(9)☹http://example1.com';
                expect(vm.apiTransform(data)).toBe('<dl><dt>170.315 (g)(7), 170.315 (g)(8), 170.315 (g)(9)</dt><dd><a ai-a href="http://example1.com">http://example1.com</a></dd></dl>');
            });

            it('should only have one element if only one api link', function () {
                var data = '170.315 (g)(7)☹http://example1.com☺170.315 (g)(8)☺170.315 (g)(9)☹';
                expect(vm.apiTransform(data)).toBe('<dl><dt>170.315 (g)(7)</dt><dd><a ai-a href="http://example1.com">http://example1.com</a></dd></dl>');
            });
        });

        describe('transforming Mandatory Disclosures data', function () {
            it('should return "Unknown" if no data', function () {
                var data;
                expect(vm.disclosuresTransform(data)).toBe('Unknown');
            });

            it('should a link for the data', function () {
                var data = 'http://example.com';
                expect(vm.disclosuresTransform(data)).toBe('<a ai-a href="http://example.com">http://example.com</a>');
            });
        });
    });
})();
