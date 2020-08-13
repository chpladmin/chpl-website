export const ExpandableListComponent = {
    templateUrl: 'chpl.components/util/expandable-list.html',
    bindings: {
        addItems: '@',                      //Boolean value indicating if the control has the functionality to add new items to the drop down.  When this is true, an extra item will appear in the list and when the user selects that item, they will be presented with a text box to type in the new value.
        addItemsOptionText: '@',            //Text for the additional option
        addItemsPlaceholder: '@',           //Direction that appear in the text box
        additionalInput: '@',               //Boolean value indicating whether the control renders an additional text box for data associated with the selected item.
        additionalInputLabel: '@',          //String that is the label for the additional input text box.
        additionalInputRequired: '@',       //Boolean indicating if the additional input is required.
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
        newItems: '<',                      //Array of strings that need to be added as if they were added by clicking the "add new <something>"
        onChange: '&',                      //Callback that is used when the user makes a change to the control
        onValidate: '&',                    //Callback that is used to validate the selected item.  Response looks like {valid: bool, errors = [], warnings: []}
        placeholder: '@',                   //The text that appears in the drop down providing instruction to the user.  For example: "Select a Test Standard"
        selectedItemKeys: '<',              //An array of the items that are pre-selected.  Should be in the form {key: value, additionalInputValue: value, additionalInput2Value: value}. The key value should match an item in the 'items' array.
    },
    controller: class ExpandableListController {
        constructor ($log) {
            this.$log = $log;
        }

        $onInit () {
            this.addItem = ''
            this.inAddMode = false;
            this.options = [];
            this.selectedItem = '';
            this.selectedItems = [];
            this.errors = [];
            this.warnings = [];

            this._populateOptions();
            this._populateSelectedItems();
            this._insertNewItems();
            this._validateItems(this.selectedItems);
        }

        $onChanges (changes) {
            if (changes.items) {
                this.items = angular.copy(changes.items.currentValue);
            }
            if (changes.newItems) {
                this.newItems = angular.copy(changes.newItems.currentValue);
            }
            if (changes.selectedItemKeys) {
                this.selectedItemKeys = angular.copy(changes.selectedItemKeys.currentValue);
            }
        }

        addItemToListClick () {
            this.inAddMode = false;

            var addItem = {};
            addItem[this.itemText] = this.addOption;
            addItem[this.itemKey] = '';

            var item = this._createSelectedItem(addItem);
            this.selectedItems.push(item);
            var action = this._getOnChangeObject('Add', item);
            this.onChange({'action': action});

            this.options.push(
                {text: addItem[this.itemText], value: addItem}
            );
            this.selectedItem = '';
            this.addOption = '';
        }

        inputChange () {
            var action = this._getOnChangeObject('Edit', this.selectedItems)
            this.onChange({'action': action});
        }

        cancelAddItemToListClick () {
            this.inAddMode = false;
            this.selectedItem = '';
            this.addOption = '';
        }

        filteredOptions () {
            return this.options.filter(item => !this._doesItemExistInSelectedItems(item.value));
        }

        isItemDisabled (item) {
            if (typeof this.itemDisabled === 'function') {
                return this.itemDisabled({'item': item});
            } else {
                return false;
            }
        }

        removeItem (item) {
            var index = this.selectedItems.indexOf(item);
            if (index > -1) {
                this.selectedItems.splice(index, 1);
            }
            var onChangeObject = this._getOnChangeObject('Remove', item)
            this.onChange({'action': onChangeObject});
            this._validateItems(this.selectedItems);
        }

        selectOnChange () {
            if (this.selectedItem[this.itemKey] === undefined) {
                this.inAddMode = true;
            } else {
                if (!this._doesItemExistInSelectedItems(this.selectedItem)) {
                    var item = this._createSelectedItem(this.selectedItem);
                    this.selectedItems.push(item);
                    var onChangeObject = this._getOnChangeObject('Add', item);
                    this.onChange({'action': onChangeObject});
                }
                this.selectedItem = '';
            }
            this._validateItems(this.selectedItems);
        }

        /////////////////////////////////////////////////////////////////

        _createSelectedItem (item) {
            var selectedItem = {'item': item};

            if (this.additionalInput) {
                selectedItem.additionalInputValue = '';
            } else if (this.additionalInput2) {
                selectedItem.additionalInput2Value = '';
            }
            return selectedItem;
        }

        _doesItemExistInSelectedItems (item) {
            return this.selectedItems
                .reduce((acc, arrayItem) => acc || arrayItem.item[this.itemKey] === item[this.itemKey], false);
        }

        _getItemByKey (key) {
            let itemToReturn = this.items.filter(item => item[this.itemKey] === key);

            if (itemToReturn && itemToReturn.length > 0) {
                return itemToReturn[0];
            }
        }

        _getOnChangeObject (action, selectedItem) {
            return {'action': action, 'item': selectedItem};
        }

        _populateOptions () {
            this.options = [];
            if (this.addItems) {
                var addItem = {};
                addItem[this.itemText] = this.addItemsOptionText;
                addItem[this.itemKey] = undefined;
                this.options.push(
                    {text: addItem[this.itemText], value: addItem}
                );
            }
            this.items
                .sort((a, b) => a[this.itemText] < b[this.itemText] ? -1 : a[this.itemText] > b[this.itemText] ? 1 : 0)
                .forEach(arrayItem => {
                    this.options.push(
                        {text: arrayItem[this.itemText], value: arrayItem}
                    );
                });
        }

        _populateSelectedItems () {
            this.selectedItemKeys.forEach(item => {
                var newItem = this._createSelectedItem(this._getItemByKey(item.key));
                if (this.additionalInput) {
                    newItem.additionalInputValue = item.additionalInputValue;
                }
                if (this.additionalInput2) {
                    newItem.additionalInput2Value = item.additionalInput2Value;
                }
                this.selectedItems.push(newItem);
            });
        }

        _insertNewItems () {
            if (this.newItems && this.newItems.length > 0) {
                this.newItems
                    .map(item => {
                        let obj = {};
                        obj[this.itemText] = item;
                        obj[this.itemKey] = 'newItem';
                        return obj;
                    }).forEach(item => {
                        this.selectedItems.push(this._createSelectedItem(item));
                    });
            }
        }

        _validateItems (selectedItems) {
            this.warnings = [];
            this.errors = [];
            selectedItems.forEach(item => {
                let validation = this.onValidate({'item': item.item});
                if (validation && !validation.valid) {
                    this.warnings = this.warnings.concat(validation.warnings);
                    this.errors = this.errors.concat(validation.errors);
                }
            });
        }
    },
}
angular.module('chpl.components')
    .component('chplExpandableList', ExpandableListComponent);
