export const InspectListingComponent = {
  templateUrl: 'chpl.components/listing/inspect/listing.html',
  bindings: {
    listing: '<',
    onChange: '&',
    resources: '<',
  },
  controller: class InspectListingController {
    constructor ($log, $uibModal, authService, utilService) {
      'ngInject';
      this.$log = $log;
      this.$uibModal = $uibModal;
      this.hasAnyRole = authService.hasAnyRole;
      this.ternaryFilter = utilService.ternaryFilter;
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
      this.editModalInstance = this.$uibModal.open({
        component: 'chplListingEditPage',
        animation: false,
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        resolve: {
          listing: () => this.listing,
          resources: () => this.resources,
        },
      });
      this.editModalInstance.result.then(result => {
        this.listing = result;
        this.onChange({listing: result});
      });
    }
  },
};

angular.module('chpl.components')
  .component('chplInspectListing', InspectListingComponent);
