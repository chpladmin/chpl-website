(function () {
    'use strict';

    describe('admin.MergeDeveloperController.controller', function () {
        var vm, scope, $log, $q, commonService, mock, Mock;

        mock = {};
        mock.acbs = ['Drummond','ICSA','Infogard'];

        beforeEach(function () {
            module('chpl.mock', 'chpl.admin', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.updateDeveloper = jasmine.createSpy('updateDeveloper');
                    return $delegate;
                });
            });

            inject(function ($controller, $rootScope, _$log_, _$q_, _commonService_, _Mock_) {
                $log = _$log_;
                $q = _$q_;
                commonService = _commonService_;
                commonService.updateDeveloper.and.returnValue($q.when({}));
                Mock = _Mock_;
                mock.developers = [].concat(Mock.developers[0]).concat(Mock.developers[1]).concat(Mock.developers[2]).concat(Mock.developers[3]).concat(Mock.developers[4]);
                mock.developers[0].statusEvents = [{status: {status: 'new'}, statusDate: 'date'}];

                scope = $rootScope.$new();
                vm = $controller('MergeDeveloperController', {
                    developers: mock.developers,
                    $uibModalInstance: Mock.modalInstance
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.debug('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        describe('housekeeping', function () {
            it('should exist', function () {
                expect(vm).toBeDefined();
            });

            it('should have a way to close the modal', function () {
                expect(vm.cancel).toBeDefined();
                vm.cancel();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalled();
            });
        });

        describe('developer status history', function () {
            it('should set status history to empty on the new developer', function () {
                expect(vm.developer.statusEvents.length).toBe(0);
            });

            it('should add an empty statuse', function () {
                vm.addPreviousStatus();
                expect(vm.developer.statusEvents.length).toBe(1);
                expect(vm.developer.statusEvents[0].statusDateObject).toBeDefined();
            });

            it('should remove previous statuses', function () {
                vm.addPreviousStatus();
                vm.addPreviousStatus();
                expect(vm.developer.statusEvents.length).toBe(2);
                vm.removePreviousStatus(0);
                expect(vm.developer.statusEvents.length).toBe(1);
            });
        });
    });
})();
