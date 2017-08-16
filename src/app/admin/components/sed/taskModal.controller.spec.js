(function () {
    'use strict';

    describe('the Edit SED Task Modal controller', function () {
        var $log, Mock, scope, vm;

        beforeEach(function () {
            module('chpl', 'chpl.admin', 'chpl.mock', 'chpl.templates');

            inject(function ($controller, _$log_, $rootScope, _Mock_) {
                $log = _$log_;
                Mock = _Mock_;

                scope = $rootScope.$new();
                vm = $controller('EditSedTaskController', {
                    criteria: [],
                    task: {},
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

        describe('when saving the task', function () {
            it('should return the modal with the task', function () {
                var aTask = {id: 1};
                vm.task = aTask;
                vm.save();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({
                    task: aTask,
                });
            });
        });
    });
})();
