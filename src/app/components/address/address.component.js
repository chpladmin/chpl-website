export const AddressComponent = {
    templateUrl: 'chpl.components/address/address.html',
    bindings: {
        address: '<',
        formHorizontal: '<',
        isEditing: '<',
        isRequired: '<',
        onChange: '&',
        showFormErrors: '<',
    },
    controller: class AddressComponent {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
            this.errorMessages = [];
        }

        $onChanges (changes) {
            if (changes.address) {
                this.address = angular.copy(changes.address.currentValue);
            }
            if (changes.formHorizontal) {
                this.formHorizontal = angular.copy(changes.formHorizontal.currentValue);
            }
            if (changes.isEditing) {
                this.isEditing = angular.copy(changes.isEditing.currentValue);
            }
            if (changes.isRequired) {
                this.isRequired = angular.copy(changes.isRequired.currentValue);
            }
            if (changes.showFormErrors) {
                this.showFormErrors = angular.copy(changes.showFormErrors.currentValue);
            }
        }

        update () {
            this.errorMessages = [];
            if (this.valuesRequired()) {
                if (!this.address || !this.address.line1) { this.errorMessages.push('Line 1 is required'); }
                if (!this.address || !this.address.city) { this.errorMessages.push('City is required'); }
                if (!this.address || !this.address.state) { this.errorMessages.push('State is required'); }
                if (!this.address || !this.address.zipcode) { this.errorMessages.push('Zip is required'); }
                if (!this.address || !this.address.country) { this.errorMessages.push('Country is required'); }
            }
            this.onChange({
                address: this.address,
                errors: this.errorMessages,
                validForm: this.form.$valid && this.errorMessages.length === 0,
            });
        }

        valuesRequired () {
            return !!this.isRequired ||
                !!this.address && (
                    !!this.address.line1 ||
                        !!this.address.line2 ||
                        !!this.address.city ||
                        !!this.address.state ||
                        !!this.address.zipcode ||
                        !!this.address.country);
        }
    },
}

angular.module('chpl.components')
    .component('chplAddress', AddressComponent);
