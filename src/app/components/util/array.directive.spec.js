(function () {
    'use strict';

    describe('chpl.array.directive', function () {

        var element;
        var scope;
        var $log;
        var $compile;
        var ctrl;

        beforeEach(function () {
            module('chpl.templates');
            module('chpl')
        });

        beforeEach(inject(function (_$compile_, _$log_, $rootScope) {
            $compile = _$compile_;
            $log = _$log_;
            scope = $rootScope.$new();

            element = angular.element('<ai-array key="aKey" items="items" key-second="{{ keySecond }}"></ai-array>');
            $compile(element)(scope);
            scope.$digest();
            ctrl = element.controller('aiArray');
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.log('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        describe('controller', function () {

            it('should exist', function () {
                expect(ctrl).toBeDefined();
            });

            it('should have an empty array of items if none are passed in', function () {
                expect(ctrl.items).toEqual([]);
            });

            it('should have the items available if they\'re passed in', function () {
                element = angular.element('<ai-array key="aKey" items="items" key-second="{{ keySecond }}"></ai-array>');
                scope.items = [1,2];
                $compile(element)(scope);
                scope.$digest();
                expect(ctrl.items).toEqual([1,2]);
            });

            it('should have a local id', function () {
                expect(ctrl.localId).toBeDefined();
            });

            it('should have a function to remove items', function () {
                expect(ctrl.removeItem).toBeDefined();
            });

            it('should remove items when told to do so', function () {
                scope.items = [1,2];
                scope.$digest();
                ctrl.removeItem(1);
                expect(ctrl.items).toEqual([1]);
            });

            it('should have a function to add items', function () {
                expect(ctrl.addItem).toBeDefined();
            });

            it('should add an item when told to', function () {
                ctrl.newItem = 'fake';
                ctrl.addItem();
                expect(ctrl.items).toEqual([{aKey: 'fake'}]);
            });

            describe('adding two keyed objects', function () {
                beforeEach(function () {
                    scope.keySecond = 'keySecond';
                    scope.$digest();
                });

                it('should add a second item when told to', function () {
                    ctrl.newItem = 'fake';
                    ctrl.newSecond = 'fake2';
                    ctrl.addItem();
                    expect(ctrl.items).toEqual([{aKey: 'fake', keySecond: 'fake2'}]);
                });

                it('should clear the fields if an item is added', function () {
                    scope.keySecond = 'keySecond';
                    scope.$digest();

                    ctrl.newItem = 'fake';
                    ctrl.newSecond = 'fake2';
                    ctrl.addItem();
                    expect(ctrl.newItem).toBe('');
                    expect(ctrl.newSecond).toBe('');
                });
            });
        });
    });
})();
