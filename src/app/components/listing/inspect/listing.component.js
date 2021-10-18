const InspectListingComponent = {
  templateUrl: 'chpl.components/listing/inspect/listing.html',
  bindings: {
    listing: '<',
    onChange: '&',
    resources: '<',
  },
  controller: class InspectListingController {
    constructor($log, DateUtil) {
      'ngInject';

      this.$log = $log;
      this.DateUtil = DateUtil;
    }

    $onChanges(changes) {
      if (changes.listing) {
        this.listing = angular.copy(changes.listing.currentValue);
      }
      if (changes.resources) {
        this.resources = angular.copy(changes.resources.currentValue);
      }
    }

    editCertifiedProduct() {
      this.isEditing = true;
      this.onChange({ action: 'edit' });
    }

    handleCancel() {
      this.isEditing = false;
      this.onChange({ action: 'cancel' });
    }

    handleChange(listing) {
      this.isEditing = false;
      this.listing = listing;
      this.onChange({ action: 'save', data: listing });
    }
  },
};

angular.module('chpl.components')
  .component('chplInspectListing', InspectListingComponent);

export default InspectListingComponent;
