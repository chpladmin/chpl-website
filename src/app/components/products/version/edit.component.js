export const VersionEditComponent = {
  templateUrl: 'chpl.components/products/version/edit.html',
  bindings: {
    version: '<',
    isMerging: '<',
    mergingVersions: '<',
    product: '<',
    showFormErrors: '<',
    takeAction: '&',
  },
  controller: class VersionEditComponent {
    constructor ($log) {
      'ngInject';
      this.$log = $log;
      this.takeActionBarAction = this.takeActionBarAction.bind(this);
    }

    $onChanges (changes) {
      if (changes.version) {
        this.version = angular.copy(changes.version.currentValue);
      }
      if (changes.product) {
        this.product = angular.copy(changes.product.currentValue);
      }
      if (changes.isMerging) {
        this.isMerging = angular.copy(changes.isMerging.currentValue);
      }
      if (changes.mergingVersions) {
        this.mergingVersions = angular.copy(changes.mergingVersions.currentValue);
        this.generateErrorMessages();
      }
      if (changes.showFormErrors) {
        this.showFormErrors = angular.copy(changes.showFormErrors.currentValue);
      }
    }

    cancel () {
      this.takeAction({action: 'cancel'});
    }

    generateErrorMessages () {
      let messages = [];
      if (this.showFormErrors) {
        if (this.isMerging && (!this.mergingVersions || this.mergingVersions.length === 0)) {
          messages.push('At least one other Version must be selected to merge');
        }
      }
      this.errorMessages = messages;
    }

    isValid () {
      return this.errorMessages.length === 0 // business logic rules
                && this.form.$valid; // form validation
    }

    save () {
      let request = angular.copy(this.version);
      this.takeAction({action: 'edit', data: request});
    }

    takeActionBarAction (action) {
      switch (action) {
      case 'cancel':
        this.cancel();
        break;
      case 'mouseover':
        this.showFormErrors = true;
        this.generateErrorMessages();
        break;
      case 'save':
        this.save();
        break;
                //no default
      }
    }
  },
};

angular.module('chpl.components')
  .component('chplVersionEdit', VersionEditComponent);
