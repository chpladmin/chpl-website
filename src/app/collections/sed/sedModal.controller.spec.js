(function () {
    'use strict';

    describe('the SED Collections Detail View controller', function () {
        var $log, $q, Mock, networkService, scope, vm;

        beforeEach(function () {
            angular.mock.module('chpl', 'chpl.mock', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getProduct = jasmine.createSpy('getProduct');

                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, _$q_, $rootScope, _Mock_, _networkService_) {
                $log = _$log_;
                Mock = _Mock_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.getProduct.and.returnValue($q.when({id: 3}));

                scope = $rootScope.$new();
                vm = $controller('ViewSedModalController', {
                    id: 3,
                    $uibModalInstance: Mock.modalInstance,
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

        it('should have a way to close it\'s own modal', function () {
            expect(vm.close).toBeDefined();
            vm.close();
            expect(Mock.modalInstance.close).toHaveBeenCalled();
        });

        it('should call the network service to get listing details', function () {
            expect(networkService.getProduct).toHaveBeenCalledWith(3);
        });

        it('should have the details as an object', function () {
            expect(vm.listing).toEqual({id: 3});
        });
    });
})();
