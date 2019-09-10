(function () {
    'use strict';

    describe('the ICS Family Detail Modal controller', function () {

        var $log, Mock, mock, scope, vm;

        mock = {
            listing: {
                id: 3,
            },
        };

        beforeEach(function () {
            angular.mock.module('chpl.mock', 'chpl.components');
            inject(function ($controller, _$log_, $rootScope, _Mock_) {
                $log = _$log_;
                Mock = _Mock_;

                scope = $rootScope.$new();
                vm = $controller('IcsFamilyDetailController', {
                    active: true,
                    listing: mock.listing,
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
            expect(Mock.modalInstance.close).toHaveBeenCalledWith('closed');
        });

        describe('when navigating', function () {
            it('should close the modal', function () {
                vm.navigate();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith('navigated');
            });
        });
    });
})();
