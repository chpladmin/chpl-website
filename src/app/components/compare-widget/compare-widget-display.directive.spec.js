(function () {
    'use strict';

    describe('chpl.aiCompareWidgetDisplay', function () {
        var $compile, $log, $rootScope, el, vm;

        beforeEach(function () {
            angular.mock.module('chpl.components');
            inject(function (_$compile_, _$log_, _$rootScope_) {
                $compile = _$compile_;
                $rootScope = _$rootScope_;
                $log = _$log_;

                el = angular.element('<ai-compare-widget><ai-compare-widget-display></ai-compare-widget-display></ai-compare-widget>');

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
