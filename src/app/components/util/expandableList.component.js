(function () {
    'use strict';

    angular.module('chpl.components').component('aiExpandableList', {
        templateUrl: 'chpl.components/util/expandableList.html',
        controller: ExapandableListController,
        bindings: {
            addItems: '@',                      //Boolean value indicating if the control has the functionality to add new items to the drop down.  When this is true, an extra item will appear in the list and when the user selects that item, they will be presented with a text box to type in the new value.
            addItemsOptionText: '@',            //Text for the additional option
            addItemsPlaceholder: '@',           //Direction that appear in the text box
            additionalInput: '@',               //Boolean value indicating whether the control renders an additioanl text box for data associated with the selected item.
            additionalInputLabel: '@',          //String that is the label for the additional input text box.
            additionalInputRequired: '@',       //Boolean indicating if the addiational input is required.
            additionalInputMaxLength: '@',      //Number indicating how many characters can be entered in the additional input text box
            additionalInput2: '@',
            additionalInput2Label: '@',
            additionalInput2Required: '@',
            additionalInput2MaxLength: '@',
            identifier: '@',                    //Used to name the controls in the component
            itemDisabled: '&',                  //Callback function that will be called for each item in the drop down to determine if that item should should be disabled.  Returns a boolean value.
            itemKey: '@',                       //String that identifies the key property in the 'items' array.  For eaxmple: "id" for an object that looks like [{id: 2, name: 'AI'}]
            items: '<',                         //An array of objects to display in the drop down
            itemText: '@',                      //String that identifies the text property in the 'items' array.  This is used to create the display value in the dropdown.  For example: "name" for an object that looks like [{id: 2, name: 'AI'}]
            onChange: '&',                      //Callback that is used when the user makes a change to the control
            onValidate: '&',                    //Callback that is used to validate the selected item.  Response looks like {valid: bool, errors = [], warnings: []}
            placeholder: '@',                   //The text that appears in the drop down providing instruction to the user.  For example: "Select a Test Standard"
            selectedItemKeys: '<',              //An array of the items that are pre-selected.  Should be in the form {key: value, additionalInputValue: value, additionalInput2Value: value}. The key value should match an item in the 'items' array.
        },
    });

    function ExapandableListController ($attrs, $log) {
        var ctrl = this;
        ctrl.$log = $log;
        ctrl.$attrs = $attrs;
        ctrl.addItemToListClick = addItemToListClick;
        ctrl.additionalInputChange = additionalInputChange;
        ctrl.additionalInput2Change = additionalInput2Change;
        ctrl.cancelAddItemToListClick = cancelAddItemToListClick;
        ctrl.isItemDisabled = isItemDisabled;
        ctrl.removeItem = removeItem;
        ctrl.selectOnChange = selectOnChange;

/////////////////////////////////////////////////////////////

        ctrl.$onInit = function () {
            ctrl.addItem = ''
            ctrl.inAddMode = false;
            ctrl.options = [];
            ctrl.selectedItem = '';
            ctrl.selectedItems = [];
            ctrl.errors = [];
            ctrl.warnings = [];

            _populateOptions();
            _populateSelectedItems();
            _validateItems(ctrl.selectedItems);
        }

        function addItemToListClick () {
            ctrl.inAddMode = false;

            var addItem = {};
            addItem[ctrl.itemText] = ctrl.addOption;
            addItem[ctrl.itemKey] = '';

            var item = _createSelectedItem(addItem);
            ctrl.selectedItems.push(item);
            var action = _getOnChangeObject('Add', item);
            ctrl.onChange({'action': action});

            ctrl.options.push(
                {text: addItem[ctrl.itemText], value: addItem}
            );
            ctrl.selectedItem = '';
            ctrl.addOption = '';
        }

        function additionalInputChange (item) {
            var action = _getOnChangeObject('Edit', item)
            ctrl.onChange({'action': action});  //This is what makes the method binding work
        }

        function additionalInput2Change (item) {
            var action = _getOnChangeObject('Edit', item)
            ctrl.onChange({'action': action});  //This is what makes the method binding work
        }

        function cancelAddItemToListClick () {
            ctrl.inAddMode = false;
            ctrl.selectedItem = '';
            ctrl.addOption = '';
        }

        function isItemDisabled (item) {
            if (typeof ctrl.itemDisabled === 'function') {
                return ctrl.itemDisabled({'item': item});
            } else {
                return false;
            }
        }

        function removeItem (item) {
            var index = ctrl.selectedItems.indexOf(item);
            if (index > -1) {
                ctrl.selectedItems.splice(index, 1);
            }
            var onChangeObject = _getOnChangeObject('Remove', item)
            ctrl.onChange({'action': onChangeObject});  //This is what makes the method binding work
            _validateItems(ctrl.selectedItems);
        }

        function selectOnChange () {
            if (ctrl.selectedItem[ctrl.itemKey] === undefined) {
                ctrl.inAddMode = true;
            } else {
                if (!_doesItemExistInSelectedItems(ctrl.selectedItem)) {
                    var item = _createSelectedItem(ctrl.selectedItem);
                    ctrl.selectedItems.push(item);
                    var onChangeObject = _getOnChangeObject('Add', item);
                    ctrl.onChange({'action': onChangeObject});  //This is what makes the method binding work
                }
                ctrl.selectedItem = '';
            }
            _validateItems(ctrl.selectedItems);
        }

        /////////////////////////////////////////////////////////////////

        function _createSelectedItem (item) {
            var selectedItem = {'item': item};

            if (ctrl.additionalInput) {
                selectedItem.additionalInputValue = '';
            } else if (ctrl.additionalInput2) {
                selectedItem.additionalInput2Value = '';
            }
            return selectedItem;
        }

        function _doesItemExistInSelectedItems (item) {
            var retValue = false;
            angular.forEach(ctrl._selectedItems, function (arrayItem) {
                if (arrayItem.item[ctrl.itemKey] === item[ctrl.itemKey]) {
                    retValue = true;
                }
            });
            return retValue;
        }

        function _getItemByKey (key) {
            var itemToReturn = ctrl.items.filter(function (item) {
                return item[ctrl.itemKey] === key;
            });

            if (itemToReturn && itemToReturn.length > 0) {
                return itemToReturn[0];
            } else {
                return null;
            }
        }

        function _getOnChangeObject (action, selectedItem) {
            return {'action': action, 'item': selectedItem};
        }

        function _populateOptions () {
            ctrl.options = [];
            if (ctrl.addItems) {
                var addItem = {};
                addItem[ctrl.itemText] = ctrl.addItemsOptionText;
                addItem[ctrl.itemKey] = undefined;
                ctrl.options.push(
                    {text: addItem[ctrl.itemText], value: addItem}
                );
            }
            angular.forEach(ctrl.items, function (arrayItem) {
                ctrl.options.push(
                    {text: arrayItem[ctrl.itemText], value: arrayItem}
                );
            });
        }

        function _populateSelectedItems () {
            angular.forEach(ctrl.selectedItemKeys, function (item) {
                var newItem = _createSelectedItem(_getItemByKey(item.key));
                if (ctrl.additionalInput) {
                    newItem.additionalInputValue = item.additionalInputValue;
                }
                if (ctrl.additionalInput2) {
                    newItem.additionalInput2Value = item.additionalInput2Value;
                }
                ctrl.selectedItems.push(newItem);
            });
        }

        function _validateItems (selectedItems) {
            ctrl.warnings = [];
            ctrl.errors = [];
            if (ctrl.$attrs.onValidate)  {
                angular.forEach(selectedItems, function (item) {
                    let validation = ctrl.onValidate({'item': item.item});  //This is what makes the method binding work
                    if (!validation.valid) {
                        ctrl.warnings = ctrl.warnings.concat(validation.warnings);
                        ctrl.errors = ctrl.errors.concat(validation.errors);
                    }
                });
            }
        }
    }
})();
