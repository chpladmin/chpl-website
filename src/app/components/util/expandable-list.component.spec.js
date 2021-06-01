(() => {
  'use strict';

  describe('the Expandable List component', () => {
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
        scope.onChange = jasmine.createSpy('onChange');
        scope.onValidate = jasmine.createSpy('onValidate');
        scope.onValidate.and.returnValue({valid: true});

        el = angular.element('<chpl-expandable-list'
                                     + '     identifier="testData"  '
                                     + '     item-key="id" '
                                     + '     item-text="name" '
                                     + '     items="itemsList"'
                                     + '     selected-item-keys="selectedItems"'
                                     + '     placeholder="Select Test Data"'
                                     + '     on-change="onChange(action)"'
                                     + '     on-validate="onValidate(item)"'
                                     + '     additional-input="true"'
                                     + '     additional-input-label="Version"'
                                     + '     additional-input-max-length="50"'
                                     + '     additional-input-required="true"'
                                     + '     additional-input2="true"'
                                     + '     additional-input2-label="Alteration"'
                                     + '     additional-input2-max-length="50"'
                                     + '     additional-input2-required="false">'
                                     + ' </chpl-expandable-list>');

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
          expect(ctrl.options.length).toBe(4);
        });

        it('should populate the selected items', () => {
          expect(ctrl.selectedItems.length).toBe(2);
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
        it('should remove the item from selected items', () => {
          ctrl.selectedItems = [1, 2];
          ctrl.removeItem(ctrl.selectedItems[0]);
          expect(ctrl.selectedItems.length).toBe(1);
        });

        it('should call the onChange callback', () => {
          ctrl.removeItem(ctrl.selectedItems[0]);
          expect(scope.onChange).toHaveBeenCalled();
        });
      });

      describe('when an item is selected', () => {
        it('should should add the selected item to selectedItems', () => {
          const initialLength = ctrl.selectedItems.length;
          ctrl.selectedItem = {id: 3, name: 'test3'};
          ctrl.selectOnChange();
          expect(ctrl.selectedItems.length).toBe(initialLength + 1);
        });

        it('should should call the onChange callback', () => {
          ctrl.selectedItem = {id: 3, name: 'test3'};
          ctrl.selectOnChange();
          expect(scope.onChange).toHaveBeenCalled();
        });
      });

      describe('when filtering options', () => {
        it('should filter out options that have already been selected', () => {
          ctrl.options = [
            {text: 'test', value: {id: 3, name: 'test'}},
            {text: 'test2', value: {id: 65, name: 'test2'}},
            {text: 'test3', value: {id: 653, name: 'test3'}},
          ];
          ctrl.selectedItems = [{item: {id: 3, name: 'test'}}];
          expect(ctrl.filteredOptions().length).toBe(2);
        });
      });
    });
  });
})();
