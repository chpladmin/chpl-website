const SurveillanceComponent = {
  templateUrl: 'chpl.components/listing/details/surveillance/view.html',
  bindings: {
    allowEditing: '<',
    certifiedProduct: '<',
  },
  controller: class SurveillanceController {
    constructor($filter, $log, $uibModal, API, DateUtil, authService, networkService, utilService) {
      'ngInject';

      this.$filter = $filter;
      this.$log = $log;
      this.$uibModal = $uibModal;
      this.API = API;
      this.DateUtil = DateUtil;
      this.authService = authService;
      this.networkService = networkService;
      this.utilService = utilService;
    }

    $onInit() {
      this.API_KEY = this.authService.getApiKey();
      this.sortRequirements = this.utilService.sortRequirements;
      this.surveillanceTypes = this.networkService.getSurveillanceLookups();
      this.sortResults = (result) => {
        const req = result.substring(result.indexOf(' for ') + 5);
        return this.sortRequirements(req);
      };
    }

    $onChanges(changes) {
      if (changes.certifiedProduct) {
        this.certifiedProduct = angular.copy(changes.certifiedProduct.currentValue);
      }
      if (changes.allowEditing) {
        this.allowEditing = angular.copy(changes.allowEditing.currentValue);
      }
    }

    editSurveillance(surveillance) {
      this.fixRequirementOptions();
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
            this.certifiedProduct = result;
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
          if (surv.requirements[i].nonconformities[j].status.name === 'Open') {
            open += 1;
          }
          if (surv.requirements[i].nonconformities[j].status.name === 'Closed') {
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
      this.fixRequirementOptions();
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
            this.certifiedProduct = result;
          });
      }, (result) => {
        if (result !== 'cancelled') {
          this.$log.info(result);
        }
      });
    }

    surveillanceResults(surv) {
      const results = [];
      for (let i = 0; i < surv.requirements.length; i += 1) {
        for (let j = 0; j < surv.requirements[i].nonconformities.length; j += 1) {
          let result = `${surv.requirements[i].nonconformities[j].status.name} Non-Conformity Found for `;
          if (surv.requirements[i].criterion) {
            result += `<span class="${surv.requirements[i].criterion.removed ? 'removed' : ''}">`;
            result += surv.requirements[i].criterion.removed ? 'Removed | ' : '';
            result += `${surv.requirements[i].criterion.number}: ${surv.requirements[i].criterion.title}</span>`;
          } else {
            if (this.isNonconformityTypeRemoved(surv.requirements[i].requirement)) {
              result += '<span class="removed">';
              result += `Removed | ${surv.requirements[i].requirement}</span>`;
            } else {
              result += surv.requirements[i].requirement;
            }
          }
          result += '<br />';
          results.push(result);
        }
      }
      if (results.length === 0) {
        results.push('No Non-Conformities Found');
      }
      return results;
    }

    fixRequirementOptions() {
      if (this.certifiedProduct.certificationEdition.name === '2015') {
        this.surveillanceTypes.surveillanceRequirements.criteriaOptions = this.surveillanceTypes.surveillanceRequirements.criteriaOptions2015;
      } else if (this.certifiedProduct.certificationEdition.name === '2014') {
        this.surveillanceTypes.surveillanceRequirements.criteriaOptions = this.surveillanceTypes.surveillanceRequirements.criteriaOptions2014;
      }
    }

    isRequirementRemoved(name) {
      let requirement = this.surveillanceTypes.surveillanceRequirements.realWorldTestingOptions.find((req) => req.item === name);
      if (requirement) {
        return requirement.removed;
      }
      requirement = this.surveillanceTypes.surveillanceRequirements.transparencyOptions.find((req) => req.item === name);
      if (requirement) {
        return requirement.removed;
      }
      return false;
    }

    isNonconformityTypeRemoved(type) {
      const nonconformityType = this.surveillanceTypes.nonconformityTypes.data.find((ncType) => ncType.number === type);
      if (nonconformityType) {
        return nonconformityType.removed;
      }
      return false;
    }
  },
};

angular
  .module('chpl.components')
  .component('aiSurveillance', SurveillanceComponent);

export default SurveillanceComponent;
