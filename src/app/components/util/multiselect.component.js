function MultiselectController () {
    var ctrl = this;
    ctrl.selectedItem = '';
    ctrl._selectedItems = [];
    ctrl._options = [];
    ctrl._addItem = ''
    ctrl.addItem = addItem;
    ctrl.removeItem = removeItem;
    ctrl.isItemDisabled = isItemDisabled;
    ctrl.additionalInputChange = additionalInputChange;
    ctrl.additionalInput2Change = additionalInput2Change;
    ctrl.inAddMode = false;
    ctrl.addItemToListClick = addItemToListClick;
    ctrl.cancelAddItemToListClick = cancelAddItemToListClick;

    activate();

    /////////////////////////////////////////////////////////////////

    function activate () {
        populateOptions();
        populateSelectedItems();
    }

    function addItem () {
        if (ctrl.selectedItem[ctrl.itemKey] === -99) {
            ctrl.inAddMode = true;
        } else {
            if (!doesItemExistInSelectedItems(ctrl.selectedItem)) {
                var item = createSelectedItem(ctrl.selectedItem);
                ctrl._selectedItems.push(item);
                ctrl.onChange(getOnChangeObject('Add', item));
            }
            ctrl.selectedItem = '';
        }
    }

    function addItemToListClick () {
        ctrl.inAddMode = false;

        var addItem = {};
        addItem[ctrl.itemText] = ctrl._addItem;
        addItem[ctrl.itemKey] = '';

        var item = createSelectedItem(addItem);
        ctrl._selectedItems.push(item);
        ctrl.onChange(getOnChangeObject('Add', item));

        ctrl._options.push(
            {text: addItem[ctrl.itemText], value: addItem}
        );
        ctrl.selectedItem = '';
        ctrl._addItem = '';
    }

    function additionalInputChange (item) {
        ctrl.onChange(getOnChangeObject('Edit', item));
    }

    function additionalInput2Change (item) {
        ctrl.onChange(getOnChangeObject('Edit', item));
    }

    function cancelAddItemToListClick () {
        ctrl.inAddMode = false;
        ctrl.selectedItem = '';
        ctrl._addItem = '';
    }

    function createSelectedItem (item) {
        if (ctrl.additionalInput) {
            return {'item': item, 'additionalInputValue': ''};
        } else {
            return {'item': item};
        }
    }

    function doesItemExistInSelectedItems (item) {
        var retValue = false;
        angular.forEach(ctrl._selectedItems, function (arrayItem) {
            if (arrayItem.item[ctrl.itemKey] === item[ctrl.itemKey]) {
                retValue = true;
            }
        });
        return retValue;
    }

    function getItemByKey (key) {
        //Should be replaced with array.filter...
        var itemToReturn = null;
        angular.forEach(ctrl.items, function (item) {
            if (item[ctrl.itemKey] === key) {
                itemToReturn = item;
            }
        });
        return itemToReturn;
    }

    function getOnChangeObject (action, selectedItem) {
        return {'action': action, 'item': selectedItem};
    }

    function isItemDisabled (item) {
        if (ctrl.itemDisabled) {
            return ctrl.itemDisabled(item);
        } else {
            return false;
        }
    }

    function populateOptions () {
        ctrl.options = [];
        if (ctrl.addItems) {
            var addItem = {};
            addItem[ctrl.itemText] = ctrl.addItemsOptionText;
            addItem[ctrl.itemKey] = -99;
            ctrl._options.push(
                {text: addItem[ctrl.itemText], value: addItem}
            );
        }
        angular.forEach(ctrl.items, function (arrayItem) {
            ctrl._options.push(
                {text: arrayItem[ctrl.itemText], value: arrayItem}
            );
        });
    }

    function populateSelectedItems () {
        angular.forEach(ctrl.selectedItemKeys, function (item) {
            var newItem = createSelectedItem(getItemByKey(item.key));
            if (ctrl.additionalInput) {
                newItem.additionalInputValue = item.additionalInputValue;
            }
            if (ctrl.additionalInput2) {
                newItem.additionalInput2Value = item.additionalInput2Value;
            }
            ctrl._selectedItems.push(newItem);
        });
    }

    function removeItem (item) {
        var index = ctrl._selectedItems.indexOf(item);
        if (index > -1) {
            ctrl._selectedItems.splice(index, 1);
        }

        ctrl.onChange(getOnChangeObject('Remove', item));
    }
}

/*
items -                     An array of objects to dispaly in the drop down
itemDisabled -              Callback function that will be called for each item in the drop down to determine if that item should should be disabled.  Returns a boolean value.
selectedItemKeys -          An array of the items that are pre-selected.  Should be in the form {key: value, additionalInputValue: value, additionalInput2Value: value}. The key value should match an item in the 'items' array.
identifier -                Used to name the controls in the component
itemKey -                   String that identifies the key property in the 'items' array.  For eaxmple: "id" for an object that looks like [{id: 2, name: 'AI'}]
itemText -                  String that identifies the text property in the 'items' array.  This is used to create the display value in the dropdown.  For example: "name" for an object that looks like [{id: 2, name: 'AI'}]    
placeholder:                The text that appears in the drop down providing instruction to the user.  For example: "Select a Test Standard"
additionalInput:            Boolean value indicating whether the control renders an additioanl text box for data associated with the selected item.
additionalInputLabel:       String that is the label for the additional input text box.
additionalInputRequired:    Boolean indicating if the addiational input is required.
additionalInputMaxLength:   Number indicating how many characters can be entered in the additional input text box
additems -                  Boolean value indicating if the control has the functionality to add new items to the drop down.  When this is true, an extra item will appear in the list and when the user selects that item, they will be presented with a text box to type in the new value.
addItemsOptionText -        Text for the additional option 
addItemsPlaceholder -       Direction that appear in the text box
onChange -                  Callback that is used when the user makes a change to the control
*/

angular.module('chpl').component('aiMultiselect', {
    templateUrl: './app/components/util/multiselect.html',
    controller: MultiselectController,
    bindings: {
        items: '<',
        itemDisabled: '<',
        selectedItemKeys: '<',
        identifier: '@',
        itemKey: '@',
        itemText: '@',
        placeholder: '@',
        additionalInput: '@',
        additionalInputLabel: '@',
        additionalInputRequired: '@',
        additionalInputMaxLength: '@',
        additionalInput2: '@',
        additionalInput2Label: '@',
        additionalInput2Required: '@',
        additionalInput2MaxLength: '@',
        addItems: '@',
        addItemsOptionText: '@',
        addItemsPlaceholder: '@',
        onChange: '<',
    },
});

