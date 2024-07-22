export const ContactComponent = {
  templateUrl: 'chpl.components/contact/contact.html',
  bindings: {
    contact: '<',
    formHorizontal: '<',
    isEditing: '<',
    isRequired: '<',
    isDisabled: '<',
    onChange: '&',
    mergeOptions: '<',
    showFormErrors: '<',
  },
  controller: class ContactComponent {
    constructor ($log) {
      'ngInject';
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
      if (!this.contact || !this.mergeOptions[predicate]) { return; }
      return this.mergeOptions[predicate]
        .filter(e => e && e.length > 0 && e !== this.contact[predicate])
        .sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
    }

    selectDifference (predicate, value) {
      this.contact[predicate] = value;
      this.update();
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
      });
    }

    valuesRequired () {
      return !!this.isRequired ||
                !!this.contact && (
                  !!this.contact.fullName ||
                        !!this.contact.email ||
                        !!this.contact.phoneNumber);
    }
  },
};

angular.module('chpl.components')
  .component('chplContact', ContactComponent);
