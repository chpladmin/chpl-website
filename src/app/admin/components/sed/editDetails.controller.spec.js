(function () {
    'use strict';

    describe('the SED Details Edit controller', function () {
        var $controller, $log, Mock, mock, scope, vm;

        mock = {
            listing: {
                sedTestingEnd: (new Date()).getTime(),
            },
        };

        beforeEach(function () {
            module('chpl.admin', 'chpl.mock');

            inject(function (_$controller_, _$log_, $rootScope, _Mock_) {
                $controller = _$controller_;
                $log = _$log_;
                Mock = _Mock_;

                scope = $rootScope.$new();
                vm = $controller('EditSedDetailsController', {
                    criteria: [],
                    listing: mock.listing,
                    ucdProcesses: [],
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

        it('should have a way to close it\'s modal', function () {
            expect(vm.cancel).toBeDefined();
            vm.cancel();
            expect(Mock.modalInstance.dismiss).toHaveBeenCalled();
        });

        it('should turn the date value into an object', function () {
            expect(vm.listing.sedTestingEndDate).toEqual(jasmine.any(Object));
        });

        it('should not create a date object if the value isn\'t there', function () {
            vm = $controller('EditSedDetailsController', {
                criteria: [],
                listing: {},
                ucdProcesses: [],
                $uibModalInstance: Mock.modalInstance,
                $scope: scope,
            });
            scope.$digest();
            expect(vm.listing.sedTestingEndDate).toBeUndefined();
        });

        describe('when saving a Listing', function () {
            it('should convert the date object back to a time', function () {
                vm.listing.sedTestingEndDate = new Date();
                vm.listing.sedTestingEnd = undefined;
                vm.save();
                expect(vm.listing.sedTestingEnd).toEqual(jasmine.any(Number));
            });

            it('should not convert an undefined end date', function () {
                vm.listing.sedTestingEndDate = undefined
                vm.listing.sedTestingEnd = 23;
                vm.save();
                expect(vm.listing.sedTestingEnd).toBeUndefined();
            });

            it('should not convert a string end date', function () {
                vm.listing.sedTestingEndDate = '02/18/1989';
                vm.listing.sedTestingEnd = 23;
                vm.save();
                expect(vm.listing.sedTestingEnd).toBe('02/18/1989');
            });

            it('should close the modal with the listing and the ucd processes', function () {
                var anObj = {id: 3, sedTestingEndDate: new Date()};
                var processes = [1,2];
                vm.listing = anObj;
                vm.ucdProcesses = processes;
                vm.save();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({
                    listing: anObj,
                    ucdProcesses: processes,
                });
            });
        });
    });
})();
