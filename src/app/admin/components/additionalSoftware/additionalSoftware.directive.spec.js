(function() {
    'use strict';

    describe('admin.additionalSoftware', function() {
        var vm, el, $log;

        beforeEach(function () {
            module('chpl.templates');
            module('chpl.admin');

            inject(function($compile, $rootScope, _$log_) {
                $log = _$log_;

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
    });
})();
