export const AddressComponent = {
    templateUrl: 'chpl.components/address/address.html',
    bindings: {
        address: '<',
        isEditing: '<',
        onChange: '&?',
    },
    controller: class AddressComponent {
        constructor () {
            'ngInject'
        }

        $onChanges (changes) {
            if (changes.address) {
                this.address = angular.copy(changes.address.currentValue);
            }
            if (changes.isEditing) {
                this.isEditing = angular.copy(changes.isEditing.currentValue);
            }
        }
    },
}

angular.module('chpl.components')
    .component('chplAddress', AddressComponent);
