import './history.mock';

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
            angular.mock.module('chpl.product');
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
                expect(vm.listingId).toBe(33);
            });
        });

        describe('when interpreting the report', function () {
            it('should have an item for when the product was certified but not edited', function () {
                expect(vm.activity[0].change).toEqual(['Certified product was uploaded to the CHPL']);
            });

            it('should have an item for when the product was certified and later had a status change', function () {
                expect(vm.activity[1].change).toEqual(['Certified product was uploaded to the CHPL']);
            });

            it('should have an item for surveillance being added', function () {
                expect(vm.activity[2].change).toEqual(['Surveillance activity was added']);
            });

            it('should have an item for surveillance being updated', function () {
                expect(vm.activity[3].change).toEqual(['Surveillance activity was updated']);
            });

            it('should have an item for surveillance being deleted', function () {
                expect(vm.activity[4].change).toEqual(['Surveillance activity was deleted']);
            });

            it('should have items for certification criteria being added and g1/g2 success changing', function () {
                expect(vm.activity[5].change[0]).toEqual('170.315 (b)(3) changes:<ul><li>Added G2 MACRA Measure:<ul><li>another1</li></ul></li></ul>');
                expect(vm.activity[5].change[1]).toEqual('170.315 (e)(1) changes:<ul><li>Removed G1 MACRA Measure:<ul><li>abbr</li></ul></li></ul>');
                expect(vm.activity[5].change[2]).toEqual('170.315 (e)(2) changes:<ul><li>Added G1 MACRA Measure:<ul><li>an abr</li></ul></li></ul>');
                expect(vm.activity[5].change[3]).toEqual('170.315 (g)(7) changes:<ul><li>Certification Criteria was added</li><li>Certification Criteria became Certified to G1</li></ul>');
                expect(vm.activity[5].change[4]).toEqual('170.315 (g)(8) changes:<ul><li>Certification Criteria was added</li></ul>');
                expect(vm.activity[5].change[5]).toEqual('170.315 (g)(9) changes:<ul><li>Certification Criteria was added</li><li>Removed G2 MACRA Measure:<ul><li>abbrevie</li></ul></li></ul>');
            });

            it('should have items for CQMs changing', function () {
                expect(vm.activity[5].change[6]).toEqual('CMS122 changes:<ul><li>CQM became "False"</li><li>v1 removed</li><li>Certification Criteria "a criteria" changes<ul><li>a criteria removed</li></ul></li></ul>');
                expect(vm.activity[5].change[7]).toEqual('CMS82 changes:<ul><li>CQM became "True"</li><li>v3 added</li><li>Certification Criteria "random criteria" changes<ul><li>random criteria added</li></ul></li></ul>');
            });

            it('should know when the CHPL Product Number changed', function () {
                expect(vm.activity[6].change[0]).toEqual('CHPL Product Number changed from 15.07.07.1447.BE02.01.00.1.160815 to 15.07.07.1447.BE02.01.01.1.160815');
            });

            it('should know when the MUU number changed', () => {
                expect(vm.activity[8].change[0]).toEqual('Estimated number of Meaningful Use Users changed from 4 to 6 on Dec 31, 1969');
            });

            describe('when dealing with certification events', function () {
                beforeEach(function () {
                    vm.activity = [];
                });

                it('should have an item for certification status becoming active during confirmation', function () {
                    vm._interpretCertificationStatusChanges(mock.activity[0]);
                    expect(vm.activity.length).toBe(1);
                    expect(vm.activity[0].change).toEqual(['Certification Status became "Active"']);
                });

                it('should have an item for certification status changing', function () {
                    vm._interpretCertificationStatusChanges(mock.activity[4]);
                    expect(vm.activity.length).toBe(2);
                    expect(vm.activity[0].change).toEqual(['Certification Status became "Active"']);
                    expect(vm.activity[1].change).toEqual(['Certification Status became "Suspended by ONC"']);
                });

                it('should have an item for certification status changing after confirmation', function () {
                    vm._interpretCertificationStatusChanges(mock.activity[6]);
                    expect(vm.activity.length).toBe(1);
                    expect(vm.activity[0].change).toEqual(['Certification Status became "Active"']);
                });
            });
        });
    });
})();
