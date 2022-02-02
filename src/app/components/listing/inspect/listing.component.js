const InspectListingComponent = {
  templateUrl: 'chpl.components/listing/inspect/listing.html',
  bindings: {
    listing: '<',
    onChange: '&',
    resources: '<',
    errors: '<',
    warnings: '<',
  },
  controller: class InspectListingController {
    constructor($log, $scope, DateUtil) {
      'ngInject';

      this.$log = $log;
      this.$scope = $scope;
      this.DateUtil = DateUtil;
    }

    $onChanges(changes) {
      if (changes.listing) {
        this.listing = angular.copy(changes.listing.currentValue);
      }
      if (changes.resources) {
        this.resources = angular.copy(changes.resources.currentValue);
      }
      if (changes.errors) {
        this.errors = angular.copy(changes.errors.currentValue);
      }
      if (changes.warnings) {
        this.warnings = angular.copy(changes.warnings.currentValue);
      }
    }

    editCertifiedProduct() {
      this.isEditing = true;
      this.onChange({ action: 'edit' });
    }

    handleCancel() {
      this.isEditing = false;
      this.onChange({ action: 'cancel' });
      this.$scope.$digest();
    }

    handleChange(listing) {
      this.isEditing = false;
      this.listing = listing;
      this.onChange({ action: 'save', data: listing });
      this.$scope.$digest();
    }
  },
};

angular.module('chpl.components')
  .component('chplInspectListing', InspectListingComponent);

export default InspectListingComponent;
