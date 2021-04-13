export const InspectListingComponent = {
  templateUrl: 'chpl.components/listing/inspect/listing.html',
  bindings: {
    listing: '<',
    onChange: '&',
    resources: '<',
  },
  controller: class InspectListingController {
    constructor ($log) {
      'ngInject';
      this.$log = $log;
    }

    $onChanges (changes) {
      if (changes.listing) {
        this.listing = angular.copy(changes.listing.currentValue);
      }
      if (changes.resources) {
        this.resources = angular.copy(changes.resources.currentValue);
      }
    }

    editCertifiedProduct () {
      this.isEditing = true;
    }

    handleCancel () {
      this.isEditing = false;
    }

    handleChange (listing) {
      this.isEditing = false;
      this.listing = listing;
      this.onChange({listing: listing});
    }
  },
};

angular.module('chpl.components')
  .component('chplInspectListing', InspectListingComponent);
