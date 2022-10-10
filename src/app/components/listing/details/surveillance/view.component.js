import {
  getRequirementDisplay,
  interpretRequirements,
  sortSurveillances,
} from 'services/surveillance.service';

const surveillanceResults = (surv) => {
  const results = [];
  for (let i = 0; i < surv.requirements.length; i += 1) {
    for (let j = 0; j < surv.requirements[i].nonconformities.length; j += 1) {
      let result = `${surv.requirements[i].nonconformities[j].nonconformityStatus} Non-Conformity Found for `;
      result += getRequirementDisplay(surv.requirements[i]);
      result += '<br />';
      results.push(result);
    }
  }
  if (results.length === 0) {
    results.push('No Non-Conformities Found');
  }
  return results;
};

const SurveillanceComponent = {
  templateUrl: 'chpl.components/listing/details/surveillance/view.html',
  bindings: {
    allowEditing: '<',
    certifiedProduct: '<',
  },
  controller: class SurveillanceController {
    constructor($filter, $log, $uibModal, API, DateUtil, authService, networkService) {
      'ngInject';

      this.$filter = $filter;
      this.$log = $log;
      this.$uibModal = $uibModal;
      this.API = API;
      this.DateUtil = DateUtil;
      this.authService = authService;
      this.networkService = networkService;
    }

    $onInit() {
      this.API_KEY = this.authService.getApiKey();
      this.surveillanceTypes = this.networkService.getSurveillanceLookups();
    }

    $onChanges(changes) {
      if (changes.certifiedProduct) {
        this.interpretListing(changes.certifiedProduct.currentValue);
      }
      if (changes.allowEditing) {
        this.allowEditing = angular.copy(changes.allowEditing.currentValue);
      }
    }

    editSurveillance(surveillance) {
      this.uibModalInstance = this.$uibModal.open({
        component: 'aiSurveillanceEdit',
        animation: false,
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        resolve: {
          surveillance: () => surveillance,
          surveillanceTypes: () => this.surveillanceTypes,
          workType: () => 'edit',
        },
      });
      this.uibModalInstance.result.then(() => {
        this.networkService.getListing(this.certifiedProduct.id, true)
          .then((result) => {
            this.interpretListing(result);
          });
      }, (result) => {
        if (result !== 'cancelled') {
          this.$log.info(result);
        }
      });
    }

    getTitle(surv) {
      let title = surv.endDay
        ? `Closed Surveillance, Ended ${this.DateUtil.getDisplayDateFormat(surv.endDay)}: `
        : `Open Surveillance, Began ${this.DateUtil.getDisplayDateFormat(surv.startDay)}: `;
      let open = 0;
      let closed = 0;
      for (let i = 0; i < surv.requirements.length; i += 1) {
        for (let j = 0; j < surv.requirements[i].nonconformities.length; j += 1) {
          if (surv.requirements[i].nonconformities[j].nonconformityStatus === 'Open') {
            open += 1;
          }
          if (surv.requirements[i].nonconformities[j].nonconformityStatus === 'Closed') {
            closed += 1;
          }
        }
      }
      if (open && closed) {
        title += `${open} Open and ${closed} Closed Non-Conformities Were Found`;
      } else if (open) {
        if (open === 1) {
          title += '1 Open Non-Conformity Was Found';
        } else {
          title += `${open} Open Non-Conformities Were Found`;
        }
      } else if (closed) {
        if (closed === 1) {
          title += '1 Closed Non-Conformity Was Found';
        } else {
          title += `${closed} Closed Non-Conformities Were Found`;
        }
      } else {
        title += 'No Non-Conformities Were Found';
      }
      return title;
    }

    initiateSurveillance() {
      this.uibModalInstance = this.$uibModal.open({
        component: 'aiSurveillanceEdit',
        animation: false,
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        resolve: {
          surveillance: () => ({ certifiedProduct: this.certifiedProduct }),
          surveillanceTypes: () => this.surveillanceTypes,
          workType: () => 'initiate',
        },
      });
      this.uibModalInstance.result.then(() => {
        this.networkService.getListing(this.certifiedProduct.id, true)
          .then((result) => {
            this.interpretListing(result);
          });
      }, (result) => {
        if (result !== 'cancelled') {
          this.$log.info(result);
        }
      });
    }

    interpretListing(listing) {
      this.certifiedProduct = {
        ...listing,
        surveillance: listing.surveillance
          .map((surv) => ({
            ...surv,
            requirements: surv.requirements ? interpretRequirements(surv.requirements) : [],
            display: surveillanceResults(surv),
          }))
          .sort(sortSurveillances),
      };
    }
  },
};

angular
  .module('chpl.components')
  .component('aiSurveillance', SurveillanceComponent);

export default SurveillanceComponent;
