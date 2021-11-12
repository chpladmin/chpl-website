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
      this.nonconformityTypes = angular.copy(this.resolve.nonconformityTypes);
    }

    cancel() {
      this.close();
    }

    isNonconformityTypeRemoved(type) {
      const nonconformityType = this.nonconformityTypes.data.find((ncType) => ncType.number === type);
      if (nonconformityType) {
        return nonconformityType.removed;
      }
      return false;
    }
  },
};

angular
  .module('chpl.components')
  .component('aiSurveillanceNonconformityInspect', SurveillanceNonconformityInspectComponent);

export default SurveillanceNonconformityInspectComponent;
