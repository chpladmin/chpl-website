import { jsJoda } from 'services/date-util';

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
    constructor($log, $scope, DateUtil, networkService) {
      'ngInject';

      this.$log = $log;
      this.$scope = $scope;
      this.DateUtil = DateUtil;
      this.networkService = networkService;
    }

    $onChanges(changes) {
      if (changes.listing) {
        this.listing = angular.copy(changes.listing.currentValue);
        const that = this;
        this.networkService.getAllCriteria({
          activeStartDay: this.listing.certificationDay,
          activeEndDay: jsJoda.LocalDate.now(),
          certificationEdition: this.listing.certificationEdition?.name,
        }).then((data) => {
          const allCriteria = data.map((c) => ({
            success: false,
            criterion: c,
          }));
          that.listing.certificationResults = Array.from([...allCriteria, ...that.listing.certificationResults]
            .reduce((m, cr) => m.set(cr.criterion.id, cr), new Map())
            .values())
            .map((cr) => ({
              ...cr,
              criterion: {
                ...cr.criterion,
                attributes: data.find((c) => c.id === cr.criterion.id)?.attributes,
              },
            }));
        });
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
