const VersionComponent = {
  templateUrl: 'chpl.components/version/version.html',
  bindings: {
    version: '<',
    developer: '<',
    canEdit: '<',
    canMerge: '<',
    canSplit: '<',
    canView: '<',
    isEditing: '<',
    isInvalid: '<',
    isSplitting: '<',
    onCancel: '&',
    onEdit: '&',
    takeAction: '&',
  },
  controller: class VersionComponent {
    constructor($filter, $log, authService) {
      'ngInject';

      this.$filter = $filter;
      this.$log = $log;
      this.hasAnyRole = authService.hasAnyRole;
    }

    $onChanges(changes) {
      if (changes.version) {
        this.version = angular.copy(changes.version.currentValue);
      }
      if (changes.developer) {
        this.developer = angular.copy(changes.developer.currentValue);
      }
      if (changes.canEdit) {
        this.canEdit = angular.copy(changes.canEdit.currentValue);
      }
      if (changes.canMerge) {
        this.canMerge = angular.copy(changes.canMerge.currentValue);
      }
      if (changes.canSplit) {
        this.canSplit = angular.copy(changes.canSplit.currentValue);
      }
      if (changes.canView) {
        this.canView = angular.copy(changes.canView.currentValue);
      }
      if (changes.isEditing) {
        this.isEditing = angular.copy(changes.isEditing.currentValue);
      }
      if (changes.isInvalid) {
        this.isInvalid = angular.copy(changes.isInvalid.currentValue);
      }
      if (changes.isSplitting) {
        this.isSplitting = angular.copy(changes.isSplitting.currentValue);
      }
    }

    /*
     * Allowed actions
     */
    can(action) {
      switch (action) {
        case 'edit':
          return this.canEdit // allowed by containing component
            && (this.hasAnyRole(['chpl-admin', 'chpl-onc']) // always allowed as ADMIN/ONC
                || this.hasAnyRole(['chpl-onc-acb']) && this.developer.status.status === 'Active'); // allowed for ACB iff Developer is "Active"
        case 'merge':
          return this.canMerge // allowed by containing component
            && this.hasAnyRole(['chpl-admin', 'chpl-onc']); // always allowed as ADMIN/ONC
        case 'split':
          return this.canSplit // allowed by containing component
            && (this.hasAnyRole(['chpl-admin', 'chpl-onc']) // always allowed as ADMIN/ONC
                || this.hasAnyRole(['chpl-onc-acb']) && this.developer.status.status === 'Active'); // allowed for ACB iff Developer is "Active"o
        default:
          return false;
      }
    }

    /*
     * Initiate changes
     */
    edit() {
      this.takeAction({
        action: 'edit',
        id: this.version.id,
      });
    }

    merge() {
      this.takeAction({
        action: 'merge',
        id: this.version.id,
      });
    }

    split() {
      this.takeAction({
        action: 'split',
        id: this.version.id,
      });
    }

    view() {
      this.takeAction({
        id: this.version.id,
      });
    }

    /*
     * Resolve changes
     */
    save() {
      this.onEdit({ version: this.version });
    }

    cancel() {
      this.onCancel();
    }

    /*
     * Form validation
     */
    isValid() {
      return this.form.$valid // basic form validation
        && !this.isInvalid; // validation from outside
    }
  },
};

angular.module('chpl.components')
  .component('chplVersion', VersionComponent);

export default VersionComponent;
