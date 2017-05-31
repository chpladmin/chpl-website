(function () {
    'use strict';

    describe('admin.additionalSoftware', function () {
        var vm, el, $log, mock, Mock, $uibModal, actualOptions;

        mock = {};
        mock.fakeModalOptions = {
            templateUrl: 'app/admin/components/additionalSoftware/edit.html',
            controller: 'EditAdditionalSoftwareController',
            controllerAs: 'vm',
            animation: false,
            backdrop: 'static',
            keyboard: false,
            resolve: {
                software: jasmine.any(Function),
            },
        };

        beforeEach(function () {
            module('chpl.mock', 'chpl.templates','chpl.admin');

            inject(function ($compile, _$log_, $rootScope, _$uibModal_, _Mock_) {
                $log = _$log_;
                Mock = _Mock_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return Mock.fakeModal;
                });

                el = angular.element('<ai-additional-software></ai-additional-software>');

                $compile(el)($rootScope.$new());
                $rootScope.$digest();
                vm = el.isolateScope().vm;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.debug("\n Debug: " + $log.debug.logs.join("\n Debug: "));
            }
        });

        it('should be compiled', function () {
            expect(el.html()).not.toEqual(null);
        });

        it('should have isolate scope object with instanciate members', function () {
            expect(vm).toEqual(jasmine.any(Object));
        });

        it('should know if it should be "and" or "or"', function () {
            expect(vm.isAndOrOr(2,4,3,4)).toBe('OR');
            expect(vm.isAndOrOr(4,4,2,4)).toBe('AND');
            expect(vm.isAndOrOr(4,4,4,4)).toBe('');
        });

        describe('adding new software', function () {
            it('should create a modal instance when additional software is added', function () {
                expect(vm.editModalInstance).toBeUndefined();
                vm.addItem();
                expect(vm.editModalInstance).toBeDefined();
                expect($uibModal.open).toHaveBeenCalledWith(mock.fakeModalOptions);
                expect(actualOptions.resolve.software()).toEqual({ name: '', version: '', certifiedProductSelfCHPLId: '' });
            });

            it('should add new sw to the array', function () {
                vm.additionalSoftware = undefined;
                vm.addItem();
                vm.editModalInstance.close('new');
                expect(vm.additionalSoftware).toEqual(['new']);
            });

            it('should append new sw to the array', function () {
                vm.additionalSoftware = ['one'];
                vm.addItem();
                vm.editModalInstance.close('new');
                expect(vm.additionalSoftware).toEqual(['one','new']);
            });

            it('should log a dismissed modal', function () {
                var logCount = $log.debug.logs.length;
                vm.addItem();
                vm.editModalInstance.dismiss('new');
                expect($log.debug.logs.length).toBe(logCount + 1);
            });

            it('should not log a cancelled modal', function () {
                var logCount = $log.debug.logs.length;
                vm.addItem();
                vm.editModalInstance.dismiss('cancelled');
                expect($log.debug.logs.length).toBe(logCount);
            });
        });

        describe('editing existing software', function () {
            beforeEach(function () {
                vm.additionalSoftware = ['one'];
            });

            it('should create a modal instance', function () {
                expect(vm.editModalInstance).toBeUndefined();
                vm.editItem('one',0);
                expect(vm.editModalInstance).toBeDefined();
                expect($uibModal.open).toHaveBeenCalledWith(mock.fakeModalOptions);
                expect(actualOptions.resolve.software()).toEqual('one');
            });

            it('should edit sw in the array', function () {
                vm.editItem('one',0);
                vm.editModalInstance.close('new');
                expect(vm.additionalSoftware).toEqual(['new']);
            });

            it('should log a dismissed modal', function () {
                var logCount = $log.debug.logs.length;
                vm.editItem('one',0);
                vm.editModalInstance.dismiss('new');
                expect($log.debug.logs.length).toBe(logCount + 1);
            });

            it('should not log a cancelled modal', function () {
                var logCount = $log.debug.logs.length;
                vm.editItem('one',0);
                vm.editModalInstance.dismiss('cancelled');
                expect($log.debug.logs.length).toBe(logCount);
            });
        });

        it('should remove software', function () {
            vm.additionalSoftware = ['one'];
            vm.removeItem(0);
            expect(vm.additionalSoftware).toEqual([]);
        });

        describe('software grouping', function () {
            it('should build grouping objects', function () {
                vm.additionalSoftware = [
                    {id: 1, grouping: null},
                    {id: 2, grouping: 'a'},
                    {id: 3, grouping: 'a'},
                    {id: 4, grouping: 'b'},
                ];
                vm.buildGrouping();
                expect(vm.displaySw).toEqual({
                    defaultGroup0: [{id: 1, grouping: null}],
                    a: [{id: 2, grouping: 'a'},{id: 3, grouping: 'a'}],
                    b: [{id: 4, grouping: 'b'}],
                });
            });
        });
    });
})();
