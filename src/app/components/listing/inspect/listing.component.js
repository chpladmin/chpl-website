import { jsJoda } from 'services/date-util';

const InspectListingComponent = {
  templateUrl: 'chpl.components/listing/inspect/listing.html',
  bindings: {
    listing: '<',
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
          certificationEdition: this.listing.edition?.name,
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
    }
  },
};

angular.module('chpl.components')
  .component('chplInspectListing', InspectListingComponent);

export default InspectListingComponent;
