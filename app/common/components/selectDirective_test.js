;(function () {
    'use strict';

    describe('app.common.select.directive', function () {

        var element;
        var scope;
        var $log;
        var $compile;
        var ctrl;

        beforeEach(module('app.common',
                          'app/common/components/select.html'));

        beforeEach(inject(function (_$compile_, $rootScope, _$log_, $templateCache) {
            $compile = _$compile_;
            $log = _$log_;
            scope = $rootScope.$new();

            var template = $templateCache.get('app/common/components/select.html');
            $templateCache.put('common/components/select.html', template);

            element = angular.element('<ai-select options="[{id:1,name:1},{id:2,name:2}]" model="model" expandable="true" label="aLabel" name="aName"></ai-select>');
            $compile(element)(scope);
            scope.$digest();
            ctrl = element.controller('aiSelect');
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

            xit('should have the items available if they\'re passed in', function () {
                element = angular.element('<ai-array key="aKey" items="items" key-second="{{ keySecond }}"></ai-array>');
                scope.items = [1,2];
                $compile(element)(scope);
                scope.$digest();
                expect(ctrl.items).toEqual([1,2]);
            });

            it('should have a local id', function () {
                expect(ctrl.localId).toBeDefined();
            });

            it('should update the options when a new item is changed', function () {
                expect(ctrl.onNewChange).toBeDefined();
                expect(ctrl.model).toBeUndefined();
                ctrl.newItem = 'aFakeNewItem';
                ctrl.onNewChange();
                expect(ctrl.model).toEqual({name:'aFakeNewItem'});
                expect(ctrl.options[ctrl.options.length -1]).toEqual(ctrl.model);
            });

            it('shouldn\'t add a new object if one was already added', function () {
                var originalLength = ctrl.options.length;
                ctrl.newItem = 'aFakeNewItem';
                ctrl.onNewChange();
                ctrl.newItem = 'aFakeNewItem2';
                ctrl.onNewChange();
                expect(ctrl.model).toEqual({name:'aFakeNewItem2'});
                expect(ctrl.options[ctrl.options.length -1]).toEqual(ctrl.model);
                expect(ctrl.options.length).toBe(originalLength + 1);
            });
        });
    });
})();
