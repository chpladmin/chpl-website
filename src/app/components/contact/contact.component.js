export const ContactComponent = {
    templateUrl: 'chpl.components/contact/contact.html',
    bindings: {
        contact: '<',
        formHorizontal: '<',
        isEditing: '<',
        isRequired: '<',
        onChange: '&',
        showFormErrors: '<',
    },
    controller: class ContactComponent {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
            this.errorMessages = [];
        }

        $onChanges (changes) {
            if (changes.contact) {
                this.contact = angular.copy(changes.contact.currentValue);
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
                if (!this.contact || !this.contact.fullName) { this.errorMessages.push('Full name is required'); }
                if (!this.contact || !this.contact.email) { this.errorMessages.push('Email is required'); }
                if (!this.contact || !this.contact.phoneNumber) { this.errorMessages.push('Phone number is required'); }
            }
            this.onChange({
                contact: this.contact,
                errors: this.errorMessages,
            });
        }

        valuesRequired () {
            return !!this.isRequired ||
                !!this.contact && (
                    !!this.contact.fullName ||
                        !!this.contact.friendlyName ||
                        !!this.contact.title ||
                        !!this.contact.email ||
                        !!this.contact.phoneNumber);
        }
    },
}

angular.module('chpl.components')
    .component('chplContact', ContactComponent);
