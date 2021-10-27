export const SurveillanceViewContainerComponent = {
  templateUrl: 'chpl.components/listing/details/surveillance/view-container.html',
  bindings: {
    resolve: '<',
    dismiss: '&',
  },
  controller: class SurveillanceViewContainerController {
    constructor($log) {
      'ngInject';

      this.$log = $log;
    }

    $onChanges(changes) {
      this.surveillance = angular.copy(changes.resolve.currentValue.surveillance);
      this.surveillanceRequirements = angular.copy(changes.resolve.currentValue.surveillanceRequirements);
      this.nonconformityTypes = angular.copy(changes.resolve.currentValue.nonconformityTypes);
    }
  },
};

angular
  .module('chpl.components')
  .component('chplSurveillanceViewContainerComponent', SurveillanceViewContainerComponent);

export default SurveillanceViewContainerComponent;
