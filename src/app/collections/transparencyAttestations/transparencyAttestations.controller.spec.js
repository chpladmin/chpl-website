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

            it('should wrap the data in link text', function () {
                data = ['link'];
                expect(vm._urlTransform(data)).toBe(
                    '<ul>' +
                        '<li><a href="link">link' +
                        '<a href="http://www.hhs.gov/disclaimer.html" title="Web Site Disclaimers" class="pull-right">' +
                        '<i class="fa fa-external-link"></i>' +
                        '<span class="sr-only">Web Site Disclaimers</span>' +
                        '</a>' +
                        '</a></li>' +
                        '</ul>'
                );
            });
        });
    });
})();
