(function () {
    'use strict';

    describe('the Fuzzy Types Edit controller', function () {
        var $log, $q, Mock, mock, networkService, scope, vm;

        mock = {
            fuzzyType: { id: 1, fuzzyType: 'a type', choices: [1,2] },
        };

        beforeEach(function () {
            module('chpl.mock', 'chpl.admin', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.updateFuzzyType = jasmine.createSpy('updateFuzzyType');
                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, _$q_, $rootScope, _Mock_, _authService_, _networkService_) {
                $log = _$log_;
                Mock = _Mock_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.updateFuzzyType.and.returnValue($q.when({status: 200}));

                scope = $rootScope.$new();
                vm = $controller('FuzzyEditController', {
                    fuzzyType: mock.fuzzyType,
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
            expect(vm.cancel).toBeDefined();
            vm.cancel();
            expect(Mock.modalInstance.dismiss).toHaveBeenCalled();
        });

        describe('when saving the fuzzy type', function () {
            it('should call the common service', function () {
                vm.save();
                scope.$digest();
                expect(networkService.updateFuzzyType).toHaveBeenCalled();
            });

            it('should close the modal', function () {
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalled();
            });

            it('should dismiss the modal on error', function () {
                networkService.updateFuzzyType.and.returnValue($q.when({status: 500}));
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalled();
            });

            it('should dismiss the modal on error', function () {
                networkService.updateFuzzyType.and.returnValue($q.reject({data: {error: 'bad thing'}}));
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('bad thing');
            });
        });
    });
})();
