(function () {
    'use strict';

    describe('chpl.product.product_history', function () {

        var vm, scope, $log, mock;
        mock = {};
        mock.modalInstance = {
            close: jasmine.createSpy('close'),
            dismiss: jasmine.createSpy('dismiss')
        };

        beforeEach(function () {
            module('chpl.product','chpl.mocks');
            inject(function ($controller, _$log_, $rootScope, product_activity) {
                $log = _$log_;
                mock.activity = product_activity();

                scope = $rootScope.$new();
                vm = $controller('ProductHistoryController', {
                    $scope: scope,
                    $uibModalInstance: mock.modalInstance,
                    activity: mock.activity
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.debug('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        describe('loading', function () {
            it('should know what the activity is', function () {
                expect(vm.activity).toEqual(mock.activity);
            });
        });

        describe('housekeeping', function () {
            it('should exist', function () {
                expect(vm).toBeDefined();
            });

            it('should have a way to close the modal', function () {
                expect(vm.cancel).toBeDefined();
                vm.cancel();
                expect(mock.modalInstance.dismiss).toHaveBeenCalled();
            });
        });

        describe('interpreting the report', function () {
            it('should have an item for certification status changing', function () {
                expect(vm.activity[0].change).toEqual(['Certification Status changed from "Active" to "Suspended by ONC"']);
            });

            it('should have an item for surveillance being added', function () {
                expect(vm.activity[1].change).toEqual(['Surveillance activity was added']);
            });

            it('should have an item for surveillance being updated', function () {
                expect(vm.activity[2].change).toEqual(['Surveillance activity was updated']);
            });

            it('should have an item for when the product was certified', function () {
                expect(vm.activity[3].change).toEqual(['Certified product was uploaded to the CHPL']);
            });

            it('should have an item for surveillance being deleted', function () {
                expect(vm.activity[4].change).toEqual(['Surveillance activity was deleted']);
            });

            it('should have an item for certification criteria being added', function () {
                expect(vm.activity[5].change).toEqual(['Added certification criteria:<ul><li>170.315 (g)(7)</li><li>170.315 (g)(8)</li><li>170.315 (g)(9)</li></ul>']);
            });
        });
    });
})();
