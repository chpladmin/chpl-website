(function () {
    'use strict';

    describe('admin.additionalSoftware', function () {
        var vm, el, $log, mock, Mock, $uibModal, actualOptions;

        mock = {};
        mock.fakeModal = {
            result: {
                then: function (confirmCallback, cancelCallback) {
                    this.confirmCallBack = confirmCallback;
                    this.cancelCallback = cancelCallback;
                }},
            close: function (item) { this.result.confirmCallBack(item); },
            dismiss: function (type) { this.result.cancelCallback(type); }
        };
        mock.fakeModalOptions = {
            templateUrl: 'app/admin/components/additionalSoftware/edit.html',
            controller: 'EditAdditionalSoftwareController',
            controllerAs: 'vm',
            animation: false,
            backdrop: 'static',
            keyboard: false,
            resolve: {
                software: jasmine.any(Function)
            }
        };


        beforeEach(function () {
            module('chpl.mock', 'chpl.templates','chpl.admin');

            inject(function ($compile, $rootScope, _$log_, _Mock_, _$uibModal_) {
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

        it('should create a modal instance when additional software is added', function () {
            expect(vm.editModalInstance).toBeUndefined();
            vm.addItem();
            expect(vm.editModalInstance).toBeDefined();
            expect($uibModal.open).toHaveBeenCalledWith(mock.fakeModalOptions);
            expect(actualOptions.resolve.software()).toEqual({ name: '', version: '', certifiedProductSelfCHPLId: '' });
        });
    });
})();
