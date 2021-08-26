const SurveillanceNonconformityInspectComponent = {
  templateUrl: 'chpl.components/listing/details/surveillance/nonconformity/inspect.html',
  bindings: {
    resolve: '<',
    close: '&',
  },
  controller: class SurveillanceNonconformityInspectController {
    constructor($log, DateUtil) {
      'ngInject';

      this.$log = $log;
      this.DateUtil = DateUtil;
    }

    $onInit() {
      this.nonconformities = angular.copy(this.resolve.nonconformities);
    }

    cancel() {
      this.close();
    }
  },
};

angular
  .module('chpl.components')
  .component('aiSurveillanceNonconformityInspect', SurveillanceNonconformityInspectComponent);

export default SurveillanceNonconformityInspectComponent;
