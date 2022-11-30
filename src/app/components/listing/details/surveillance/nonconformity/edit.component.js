import { sortNonconformityTypes } from 'services/surveillance.service';

const SurveillanceNonconformityEditComponent = {
  templateUrl: 'chpl.components/listing/details/surveillance/nonconformity/edit.html',
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&',
  },
  controller: class SurveillanceNonconformityEditController {
    constructor($log, API, authService, networkService) {
      'ngInject';

      this.$log = $log;
      this.API = API;
      this.networkService = networkService;
      this.sortNonconformityTypes = sortNonconformityTypes;
      this.item = {
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
          'API-Key': authService.getApiKey(),
        },
      };
    }

    $onInit() {
      this.nonconformityTypes = this.resolve.surveillanceTypes.nonconformityTypes.data.sort(sortNonconformityTypes);
      this.disableValidation = this.resolve.disableValidation;
      this.nonconformity = angular.copy(this.resolve.nonconformity);
      this.randomized = this.resolve.randomized;
      this.randomizedSitesUsed = this.resolve.randomizedSitesUsed;
      this.requirementId = this.resolve.requirementId;
      this.showFormErrors = false;
      this.surveillanceId = this.resolve.surveillanceId;
      this.workType = this.resolve.workType;
      this.nonconformityType = this.nonconformity.type?.title ? this.nonconformityTypes
        .find((t) => t.title === this.nonconformity.type.title) : undefined;
    }

    cancel() {
      this.dismiss();
    }

    save() {
      if (this.nonconformity.nonconformityCloseDay) {
        this.nonconformity.nonconformityStatus = 'Closed';
      } else {
        this.nonconformity.nonconformityStatus = 'Open';
      }
      this.nonconformity.type = this.nonconformityType;
      this.close({ $value: this.nonconformity });
    }
  },
};

angular
  .module('chpl.components')
  .component('aiSurveillanceNonconformityEdit', SurveillanceNonconformityEditComponent);

export default SurveillanceNonconformityEditComponent;
