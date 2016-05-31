;(function () {
    'use strict';

    describe('app.common.a.directive', function () {

        var element;
        var scope;
        var $log;
        var $compile;
        var ctrl;

        beforeEach(module('app.common',
                          'app/common/components/a.html'));

        beforeEach(inject(function (_$compile_, $rootScope, _$log_, $templateCache) {
            $compile = _$compile_;
            $log = _$log_;
            scope = $rootScope.$new();

            var template = $templateCache.get('app/common/components/a.html');
            $templateCache.put('common/components/a.html', template);

            element = angular.element('<ai-a href="fakeUrl" text="fakeText"></ai-a>');
            $compile(element)(scope);
            scope.$digest();
            ctrl = element.controller('aiA');
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.log('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        describe('controller', function () {

            it('should exist', function() {
                expect(ctrl).toBeDefined();
            });

            it('should prepend with "http" if it isn\'t already', function () {
                expect(ctrl.actualLink).toBe('http://fakeUrl');
            });

            it('should not prepend if "http" is already there', function () {
                element = angular.element('<ai-a href="https://fakeUrl" text="fakeText"></ai-a>');
                $compile(element)(scope);
                scope.$digest();
                ctrl = element.controller('aiA');
                expect(ctrl.actualLink).toBe('https://fakeUrl');
            });
        });
    });
})();
