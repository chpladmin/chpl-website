export const SurveillanceViewContainerComponent = {
  templateUrl: 'chpl.components/listing/details/surveillance/view-container.html',
  bindings: {
    surveillance: '<',
  },
  controller: class SurveillanceController {
    constructor($filter, $log, $uibModal, API, authService, networkService, utilService) {
      'ngInject';

      this.$filter = $filter;
      this.$log = $log;
      this.$uibModal = $uibModal;
      this.API = API;
      this.authService = authService;
      this.networkService = networkService;
      this.utilService = utilService;
    }

    $onInit() {
      this.API_KEY = this.authService.getApiKey();
    }
  },
};
angular
  .module('chpl.components')
  .component('chplSurveillanceViewContainerComponent', SurveillanceViewContainerComponent);
