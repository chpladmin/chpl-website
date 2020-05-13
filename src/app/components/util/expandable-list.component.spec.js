(() => {
    'use strict';

    fdescribe('the Expandable List component', () => {
        var $compile, $log, ctrl, el, mock, scope;

        mock = {
            itemsList: [
                {id: 1, name: 'test1'},
                {id: 2, name: 'test2'},
                {id: 3, name: 'test3'},
                {id: 4, name: 'test4'},
            ],
            selectedItems: [
                {key: 2, additionalInputValue: 'ad1', additionalInput2Value: 'ad2'},
                {key: 4, additionalInputValue: 'ad4', additionalInput2Value: 'ad3'},
            ],
        };

        beforeEach(() => {
            angular.mock.module('chpl.components');

            inject((_$compile_, _$log_, $rootScope) => {
                $compile = _$compile_;
                $log = _$log_;

                scope = $rootScope.$new();
                scope.itemsList = mock.itemsList;
                scope.selectedItems = mock.selectedItems;
                scope.onChangeCallBack = jasmine.createSpy('onChangeCallBack');

                el = angular.element('<ai-expandable-list'
                                     + '     identifier="testData"  '
                                     + '     item-key="id" '
                                     + '     item-text="name" '
                                     + '     items="itemsList"'
                                     + '     selected-item-keys="selectedItems"'
                                     + '     placeholder="Select Test Data"'
                                     + '     on-change="onChangeCallBack(action)"'
                                     + '     additional-input="true"'
                                     + '     additional-input-label="Version"'
                                     + '     additional-input-max-length="50"'
                                     + '     additional-input-required="true"'
                                     + '     additional-input2="true"'
                                     + '     additional-input2-label="Alteration"'
                                     + '     additional-input2-max-length="50"'
                                     + '     additional-input2-required="false"'
                                     + '     add-items="true"'
                                     + '     add-items-option-text="Add a new option"'
                                     + '     add-items-placeholder="Enter new option">'
                                     + ' </ai-expandable-list>');

                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
            });
        });

        afterEach(() => {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('template', () => {
            it('should be compiled', () => {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', () => {
            it('should exist', () => {
                expect(ctrl).toBeDefined();
            });

            describe('when initializing', () => {
                it('should populate the options', () => {
                    expect(ctrl.options.length).toBe(5);
                });

                it('should populate the selected items', () => {
                    expect(ctrl.selectedItems.length).toBe(2);
                });
            });

            describe('when adding item(s) to the list', () => {
                beforeEach(() => {
                    //ctrl = el.isolateScope().$ctrl;
                    ctrl.onChange = jasmine.createSpy('callback');
                    ctrl.addOption = 'New Option';
                    ctrl.addItemToListClick();
                    scope.$digest();
                });

                it('should set add mode = false', () => {
                    expect(ctrl.inAddMode).toBe(false);
                });

                it('should add item to selected items', () => {
                    expect(ctrl.selectedItems.length).toBe(3);
                });

                it('should call onChange callback', () => {
                    expect(ctrl.onChange).toHaveBeenCalled();
                });

                it('should add item to options', () => {
                    expect(ctrl.options.length).toBe(6);
                });

                it('should clear the selected item', () => {
                    expect(ctrl.selectedItem).toBe('');
                });

                it('should clear addOption', () => {
                    expect(ctrl.addOption).toBe('');
                });
            });

            describe('when cancelling addition of item', () => {
                beforeEach(() => {
                    //ctrl = element.isolateScope().$ctrl;
                    ctrl.inAddMode = true;
                    scope.$digest();

                    ctrl.cancelAddItemToListClick();
                });

                it('should reset the control to not be in add mode', () => {
                    expect(ctrl.inAddMode).toBe(false);
                    expect(ctrl.selectedItem).toBe('');
                    expect(ctrl.addOption).toBe('');
                });
            });

            describe('when calling itemdisabled callback', () => {
                it('should call the call back when it is defined', () => {
                    ctrl.itemDisabled = jasmine.createSpy('callback').and.returnValue(true);
                    ctrl.isItemDisabled({id: 2, name: 'test2'});
                    expect(ctrl.itemDisabled).toHaveBeenCalled();
                });

                it('should return false when it is not defined', () => {
                    ctrl.itemDisabled = undefined;
                    expect(ctrl.isItemDisabled({id: 2, name: 'test2'})).toBe(false);
                });
            });

            describe('when removing an item', () => {
                beforeEach(() => {
                    ctrl.onChange = jasmine.createSpy('callback');
                    ctrl.removeItem(ctrl.selectedItems[0]);
                });

                it('should remove the item from selected items', () => {
                    expect(ctrl.selectedItems.length).toBe(1);
                });

                it('should call the onChnage callback', () => {
                    expect(ctrl.onChange).toHaveBeenCalled();
                });
            });

            describe('when an item is selected', () => {
                it('should should not add the selected item if it is already selected', () => {
                    ctrl.selectedItem = ctrl.selectedItems[0]; //Exsiting in selectedItems
                    ctrl.selectOnChange();
                    scope.$digest();
                    expect(ctrl.selectedItems.length).toBe(2);
                });

                it('should should add the selected item to selectedItems', () => {
                    ctrl.selectedItem = {id: 3, name: 'test3'};
                    ctrl.selectOnChange();
                    scope.$digest();
                    expect(ctrl.selectedItems.length).toBe(3);
                });

                it('should should call the onChange callback', () => {
                    ctrl.selectedItem = {id: 3, name: 'test3'};
                    ctrl.onChange = jasmine.createSpy('callback');
                    ctrl.selectOnChange();
                    scope.$digest();
                    expect(ctrl.onChange).toHaveBeenCalled();
                });
            });
        });
    });
})();
