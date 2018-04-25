(function () {
    'use strict';

    describe('the Listing History popup controller', function () {

        var $location, $log, mock, scope, vm;
        mock = {};
        mock.modalInstance = {
            close: jasmine.createSpy('close'),
            dismiss: jasmine.createSpy('dismiss'),
        };

        beforeEach(function () {
            module('chpl.product','chpl.mock');
            inject(function ($controller, _$location_, _$log_, $rootScope, product_activity) {
                $location = _$location_;
                $log = _$log_;
                mock.activity = product_activity();

                scope = $rootScope.$new();
                vm = $controller('ProductHistoryController', {
                    $scope: scope,
                    $uibModalInstance: mock.modalInstance,
                    activity: mock.activity,
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

        it('should have a way to close the modal', function () {
            expect(vm.cancel).toBeDefined();
            vm.cancel();
            expect(mock.modalInstance.dismiss).toHaveBeenCalled();
        });

        it('should have a way to go to the API page', function () {
            spyOn($location, 'path');
            vm.goToApi();
            expect($location.path).toHaveBeenCalledWith('/resources/chpl_api');
        });

        it('should close the modal on navigation', function () {
            spyOn(vm, 'cancel');
            vm.goToApi();
            expect(vm.cancel).toHaveBeenCalled();
        });

        describe('when loading', function () {
            it('should know what the Listing id is', function () {
                expect(vm.listingId).toBe(6993);
            });
        });

        fdescribe('when interpreting the report', function () {
            it('should have an item for surveillance being added', function () {
                expect(vm.activity[0].change).toEqual(['Surveillance activity was added']);
            });

            it('should have an item for surveillance being updated', function () {
                expect(vm.activity[1].change).toEqual(['Surveillance activity was updated']);
            });

            it('should have an item for when the product was certified', function () {
                expect(vm.activity[2].change).toEqual(['Certified product was uploaded to the CHPL']);
            });

            it('should have an item for surveillance being deleted', function () {
                expect(vm.activity[3].change).toEqual(['Surveillance activity was deleted']);
            });

            it('should have an item for certification criteria being added', function () {
                expect(vm.activity[4].change).toEqual(['Added certification criteria:<ul><li>170.315 (g)(7)</li><li>170.315 (g)(8)</li><li>170.315 (g)(9)</li></ul>']);
            });

            it('should have an item for certification status changing', function () {
                expect(vm.activity[5].change).toEqual(['Certification Status became "Active"']);
            });

            it('should have an item for when the product was certified', function () {
                expect(vm.activity[6].change).toEqual(['Certified product was uploaded to the CHPL']);
            });
        });
    });
})();
