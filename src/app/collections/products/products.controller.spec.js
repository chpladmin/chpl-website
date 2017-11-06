(function () {
    'use strict';

    describe('chpl.collections.products.controller', function () {

        var $log, $q, mock, networkService, scope, vm;
        mock = {
            muuAccurateAsOfDate: (new Date('2017-01-13')).getTime(),
        };

        beforeEach(function () {
            module('chpl.collections', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getMeaningfulUseUsersAccurateAsOfDate = jasmine.createSpy('getMeaningfulUseUsersAccurateAsOfDate');
                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, _$q_, $rootScope, _networkService_) {
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.getMeaningfulUseUsersAccurateAsOfDate.and.returnValue($q.when({accurateAsOfDate: mock.muuAccurateAsOfDate}));

                scope = $rootScope.$new();
                vm = $controller('DecertifiedProductsController', {
                    $scope: scope,
                    networkService: networkService,
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

        it('should know what the muu_accurate_as_of_date is', function () {
            expect(vm.muuAccurateAsOf).toEqual(mock.muuAccurateAsOfDate);
        });
    });
})();
