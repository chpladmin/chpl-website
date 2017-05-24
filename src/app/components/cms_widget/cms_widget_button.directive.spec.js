(function () {
    'use strict';

    describe('chpl.aiCmsWidgetButton', function () {
        var $compile, $rootScope, vm, el, $log;

        beforeEach(function () {
            module('chpl.templates');
            module('chpl.cms-widget');
            inject(function (_$compile_, _$log_, _$rootScope_) {
                $compile = _$compile_;
                $rootScope = _$rootScope_;
                $log = _$log_;

                el = angular.element('<ai-cms-widget><ai-cms-widget-button product-id="3" product-name="test"></ai-cms-widget-button></ai-cms-widget>');

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
    });
})();
