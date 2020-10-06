export const AddressComponent = {
    templateUrl: 'chpl.components/address/address.html',
    bindings: {
        address: '<',
        isEditing: '<',
        isRequired: '<',
        isDisabled: '<',
        onChange: '&',
        mergeOptions: '<',
        showFormErrors: '<',
    },
    controller: class AddressComponent {
        constructor ($log) {
            'ngInject';
            this.$log = $log;
            this.errorMessages = [];
        }

        $onChanges (changes) {
            if (changes.address) {
                this.address = angular.copy(changes.address.currentValue);
            }
            if (changes.isEditing) {
                this.isEditing = angular.copy(changes.isEditing.currentValue);
            }
            if (changes.isRequired) {
                this.isRequired = angular.copy(changes.isRequired.currentValue);
            }
            if (changes.isDisabled) {
                this.isDisabled = angular.copy(changes.isDisabled.currentValue);
            }
            if (changes.mergeOptions) {
                this.mergeOptions = angular.copy(changes.mergeOptions.currentValue);
            }
            if (changes.showFormErrors) {
                this.showFormErrors = angular.copy(changes.showFormErrors.currentValue);
            }
        }

        getDifferences (predicate) {
            if (!this.address || !this.mergeOptions[predicate]) { return; }
            return this.mergeOptions[predicate]
                .filter(e => e && e.length > 0 && e !== this.address[predicate])
                .sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
        }

        selectDifference (predicate, value) {
            this.address[predicate] = value;
            this.update();
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
};

angular.module('chpl.components')
    .component('chplAddress', AddressComponent);
