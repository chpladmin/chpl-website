(function () {
    'use strict';

    describe('the Transparency Attestation Collection controller', function () {

        var $log, networkService, scope, vm;

        beforeEach(function () {
            module('chpl.collections', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, $rootScope, _networkService_) {
                $log = _$log_;
                networkService = _networkService_;

                scope = $rootScope.$new();
                vm = $controller('TransparencyAttestationsController', {
                    networkService: networkService,
                    $scope: scope,
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

        describe('transformation function', function () {
            var data;

            it('should return "not available" if no data is provided', function () {
                expect(vm._urlTransform(data)).toBe('Not available');
                data = [];
                expect(vm._urlTransform(data)).toBe('Not available');
            });

            it('should wrap the data in link text and not add http://', function () {
                data = ['http://link'];
                expect(vm._urlTransform(data)).toBe(
                    '<ul class="list-unstyled"><li><a ai-a href="http://link">http://link</a></li></ul>'
                );
            });

            it('should wrap the data in link text and add http://', function () {
                data = ['link'];
                expect(vm._urlTransform(data)).toBe(
                    '<ul class="list-unstyled"><li><a ai-a href="http://link">http://link</a></li></ul>'
                );
            });
        });
    });
})();
